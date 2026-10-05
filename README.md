# Bilfen Algoritma Atlası — Bilişim Olimpiyatları Platformu

Bilfen Eğitim Kurumları bilişim olimpiyatı hazırlık programı için geliştirilen
tam kapsamlı öğrenme platformu: 35 adımlı **Bilfen Algoritma Atlası** müfredatı,
20 soruluk **Bilim ve Zekâ** modülü, öğrenci/öğretmen/yönetici panelleri ve
kampüs karşılaştırma raporları.

> Bu depo, `ahmetgedik67/bilisimolimpiyatlari` projesinin resmî kaynak
> kodudur ve başka Linux sunuculara da kurulabilir şekilde paketlenmiştir.

## Öne çıkanlar

- **React 19 + Vite** istemcisi, **Express + tRPC** sunucusu
- **Drizzle ORM** ile **PostgreSQL** şeması (Supabase ücretsiz planı ile uyumlu)
- Yerel hesap sistemi (scrypt ile şifre saklama, OAuth zorunlu değil)
- 19 Bilfen kampüsü, 5/6/7. sınıf ve Explorer/Innovator/Designer grupları
- Öğretmen paneli: CSV ile toplu öğrenci aktarımı, grup düzenleme, analizler
- Yönetici raporu: kampüs karşılaştırma panosu
- Docker Compose ile tek komut kurulum

## Hızlı başlangıç (Docker Compose)

Gereksinim: Docker Engine + Compose eklentisi

```bash
git clone https://github.com/ahmetgedik67/bilisimolimpiyatlari.git bilfen-algoritma-atlasi
cd bilfen-algoritma-atlasi
cp docs/env.template .env
# .env içindeki JWT_SECRET değerini en az 32 karakterlik rastgele bir değerle değiştirin
docker compose up -d --build
```

Uygulama: `http://SUNUCU_IP:3000`
İlk açılışta container, migration zincirini (`drizzle/0000…` → `drizzle/0010…`) otomatik uygular.

## İlk yönetici hesabı

```bash
docker compose exec app pnpm admin:create -- yonetici "Bilfen Yöneticisi" "GucluGeciciParola123" kosuyolu
```

Kampüs anahtarları `shared/campuses.ts` içindedir. İlk girişten sonra geçici
parolayı mutlaka değiştirin. Öğretmenler ve öğrenciler panelden oluşturulur;
öğretmenler yalnız kendi kampüslerini görür.

## Docker olmadan kurulum

Gereksinim: Node.js 22+, pnpm 10+, PostgreSQL 16+ (veya ücretsiz Supabase hesabı)

```bash
pnpm install --frozen-lockfile
cp docs/env.template .env
# DATABASE_URL=postgres://bilfen:parola@127.0.0.1:5432/bilfen_atlas
# veya Supabase: DATABASE_URL=postgresql://postgres:SIFRE@db.PROJE_REF.supabase.co:5432/postgres
pnpm drizzle-kit migrate
pnpm build
pnpm start
```

> **Supabase kullanıyorsanız** şemayı sürücüye gerek kalmadan kurabilirsiniz:
> `docs/supabase-schema.sql` dosyasının içeriğini Supabase panelindeki
> **SQL Editor**'e yapıştırıp çalıştırın (ücretsiz plan için önerilir).

## Geliştirme komutları

| Komut | Açıklama |
|---|---|
| `pnpm dev` | Geliştirme sunucusu (tsx watch) |
| `pnpm check` | TypeScript tip denetimi (`tsc --noEmit`) |
| `pnpm test` | Vitest test paketi (51 test) |
| `pnpm build` | Üretim paketi (vite + esbuild) |
| `pnpm admin:create` | Yönetici hesabı oluşturucu |

> Not: `server/trace100.test.ts` C derleyicisi (gcc) ister; gcc kurulu değilse
> yalnız bu test atlanır/hata verir, diğer 50 test çalışır.

## Proje yapısı

```
client/          React istemcisi (Vite, Tailwind, Radix UI)
server/          Express + tRPC API, iş mantığı ve testler
shared/          İstemci-sunucu ortak tipleri ve kampüs listesi
drizzle/         Migration zinciri (0000 → 0010) ve şema
scripts/         admin:create, veritabanı yedekleme/geri yükleme
docker/          Kurulum yardımcıları
docs/            env.template ve dokümantasyon
patches/         pnpm yamaları (wouter)
```

## Güvenlik notları

- `.env` dosyası asla depoya girmez (`docs/env.template` örnek şablondur)
- Compose dosyasındaki PostgreSQL parolaları örnek değerlerdir; üretimde değiştirin
- Dış dünyaya yalnız reverse proxy (Nginx/Caddy/Traefik) üzerinden HTTPS açın
- `research-source/` (TÜBİTAK bilişim olimpiyatı soru kitapçıkları) telif
  gereği depoya dahil değildir

## Lisans

MIT — ayrıntılar için `package.json`.
