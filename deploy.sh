#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件（BASE=/blog/ 使产物能在 GitHub Pages 的 /blog/ 子路径下正常显示）
BASE='/blog/' pnpm docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 推送到 blog 仓库的 gh-pages 分支（GitHub Pages 备用入口）
# 用 HEAD 代替 master：git init 默认分支可能是 main，用 HEAD 最稳妥
git push -f git@github.com:huanglian666/blog.git HEAD:gh-pages

cd -
