import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb } from "../server/db";
import { localAccounts, users } from "../drizzle/schema";
import { hashPassword, isValidUsername, normalizeUsername } from "../server/localAuth";

const [rawUsername, displayName, password, campusKey = "kosuyolu"] = process.argv.slice(2);
const username = normalizeUsername(rawUsername ?? "");

if (!username || !displayName || !password || password.length < 8 || !isValidUsername(username)) {
  console.error("Kullanım: pnpm admin:create -- kullaniciadi \"Ad Soyad\" \"EnAz8Karakter\" [kampus-key]");
  process.exit(1);
}

const db = await getDb();
if (!db) throw new Error("DATABASE_URL bulunamadı veya veritabanına bağlanılamadı.");

const existing = await db.select({ id: localAccounts.id }).from(localAccounts).where(eq(localAccounts.username, username)).limit(1);
if (existing[0]) throw new Error(`Bu kullanıcı adı zaten mevcut: ${username}`);

const openId = `local:${username}`;
await db.insert(users).values({
  openId,
  name: displayName,
  loginMethod: "local",
  role: "admin",
  lastSignedIn: new Date(),
});
const created = await db.select({ id: users.id }).from(users).where(eq(users.openId, openId)).limit(1);
if (!created[0]) throw new Error("Yönetici kullanıcı kaydı oluşturulamadı.");

await db.insert(localAccounts).values({
  userId: created[0].id,
  username,
  passwordHash: await hashPassword(password),
  accountRole: "teacher",
  campusKey,
  mustChangePassword: true,
  isActive: true,
});

console.log(`Yönetici hesabı oluşturuldu: ${username} (${campusKey})`);
console.log("İlk girişten sonra geçici parolayı değiştirin.");
