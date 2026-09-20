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
import subprocess
import sys
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit


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
        self.completed_urls: set[str] = set()
        self.failures: list[str] = []

    @staticmethod
    def _filename_from_url(url: str) -> str:
        parsed_url = urlsplit(url)
        name = Path(unquote(parsed_url.path)).name

        # 图片代理（例如 wsrv.nl?url=.../image.png）本身没有文件扩展名，
        # 优先从查询参数中的原始图片地址提取文件名。
        if not name or name in {".", ".."}:
            for values in parse_qs(parsed_url.query).values():
                for value in values:
                    candidate = Path(unquote(urlsplit(value).path)).name
                    if candidate and candidate not in {".", ".."}:
                        name = candidate
                        break
                if name and name not in {".", ".."}:
                    break

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

        if url in self.completed_urls:
            return True

        if destination.is_file() and not self.overwrite:
            try:
                self._validate_download(destination, filename, None)
            except OSError:
                # 直接在原文件上续传；curl 会从现有文件大小处继续请求。
                print(f"发现未完成图片，准备续传：{destination}")
            else:
                print(f"跳过已存在图片：{destination}")
                self.completed_urls.add(url)
                return True

        if self.dry_run:
            print(f"计划下载：{url} -> {destination}")
            return True

        if self.overwrite and destination.exists():
            destination.unlink()

        self.output_dir.mkdir(parents=True, exist_ok=True)
        for attempt in range(self.retries + 1):
            try:
                self._download_with_curl(url, filename, destination)
                print(f"已下载图片：{url} -> {destination}")
                self.completed_urls.add(url)
                return True
            except (OSError, subprocess.CalledProcessError) as error:
                if attempt == self.retries:
                    self.failures.append(f"{url}: {error}")
                    print(
                        f"下载失败：{url} ({error})；未完成文件保留为 {destination}",
                        file=sys.stderr,
                    )
                else:
                    print(
                        f"下载重试 ({attempt + 1}/{self.retries})：{url}；继续使用 {destination}",
                        file=sys.stderr,
                    )
        return False

    def _download_with_curl(self, url: str, filename: str, destination: Path) -> None:
        """用 curl 直接下载到目标文件，避免 HEAD 和 Python 分块请求卡住。"""
        curl_base = [
            "curl",
            "--fail",
            "--location",
            "--silent",
            "--show-error",
            "--retry",
            "3",
            "--retry-delay",
            "1",
            "--retry-connrefused",
            "--retry-all-errors",
            "--connect-timeout",
            str(max(1, self.timeout)),
            "--max-time",
            str(max(120, self.timeout * 10)),
            "--user-agent",
            self.user_agent,
            "--output",
            str(destination),
        ]

        try:
            subprocess.run(
                [*curl_base, "--continue-at", "-", url],
                check=True,
            )
        except subprocess.CalledProcessError as error:
            # curl 退出码 33 表示服务端不支持续传；这时清掉半成品，
            # 退回一次完整下载，避免把旧内容和新内容拼在一起。
            if error.returncode != 33 or not destination.exists():
                raise
            print(f"服务器不支持断点续传，改为完整下载：{url}", file=sys.stderr)
            destination.unlink()
            subprocess.run([*curl_base, url], check=True)

        self._validate_download(destination, filename, None)

    def _validate_download(self, path: Path, filename: str, expected_size: int | None) -> None:
        actual_size = path.stat().st_size
        if actual_size <= 0:
            raise OSError(f"文件为空，下载可能未完成：{path}")
        if expected_size is not None and actual_size != expected_size:
            raise OSError(
                f"下载不完整：期望 {expected_size} 字节，实际 {actual_size} 字节"
            )

        if filename.lower().endswith(".png"):
            with path.open("rb") as image_file:
                header = image_file.read(8)
                if actual_size < 12:
                    raise OSError(f"PNG 文件过小，文件可能被截断：{path}")
                image_file.seek(-12, os.SEEK_END)
                trailer = image_file.read(12)
            if header != b"\x89PNG\r\n\x1a\n" or not trailer.endswith(b"IEND\xaeB`\x82"):
                raise OSError(f"PNG 文件校验失败，文件可能被截断：{path}")


def clean_url(raw_url: str) -> str:
    if raw_url.startswith("<") and raw_url.endswith(">"):
        return raw_url[1:-1]
    return raw_url


def direct_image_url(url: str) -> str:
    """将图片代理地址还原为原始图片地址后再下载。"""
    parsed_url = urlsplit(url)
    hostname = parsed_url.hostname.lower() if parsed_url.hostname else ""
    if hostname != "wsrv.nl":
        return url

    original_url = parse_qs(parsed_url.query).get("url", [""])[0].strip()
    if not original_url:
        return url

    original_url = unquote(original_url)
    if original_url.startswith("//"):
        return f"https:{original_url}"
    if original_url.startswith("/"):
        original_url = original_url[1:]
    if not urlsplit(original_url).scheme and original_url.startswith(
        ("raw.githubusercontent.com/", "github.com/")
    ):
        return f"https://{original_url}"
    return original_url


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
        download_url = direct_image_url(url)
        filename = downloader.filename_for(download_url)
        replacement = f"{relative_dir}/{filename}"
        if not downloader.download(download_url, filename):
            replacement = match.group("url")
        return f'{match.group("open")}{replacement}{match.group("close")}'

    def replace_html(match: re.Match[str]) -> str:
        url = match.group("url")
        download_url = direct_image_url(url)
        filename = downloader.filename_for(download_url)
        replacement = f"{relative_dir}/{filename}"
        if not downloader.download(download_url, filename):
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
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print(
            "\n下载被中断；已完成文件保留，未完成的目标文件下次运行会继续。",
            file=sys.stderr,
        )
        raise SystemExit(130)
