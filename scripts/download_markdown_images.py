#!/usr/bin/env python3
"""下载 Markdown 图床图片，并将引用改写为相对路径。

支持单个 Markdown 文件或目录：

    # 处理一篇文章，图片默认保存到文章旁边的 _pic/
    python3 scripts/download_markdown_images.py docs/example.md

    # 递归处理目录下所有 Markdown 文件
    python3 scripts/download_markdown_images.py docs/软考

默认会为每个 Markdown 文件所在目录使用 ``_pic`` 目录，符合当前博客的
文章与图片目录结构。也可以用 ``--output-dir`` 将所有图片放到指定目录。
脚本只处理远程 Markdown/HTML 图片（http/https），已有本地引用保持不变。
"""

from __future__ import annotations

import argparse
import hashlib
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen


MARKDOWN_IMAGE_RE = re.compile(
    r"(?P<open>!\[[^\]]*\]\(\s*)"
    r"(?P<url><https?://[^>\n]+>|https?://[^)\s]+)"
    r"(?P<close>\s*(?:[\"'][^)]*[\"'])?\s*\))"
)
HTML_IMAGE_RE = re.compile(
    r"(?P<open><img\b[^>]*?\bsrc\s*=\s*[\"'])"
    r"(?P<url>https?://[^\"']+)"
    r"(?P<close>[\"'])",
    re.IGNORECASE,
)
SKIP_DIRS = {".git", ".vuepress", "node_modules", "dist", "_pic"}


class ImageDownloader:
    """在一个图片目录内下载图片并分配稳定文件名。"""

    def __init__(
        self,
        output_dir: Path,
        timeout: int,
        retries: int,
        user_agent: str,
        dry_run: bool,
        overwrite: bool,
    ) -> None:
        self.output_dir = output_dir
        self.timeout = timeout
        self.retries = retries
        self.user_agent = user_agent
        self.dry_run = dry_run
        self.overwrite = overwrite
        self.names: dict[str, str] = {}
        self.used_names: dict[str, str] = {}
        self.failures: list[str] = []

    @staticmethod
    def _filename_from_url(url: str) -> str:
        name = Path(unquote(urlsplit(url).path)).name
        if name and name not in {".", ".."}:
            return name
        return f"image-{hashlib.sha1(url.encode()).hexdigest()[:12]}.img"

    def filename_for(self, url: str) -> str:
        if url in self.names:
            return self.names[url]

        requested = self._filename_from_url(url)
        source_key = f"url:{url}"
        existing_source = self.used_names.get(requested)
        if existing_source is not None and existing_source != source_key:
            stem = Path(requested).stem
            suffix = Path(requested).suffix
            requested = (
                f"{stem}-{hashlib.sha1(url.encode()).hexdigest()[:8]}{suffix}"
            )
        self.used_names[requested] = source_key
        self.names[url] = requested
        return requested

    def download(self, url: str, filename: str) -> bool:
        destination = self.output_dir / filename
        if destination.is_file() and destination.stat().st_size > 0 and not self.overwrite:
            print(f"跳过已存在图片：{destination}")
            return True
        if self.dry_run:
            print(f"计划下载：{url} -> {destination}")
            return True

        request = Request(url, headers={"User-Agent": self.user_agent})
        for attempt in range(self.retries + 1):
            temporary_path: Path | None = None
            try:
                self.output_dir.mkdir(parents=True, exist_ok=True)
                with urlopen(request, timeout=self.timeout) as response:
                    fd, temporary_name = tempfile.mkstemp(
                        prefix=f".{filename}.",
                        suffix=".part",
                        dir=self.output_dir,
                    )
                    os.close(fd)
                    temporary_path = Path(temporary_name)
                    with temporary_path.open("wb") as output:
                        shutil.copyfileobj(response, output)
                    temporary_path.replace(destination)
                print(f"已下载图片：{url} -> {destination}")
                return True
            except (HTTPError, URLError, TimeoutError, OSError) as error:
                if temporary_path is not None:
                    temporary_path.unlink(missing_ok=True)
                if attempt == self.retries:
                    self.failures.append(f"{url}: {error}")
                    print(f"下载失败：{url} ({error})", file=sys.stderr)
                else:
                    print(
                        f"下载重试 ({attempt + 1}/{self.retries})：{url}",
                        file=sys.stderr,
                    )
        return False


def clean_url(raw_url: str) -> str:
    if raw_url.startswith("<") and raw_url.endswith(">"):
        return raw_url[1:-1]
    return raw_url


