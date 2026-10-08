const ASSET_BASE = import.meta.env.BASE_URL;

export const ROBI_THINKING_GIF = `${ASSET_BASE}assets/robi.jpeg`;
export const ROBI_CELEBRATE_IMAGE = `${ASSET_BASE}assets/robi.jpeg`;
export const ROBI_IMAGE = ROBI_THINKING_GIF;

export const robiMessages = {
  hero: {
    label: "Robi · ders rehberi",
    title: "Rotayı birlikte okuyalım.",
    body: "Ben bir işaret bırakırım; kuralı sen keşfedersin.",
  },
  task: {
    label: "Robi · rota rehberi",
    title: "Önce izle, sonra karar ver.",
    body: "Yanıtı söylemem. Değişen değeri, koşulu ya da sayacı bulman için sana yol açarım.",
  },
  lesson: {
    label: "Robi ile çalışma yöntemi",
    title: "Oku · İz sür · Açıkla · Uygula",
    body: "Bir cevabı ezberlemek yerine, her satırın değiştirdiği değeri gerekçesiyle anlat.",
  },
  exam: {
    title: "Robi'nin deneme notu",
    body: "Süreyi değil, adımları yönet: önce kodu sakin biçimde oku; sonra seçeneğini işaretle.",
  },
} as const;

export const robiLessonPrompts = {
  akis: "Başlangıç değerini kodun sol kenarında sakla; değer değiştiğinde notunu yenile.",
  degisken: "Her değişkeni ayrı bir kutu gibi düşün; bir kutudaki değişim diğerini kendiliğinden değiştirmez.",
  kosul: "Kapının üzerindeki koşulu önce doğru ya da yanlış diye sınamayı dene.",
  dongu: "Sayaç için kısa bir sıra yaz; her turdan sonra bir sonraki değere geç.",
  dizi: "İndeks yolunu sıfırdan başlat; aradığın kutuya öyle ulaş.",
  fonksiyon: "Girdiyi parametre yerine koy; sonra kuralın ürettiği çıktıyı takip et.",
} as const;
