const ASSET_BASE = import.meta.env.BASE_URL;

/** İz sürme kampında düşünme modunun bilgesi: Albert Einstein (kamuya mal olmuş 1921 portresi). */
export const THINKER_THINKING_IMAGE = `${ASSET_BASE}assets/genius/einstein.jpg`;
/** Kutlama modunun bilgesi: Grace Hopper (ABD Donanması, kamuya mal olmuş portre). */
export const THINKER_CELEBRATE_IMAGE = `${ASSET_BASE}assets/genius/hopper.jpg`;
/** Atölye ve bilim modüllerinin bilgesi: Ada Lovelace (kamuya mal olmuş portre). */
export const THINKER_IMAGE = `${ASSET_BASE}assets/genius/lovelace.jpg`;

export const THINKER_NAMES = {
  thinking: "Albert Einstein",
  celebrate: "Grace Hopper",
  guide: "Ada Lovelace",
} as const;
