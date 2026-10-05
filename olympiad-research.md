# Olimpiyat Hazırlık Platformu — Araştırma Notları

## İSBO: Doğrulanan başlangıç bulguları

| Bulgular | Kaynak | Platform etkisi |
| --- | --- | --- |
| İstanbul İl Millî Eğitim Müdürlüğü İSBO’yu, temel bilimlerde yetenekli öğrencileri keşfetme ve derinlemesine/nitelikli çalışmaları destekleme amacıyla sunuyor. | [İSBO ana sayfası](https://istanbul.meb.gov.tr/isbo/) | Dersler yalnızca sözdizimini değil, problem çözme ve bilimsel düşünme alışkanlıklarını hedeflemeli. |
| İSBO 2026 için şartname bağlantısı ve örnek sorulara yönlendirme yayımlanmış durumda. | [İSBO ana sayfası](https://istanbul.meb.gov.tr/isbo/) | Resmî çerçeve, içerik tasarımının birincil dayanağı olarak ayrıca incelenecek. |
| “Kendini Dene” alanı 46 toplam sınav, 19 ortaokul sınavı ve 27 lise sınavı göstergesi sunuyor; 2020–2024 filtreleri bulunuyor. | [İSBO Kendini Dene](https://istanbul.meb.gov.tr/isbo/kendini-dene) | Platformda kademeli görev bankası ve geçmiş sınav benzeri deneme rotası bulunmalı. |
| TÜBİTAK’ın ulusal olimpiyat sayfası, süreçte birinci ve ikinci aşama sınavları ile yaz/kış okullarını; ayrıca geçmiş sınav sorularını ayrı kaynak başlığı olarak sunuyor. | [TÜBİTAK Ulusal Bilim Olimpiyatları](https://bilimolimpiyatlari.tubitak.gov.tr/tr/ulusal-bilim-olimpiyatlari) | Platformda “temel rota → deneme → ustalık” katmanları, sınav hazırlık döngüsünü yansıtacak biçimde tasarlanmalı. |
| Aynı sayfa, ortaokul bilgisayar alanının ulusal olimpiyatlar kapsamındaki konumunu açıkça gösteriyor. | [TÜBİTAK Ulusal Bilim Olimpiyatları](https://bilimolimpiyatlari.tubitak.gov.tr/tr/ulusal-bilim-olimpiyatlari) | İçerik; hızlı uygulama alıştırmalarının yanı sıra algoritmik akıl yürütme ve yarışma tipindeki problem çözmeye yer vermeli. |
| İSBO’nun resmî 2025–2026 “Ön Eleme ve 1. Aşama Şartnamesi” 23 sayfalık bir belge olarak yayımlanmış durumda. | [İSBO 2025–2026 Şartnamesi (PDF)](https://istanbul.meb.gov.tr/isbo/assets/dosyalar/sartname_2026.pdf) | Şartnamenin kategori ve uygulama ayrıntıları, ders eşlemesini kesinleştirmeden önce belge düzeyinde doğrulanmalı. |
| İSBO’nun “Kendini Dene” alanında ortaokul bilgisayar için “Hayyam Bilgisayar (Ortaokul)”, “Bilgisayar (Ortaokul)” ve “İSBO Ortaokul Bilgisayar” başlıkları görülebiliyor. | [İSBO Kendini Dene](https://istanbul.meb.gov.tr/isbo/kendini-dene) | Platformda iki yaş bandına ayrılan görev yolları ile hem temel algoritmik sezgi hem de seçilmiş olimpiyat tipi denemeler sunulmalı. |

## Şartnameyle kesinleşen bilgisayar kategorisi yapısı

| Aşama | Yaş bandı | Biçim | Süre | Eşleştirme sonucu |
| --- | --- | --- | --- | --- |
| Ön eleme | 5–6. sınıf bilgisayar | 25 çoktan seçmeli soru | 90 dk | Hızlı okuma, temel örüntü ve kısa algoritma alıştırmaları. |
| Ön eleme | 7–8. sınıf bilgisayar | 25 çoktan seçmeli soru | 90 dk | Değişken, koşul, döngü ve tablo düşüncesini problem içinde yorumlama. |
| 1. aşama | 5–6. sınıf bilgisayar | 30 çoktan seçmeli soru | 90 dk | Daha fazla soru ile doğruluk ve dikkat ritmini büyüten görevler. |
| 1. aşama | 7–8. sınıf bilgisayar | 30 çoktan seçmeli soru | 90 dk | Ortaokul düzeyi olimpiyat problem çözme antrenmanı ve süre stratejisi. |

Şartname; ortaokul yarışmasını ön eleme, 1. aşama ve 2. aşama olarak üç aşamalı tanımlar. Ön elemede %20’lik dilime giren öğrenciler 1. aşamaya ilerler; 1. aşama sonrasında her branştan ilk 50 öğrenci 2. aşamaya davet edilir. Çoktan seçmeli sorularda yanlış cevaplar neti düşürür; bu nedenle platformun deneme modunda hem çözüm doğruluğunu hem de boş bırakma/işaretleme stratejisini öğretmesi gerekir.

## C programlama ve ortaokul hazırlık eşlemesi

İzmir Bilim Olimpiyatları Akademisi’nin ortaokul bilgisayar sayfası, konuları matematik, genel yetenek, zekâ, algoritma becerisi ve C üzerinden programlama bilgisi olarak beş kümeye ayırır. Sayfa; programlama sorularında kod ya da kod parçasının sonucunu yorumlama türünü vurgular ve akış diyagramı, yapısal programlama, diziler ve fonksiyonlar gibi başlıklar listeler. Bu kaynak İSBO şartnamesi değildir; ancak İSBO’nun çoktan seçmeli ortaokul bilgisayar yapısı ile uyumlu, kullanılabilir bir ders sıralaması için doğrulayıcı bir eğitim kaynağı olarak kullanılabilir.

| Ders kümesi | C odaklı beceri | Olimpiyat bağlamı | Platformdaki ilk karşılık |
| --- | --- | --- | --- |
| Akış diyagramı ve sıra | Adım adım algoritma | Genel yetenek ve algoritmik okuma | “İz sürme laboratuvarı” |
| Değişken, tür, ifade | Kodun anlık durumunu yorumlama | Kod/parça sonucu soruları | “Bellek kartları” |
| Koşullar ve döngüler | Dal ve tekrar mantığı | Çoktan seçmeli algoritma soruları | “Karar tünelleri” |
| Diziler ve tablolar | İndeks ve tarama | Örüntü, sayma ve veri gezme | “Dizi keşifleri” |
| Fonksiyonlar | Girdi–işlem–çıktı ayrımı | Soyutlama ve kısa çözüm | “Kural makineleri” |

Kaynak: [İzmir Bilim Olimpiyatları Akademisi — Ortaokul Bilgisayar](https://akademi.izbo.org.tr/OrtaokulBilgisayar), erişim 22 Ağustos 2026. Bu ikinci kaynak, resmî İSBO/TÜBİTAK şartname ve soru setlerinin yerini tutmaz; platformdaki konu dilini ve alıştırma tasarımını desteklemek için kullanılacaktır.

Bu notlar, 22 Ağustos 2026 tarihinde resmî İSBO sayfalarından derlenmiştir. Sayısal göstergeler yalnızca kaynağın yayımladığı sınav envanterini ifade eder; öğrencilerin katılımı veya başarısı hakkında çıkarım yapılmaz.
