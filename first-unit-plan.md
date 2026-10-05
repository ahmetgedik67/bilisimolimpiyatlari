# Ünite 1 — Akış ve Sıra / Kod İzleme

## Araştırmadan tasarıma geçiş

Resmî TÜBİTAK arşivinde erişilebilen 2018–2026 ortaokul bilgisayar birinci aşama kitapçıkları; kod çıktısı, değişken güncellemesi, koşul/döngü, dizi ve fonksiyon türlerinde sorular barındırır.[[1]](https://bilimolimpiyatlari.tubitak.gov.tr/tr/gecmis-sinav-sorulari) Bu ünite, sonraki koşul ve döngü görevleri için gerekli temel olan **satır sırasıyla yürütme** ile sınırlıdır. İSBO’nun resmî kendini dene alanındaki ortaokul bilgisayar formları, soru türü araştırması için kullanılacak; form soruları aynen aktarılmayacaktır.[[2]](https://istanbul.meb.gov.tr/isbo/kendini-dene)

## Öğrenme hedefi

Öğrenci, küçük bir C kod parçasında her satırın önceki değerleri değiştirdiğini ve `printf` satırının o ana kadarki güncel değeri yazdığını izleyebilir.

| Durak | Tek kazanım | Güçlük | Varyant sayısı | Yanlış yanıtta değişecek öğe |
| --- | --- | --- | --- | --- |
| `iz-baslangic` | Başlangıç değeri → tek güncelleme → çıktı | Başlangıç | 2 | Başlangıç değeri, işlem ve seçenekler |
| `iz-zincir` | Aynı değişkende iki sıralı güncelleme | Başlangıç | 2 | İşlem sırası ve ara değerler |
| `iz-kopya` | Bir değişkenin güncel değeriyle diğerine atama | Temel | 2 | Değişken adları ve atama noktası |
| `iz-birlesik` | `+=`, `-=`, `*=` işlemlerini sıralı yürütme | Temel | 2 | Birleşik işlem türü ve değerler |
| `iz-tamsayi` | Tamsayı bölmesi ve kalan işlemini izleme | Geçiş | 2 | Bölünen/bölen değerleri |
| `iz-iki-kutu` | İki değişkende karşılıklı olmayan güncelleme | Geçiş | 2 | Güncelleme sırası ve çıktı dizilişi |

## Varyant ve ipucu kuralları

Her görev iki gözden geçirilmiş varyant içerir. Yanlış yanıtta aynı kazanıma sahip öteki varyant gösterilir; cevap seçimi ve açık ipuçları sıfırlanır. İpucu sırası daima **başlangıç değeri → güncelleyen satır → yazdırılan ifade** olarak ilerler. Sonuç değeri, doğru şık veya tam çözüm yolu ipucunda yer almaz.

## İçerik kapsamı

Bu ilk pakette yalnızca `int`, atama, dört aritmetik işlem, birleşik atama, `/`, `%` ve `printf` kullanılır. `if`, `for`, `while`, dizi, işaretçi ve fonksiyonlar; arşivde görünmekle birlikte sonraki üniteler için ayrılır.

## Kaynaklar

[1]: https://bilimolimpiyatlari.tubitak.gov.tr/tr/gecmis-sinav-sorulari "TÜBİTAK Bilim Olimpiyatları — Geçmiş Sınav Soruları"
[2]: https://istanbul.meb.gov.tr/isbo/kendini-dene "İSBO — Kendini Dene"
