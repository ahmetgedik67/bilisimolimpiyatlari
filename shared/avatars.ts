export const AVATAR_OPTIONS = [
  { key: "robot-blue", label: "Mavi robot", symbol: "⚙", tone: "#1f6f8b" },
  { key: "fox-coral", label: "Mercan tilki", symbol: "◆", tone: "#c96b4b" },
  { key: "owl-gold", label: "Altın baykuş", symbol: "◉", tone: "#b48a35" },
  { key: "cat-teal", label: "Turkuaz kedi", symbol: "✦", tone: "#16806f" },
  { key: "panda-ink", label: "Mürekkep panda", symbol: "●", tone: "#334155" },
  { key: "penguin-sky", label: "Gökyüzü penguen", symbol: "◆", tone: "#3f7cac" },
  { key: "lion-coral", label: "Mercan aslan", symbol: "✹", tone: "#d16b52" },
  { key: "rabbit-mint", label: "Nane tavşan", symbol: "⌁", tone: "#43a58b" },
  { key: "dolphin-blue", label: "Mavi yunus", symbol: "≈", tone: "#367da8" },
  { key: "koala-sage", label: "Adaçayı koala", symbol: "●", tone: "#6c8c72" },
  { key: "bee-honey", label: "Bal arısı", symbol: "✦", tone: "#c79a31" },
  { key: "turtle-teal", label: "Teal kaplumbağa", symbol: "◒", tone: "#2b8c83" },
  { key: "panda-coral", label: "Mercan panda", symbol: "●", tone: "#bd6758" },
  { key: "star-gold", label: "Altın yıldız", symbol: "★", tone: "#c49b3f" },
  { key: "comet-violet", label: "Mor kuyruklu yıldız", symbol: "✦", tone: "#7c5aa6" },
  { key: "leaf-green", label: "Yeşil yaprak", symbol: "❧", tone: "#4c8b5f" },
  { key: "moon-navy", label: "Lacivert ay", symbol: "☾", tone: "#405b8f" },
  { key: "gem-rose", label: "Gül kuvars", symbol: "◇", tone: "#b85e82" },
  { key: "mountain-slate", label: "Dağ kaşifi", symbol: "▲", tone: "#65727e" },
  { key: "spark-cyan", label: "Siyan kıvılcım", symbol: "✧", tone: "#208c9b" },
] as const;

export type AvatarKey = (typeof AVATAR_OPTIONS)[number]["key"];

export function getAvatar(key: string | null | undefined) {
  return AVATAR_OPTIONS.find(avatar => avatar.key === key) ?? AVATAR_OPTIONS[0];
}
