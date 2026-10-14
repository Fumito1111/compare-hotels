#!/usr/bin/env bash
# src/index.html（平文・git管理外）を StatiCrypt で暗号化し、公開用の ./index.html に出力する。
# パスワードは .env の STATICRYPT_PASSWORD から読み込む（.env もgit管理外）。
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

: "${STATICRYPT_PASSWORD:?.env に STATICRYPT_PASSWORD=... を設定してください}"
if [ "${#STATICRYPT_PASSWORD}" -lt 16 ]; then
  echo "パスワードが短すぎます（16文字以上にしてください）" >&2
  exit 1
fi

# 暗号化ファイルは誰でもダウンロードできるため、総当たり対策として長いパスワード必須
docker run --rm \
  --user "$(id -u):$(id -g)" \
  -e STATICRYPT_PASSWORD \
  -e npm_config_cache=/tmp/.npm \
  -v "$PWD":/work -w /work \
  node:20-alpine \
  npx -y staticrypt@3.5.4 src/index.html -d . \
    --remember 60 \
    --template-title "富士急ハイランド旅行のしおり" \
    --template-instructions "参加メンバー専用ページです。LINEグループで共有したパスワードを入力してください。" \
    --template-placeholder "パスワード" \
    --template-button "開く" \
    --template-remember "このブラウザで記憶する" \
    --template-error "パスワードが違います" \
    --template-toggle-show "パスワードを表示" \
    --template-toggle-hide "パスワードを隠す" \
    --template-color-primary "#1b5e6b" \
    --template-color-secondary "#f7f6f2" \
    "$@"

echo "暗号化しました: ./index.html"
