#!/usr/bin/env bash
set -euo pipefail

FILE="${1:?Kullanım: ./scripts/restore-db.sh backups/bilfen-atlas-YYYYMMDD-HHMMSS.sql.gz}"
if [[ ! -f "$FILE" ]]; then
  echo "Yedek dosyası bulunamadı: $FILE" >&2
  exit 1
fi

gzip -dc "$FILE" | docker compose exec -T db sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" bilfen_atlas'
printf 'Yedek geri yüklendi: %s\n' "$FILE"
