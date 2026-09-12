#!/usr/bin/env sh

# 确保脚本遇到错误时立即停止
set -eu

# 本地生成静态文件（BASE=/blog/ 使产物能在 GitHub Pages 的 /blog/ 子路径下正常显示）
BASE='/blog/' pnpm docs:build

echo 'VuePress 构建完成：docs/.vuepress/dist'
echo '构建产物将由 .github/workflows/build-and-push-gh-pages.yml 自动推送到 gh-pages。'