def image_path(markdown_file: Path, output_dir: Path) -> str:
    """生成从 Markdown 文件到图片目录的 POSIX 相对路径。"""
    relative_dir = Path(os.path.relpath(output_dir, markdown_file.parent)).as_posix()
    if not relative_dir.startswith("."):
        relative_dir = f"./{relative_dir}"
    return relative_dir.rstrip("/")


def rewrite_file(markdown_file: Path, downloader: ImageDownloader, output_dir: Path) -> bool:
    content = markdown_file.read_text(encoding="utf-8")
    relative_dir = image_path(markdown_file, output_dir)

    def replace_markdown(match: re.Match[str]) -> str:
        url = clean_url(match.group("url"))
        filename = downloader.filename_for(url)
        replacement = f"{relative_dir}/{filename}"
        if not downloader.download(url, filename):
            replacement = match.group("url")
        return f'{match.group("open")}{replacement}{match.group("close")}'

    def replace_html(match: re.Match[str]) -> str:
        url = match.group("url")
        filename = downloader.filename_for(url)
        replacement = f"{relative_dir}/{filename}"
        if not downloader.download(url, filename):
            replacement = url
        return f'{match.group("open")}{replacement}{match.group("close")}'

    rewritten = MARKDOWN_IMAGE_RE.sub(replace_markdown, content)
    rewritten = HTML_IMAGE_RE.sub(replace_html, rewritten)
    changed = rewritten != content
    if changed and not downloader.dry_run:
        markdown_file.write_text(rewritten, encoding="utf-8")
        print(f"已改写引用：{markdown_file}")
    elif changed:
        print(f"计划改写引用：{markdown_file}")
    return changed


def markdown_files(paths: list[Path]) -> list[Path]:
    files: set[Path] = set()
    for path in paths:
        path = path.expanduser().resolve()
        if path.is_file() and path.suffix.lower() == ".md":
            files.add(path)
            continue
        if not path.is_dir():
            print(f"跳过不存在路径：{path}", file=sys.stderr)
            continue
        for root, directories, names in os.walk(path):
            directories[:] = sorted(
                directory for directory in directories if directory not in SKIP_DIRS
            )
            for name in names:
                if name.endswith(".md"):
                    files.add(Path(root) / name)
    return sorted(files)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path, help="Markdown 文件或目录，可传多个")
    parser.add_argument(
        "--output-dir",
        type=Path,
        help="统一图片输出目录；默认每篇文章旁边的 _pic/",
    )
    parser.add_argument(
        "--image-dir-name",
        default="_pic",
        help="默认图片目录名（默认：_pic）",
    )
    parser.add_argument("--timeout", type=int, default=30, help="单张图片超时秒数")
    parser.add_argument("--retries", type=int, default=2, help="失败后的重试次数")
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="覆盖已有同名图片；默认直接复用已有文件",
    )
    parser.add_argument("--dry-run", action="store_true", help="只显示计划，不写入文件")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.image_dir_name or Path(args.image_dir_name).name != args.image_dir_name:
        print("--image-dir-name 必须是单层目录名", file=sys.stderr)
        return 1

    files = markdown_files(args.paths)
    if not files:
        print("没有找到 Markdown 文件", file=sys.stderr)
        return 1

    # 同一个输出目录共享一个 downloader，避免不同文章使用相同文件名时互相覆盖。
    shared_output = args.output_dir.expanduser().resolve() if args.output_dir else None
    downloaders: dict[Path, ImageDownloader] = {}
    changed_count = 0

    for markdown_file in files:
        output_dir = shared_output or markdown_file.parent / args.image_dir_name
        output_dir = output_dir.resolve()
        downloader = downloaders.get(output_dir)
        if downloader is None:
            downloader = ImageDownloader(
                output_dir=output_dir,
                timeout=args.timeout,
                retries=max(0, args.retries),
                user_agent="Mozilla/5.0 (Markdown image localizer)",
                dry_run=args.dry_run,
                overwrite=args.overwrite,
            )
            downloaders[output_dir] = downloader
        try:
            if rewrite_file(markdown_file, downloader, output_dir):
                changed_count += 1
        except (OSError, UnicodeError) as error:
            print(f"处理失败：{markdown_file} ({error})", file=sys.stderr)
            downloader.failures.append(f"{markdown_file}: {error}")

    failures = [failure for downloader in downloaders.values() for failure in downloader.failures]
    print(f"\n处理完成：{len(files)} 篇 Markdown，改写 {changed_count} 篇。")
    if failures:
        print(f"失败 {len(failures)} 项：", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
