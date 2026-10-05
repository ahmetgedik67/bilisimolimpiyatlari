# Bilfen Algoritma Atlası — Kuruluma Hazır Dağıtım Paketi

Bu paket, Bilfen Eğitim Kurumları için geliştirilen **Bilfen Algoritma Atlası** platformunun başka bir Linux sunucuya kurulabilir kaynak kodunu, Drizzle/MySQL migration zincirini, yerel görsellerini ve Docker Compose kurulumunu içerir.

## İçerik

- React 19 + Vite istemci uygulaması
- Express + tRPC sunucusu
- Drizzle ORM ile MySQL şeması
- Öğrenci, öğretmen ve yönetici yerel hesapları
- 19 Bilfen kampüsü, 5/6/7 sınıf ve Explorer/Innovator/Designer grupları
- 35 adımlı Bilfen Algoritma Atlası
- 20 soruluk Bilim ve Zekâ modülü
- Öğretmen paneli, CSV öğrenci aktarımı, grup düzenleme ve analizler
- Yönetici kampüs karşılaştırma raporu
- Drizzle migration dosyaları: `drizzle/0000...sql` — `drizzle/0010...sql`
- Taşınabilir Robi ve Bilfen görselleri: `client/public/assets/`
- Dockerfile, `docker-compose.yml`, veritabanı yedekleme ve geri yükleme betikleri

## En hızlı kurulum: Docker Compose

Gereksinimler: Docker Engine ve Docker Compose Plugin.

```bash
git clone <bu-paketin-git-adresi> bilfen-algoritma-atlasi
cd bilfen-algoritma-atlasi
cp docs/env.template .env
```

`.env` içindeki `JWT_SECRET` değerini en az 32 karakterlik rastgele bir değerle değiştirin. Ardından:

```bash
docker compose up -d --build
```

Uygulama: `http://SUNUCU_IP:3000`

İlk başlatmada container, MySQL hazır olduktan sonra `drizzle-kit migrate` çalıştırır ve bütün migrationları sırayla uygular.

> Üretimde Compose dosyasındaki örnek MySQL ve JWT parolalarını mutlaka değiştirin. Dış dünyaya yalnızca reverse proxy (Nginx/Caddy/Traefik) üzerinden HTTPS açmanız önerilir.

## İlk yönetici hesabı

Yerel hesap sistemi OAuth gerektirmez. Container çalıştıktan sonra ilk yönetici hesabını oluşturun:

```bash
docker compose exec app pnpm admin:create -- yonetici "Bilfen Yöneticisi" "GucluGeciciParola123" kosuyolu
```

Kampüs anahtarları `shared/campuses.ts` içindedir. İlk girişten sonra geçici parolayı değiştirin.

İlk öğretmen ve öğrenciler, yönetici/öğretmen panelinden oluşturulur. Öğretmenler yalnız kendi kampüslerindeki öğrencileri görür ve yönetir.

## Docker olmadan kurulum

Gereksinimler:

- Node.js 22+
- pnpm 10+
- MySQL 8+

```bash
pnpm install --frozen-lockfile
cp docs/env.template .env
```

`.env` içindeki `DATABASE_URL` değerini yerel MySQL sunucunuza göre ayarlayın:

```text
DATABASE_URL=mysql://bilfen:parola@127.0.0.1:3306/bilfen_atlas
```

Şemayı uygulayın, üretim paketini oluşturun ve başlatın:

```bash
pnpm drizzle-kit migrate
pnpm build
pnpm start
```

Geliştirme modu:

```bash
pnpm dev
```

## Veritabanı

Veritabanı tasarımı TypeScript şema ve sıralı migration dosyalarıyla birlikte gelir:

- `drizzle/schema.ts`: güncel şema
- `drizzle/0000_*.sql` ... `drizzle/0010_*.sql`: migration geçmişi
- `drizzle/meta/`: Drizzle snapshot ve journal dosyaları

Şu ana kadar migrationlar; kullanıcılar, yerel hesaplar, öğrenci profilleri, görevler, öğrenme sonuçları, avatarlar, Bilim ve Zekâ sonuçları, ipucu kullanımları, kampüs/sınıf/alan alanları ve öğretmen atamalarını kapsar.

Yeni bir şema değişikliğinden sonra:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## Yedekleme ve geri yükleme

Compose kurulumu için:

```bash
chmod +x scripts/backup-db.sh scripts/restore-db.sh
./scripts/backup-db.sh backups
./scripts/restore-db.sh backups/bilfen-atlas-YYYYMMDD-HHMMSS.sql.gz
```

Geri yükleme mevcut veritabanındaki kayıtları etkiler. İşlemden önce yeni bir yedek alın.

## Ortam değişkenleri

Şablon: `docs/env.template`.

Zorunlu:

- `DATABASE_URL`
- `JWT_SECRET`

İsteğe bağlı:

- `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`: Manus OAuth
- `OWNER_OPEN_ID`, `OWNER_NAME`: OAuth sahibi yönetici eşleştirmesi
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`: Manus depolama/harita/ses gibi servisler
- `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`: tarayıcı tarafındaki isteğe bağlı servisler

Yerel hesaplarla çalışmak için OAuth ve Manus Forge değişkenleri boş bırakılabilir. Paket, önceki Manus-only görsel yolları yerine `client/public/assets/` altındaki yerel varlıkları kullanır.

## Canlı mevcut verinin aktarılması

Bu arşiv **uygulama kaynak kodunu ve veritabanı şemasını** içerir; canlı üretim veritabanının kullanıcı kayıtları, öğrenci ilerlemeleri ve sonuçları bu pakete otomatik olarak gömülmez. Bunun nedeni parola özetleri ve öğrenci verilerinin güvenli biçimde ayrı tutulmasıdır.

Canlı sistemde veritabanı erişiminiz varsa:

```bash
mysqldump --single-transaction --routines --triggers VERITABANI_ADI > bilfen-atlas-live.sql
```

Hedef MySQL veritabanına migrationlar uygulandıktan sonra yedeği yükleyin:

```bash
mysql -u bilfen -p bilfen_atlas < bilfen-atlas-live.sql
```

Kullanıcı parolaları düz metin olarak saklanmadığından, canlı `localAccounts.passwordHash` alanları dump içinde korunur; buna rağmen dump dosyasını şifreli ve erişimi sınırlı saklayın.

## Kalite kontrolleri

Teslimden önce çalıştırılabilecek kontroller:

```bash
pnpm check
pnpm test
pnpm build
```

## Lisans ve içerik notu

Platformun özgün Bilfen içerikleri, arayüz kodu ve soru akışları bu kaynak paketle birlikte taşınır. Dış kaynaklardan yalnız konu/beceri analizi için yararlanılan araştırma notları ayrıca belgelenmiştir; telifli soruların doğrudan kopyalanması hedeflenmemiştir.
