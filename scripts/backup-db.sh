#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-backups}"
mkdir -p "$OUT_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
FILE="$OUT_DIR/bilfen-atlas-$STAMP.sql.gz"

docker compose exec -T db sh -c 'exec mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers bilfen_atlas' | gzip > "$FILE"
printf 'Yedek oluşturuldu: %s\n' "$FILE"
