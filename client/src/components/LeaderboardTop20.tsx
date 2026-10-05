import { getAvatar } from "@shared/avatars";
import { trpc } from "@/lib/trpc";
import { Trophy } from "lucide-react";
import { useState } from "react";

type LeaderboardEntry = { rank: number; name: string; avatarKey: string; score: number };

function AvatarBadge({ avatarKey, label }: { avatarKey: string; label: string }) {
  const avatar = getAvatar(avatarKey);
  return <span className="leaderboard-avatar" style={{ backgroundColor: `${avatar.tone}18`, color: avatar.tone }} role="img" aria-label={`${label} avatarı: ${avatar.label}`}>{avatar.symbol}</span>;
}

function EntryRow({ entry, personal = false }: { entry: LeaderboardEntry; personal?: boolean }) {
  return <li className={`leaderboard-row ${entry.rank <= 3 ? "leaderboard-row--podium" : ""} ${personal ? "leaderboard-row--personal" : ""}`}><span className="leaderboard-rank" aria-label={`${entry.rank}. sıra`}>{entry.rank > 20 ? "—" : String(entry.rank).padStart(2, "0")}</span><AvatarBadge avatarKey={entry.avatarKey} label={entry.name} /><span className="leaderboard-name">{entry.name}{personal && <small className="leaderboard-personal-label">senin sıran</small>}</span><span className="leaderboard-score"><strong>{entry.score}</strong><small>puan</small></span></li>;
}

export function LeaderboardTop20() {
  const [category, setCategory] = useState<"atlas" | "science">("atlas");
  const leaderboard = trpc.leaderboard.top20.useQuery(undefined, { enabled: category === "atlas" });
  const scienceLeaderboard = trpc.leaderboard.scienceTop20.useQuery(undefined, { enabled: category === "science" });
  const loading = category === "science" ? scienceLeaderboard.isLoading : leaderboard.isLoading;
  const error = category === "science" ? scienceLeaderboard.isError : leaderboard.isError;
  const entries: LeaderboardEntry[] = category === "science" ? (scienceLeaderboard.data?.entries ?? []) : (leaderboard.data ?? []);
  const personal = category === "science" ? (scienceLeaderboard.data?.personal ?? null) : null;
  const title = category === "science" ? "İlk 20: bilim ve zekâ izleri" : "İlk 20: izini büyütenler";

  return <section className="leaderboard-panel" aria-labelledby="ilk-20-baslik"><div className="leaderboard-panel__intro"><div><span className="eyebrow eyebrow--ink"><Trophy size={14} /> ortak keşif tahtası</span><h2 id="ilk-20-baslik">{title}</h2><p>{category === "science" ? "Bilim ve Zekâ modülünde benzersiz doğru sorulardan kazanılan puanlar." : "Doğru tamamlanan Atlas görevlerinin puanları."} Eşit puanlar sabit sırayla gösterilir.</p></div><span className="leaderboard-panel__mark" aria-hidden="true">20</span></div><div className="leaderboard-tabs" role="tablist" aria-label="Sıralama kategorisi"><button type="button" role="tab" aria-selected={category === "atlas"} className={category === "atlas" ? "is-active" : ""} onClick={() => setCategory("atlas")}>Atlas puanı</button><button type="button" role="tab" aria-selected={category === "science"} className={category === "science" ? "is-active" : ""} onClick={() => setCategory("science")}>Bilim ve Zekâ</button></div>{loading && <p className="leaderboard-message" role="status">Sıralama hazırlanıyor…</p>}{error && <p className="leaderboard-message" role="status">Sıralama şu anda yüklenemedi. Biraz sonra yeniden dene.</p>}{!loading && !error && entries.length === 0 && <p className="leaderboard-message">Henüz sıralamaya giren öğrenci bulunmuyor. İlk izi sen bırak.</p>}{entries.length > 0 && <ol className="leaderboard-list" aria-label={`${category === "science" ? "Bilim ve Zekâ" : "Atlas"} İlk 20 öğrenci`}>{entries.map(entry => <EntryRow key={`${entry.rank}-${entry.name}`} entry={entry} />)}</ol>}{personal && personal.rank > 20 && <div className="leaderboard-personal-wrap"><p>Senin yerin</p><ol className="leaderboard-list" aria-label="Kişisel Bilim ve Zekâ sırası"><EntryRow entry={personal} personal /></ol></div>}<p className="leaderboard-note">Genel listelerde yalnız aktif öğrenci hesapları bulunur; ad ve soyadın ilk iki harfi gösterilir. Bilim ve Zekâ puanı, her benzersiz doğru soruya 10 puan verir.</p></section>;
}
