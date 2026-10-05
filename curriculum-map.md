# Algoritma Atlası — İçerik ve Oyun Döngüsü Haritası

## Araştırma tabanı

İSBO 2025–2026 şartnamesi, ortaokul bilgisayarı 5–6 ve 7–8 sınıf düzeylerinde ayrı kategoriler olarak tanımlar. Ön eleme iki bant için 25 çoktan seçmeli sorudan ve 90 dakikadan; 1. aşama ise 30 çoktan seçmeli sorudan ve 90 dakikadan oluşur. Çoktan seçmeli değerlendirmede yanlış cevaplar neti düşürür. Bu platformun “deneme rotası” bu sınav yapısına hazırlanmak içindir; resmî sınavın kopyası veya resmî bir çalışma değildir. [1]

TÜBİTAK’ın ulusal bilim olimpiyatları sayfası; aşamalı sınav, kamp ve geçmiş soru mantığını görünür kılar. İkincil müfredat kaynağı olan İZBO Akademi ortaokul bilgisayar sayfası ise matematik, genel yetenek, zekâ, algoritma becerisi ve C ile programlama bilgisi kümelerini; kod parçasının sonucunu yorumlama türündeki programlama sorularını ifade eder. [2] [3]

| Atlas bölgesi | Hedef beceri | 5–6 rotası | 7–8 rotası | İlk etkileşim |
| --- | --- | --- | --- | --- |
| 1. İz sürme | Sıralı işlem ve akış | Üç adımlı yönerge | Birden fazla adımlı iz | Akış adımını sıraya koyma |
| 2. Bellek kutuları | `int`, değer, işlem | Bir değişkenin son değeri | Birden fazla değişken ve güncelleme | Değer kartını doğru kutuya taşıma |
| 3. Karar kapıları | Karşılaştırma ve `if` | Tek koşul | İç içe/bağlı koşul | Doğru dalı seçme |
| 4. Tekrar parkuru | `for`, `while`, sayaç | Sabit tekrar | Sayaç ve koşullu tekrar | Döngüyü adım adım yürütme |
| 5. Dizi kıyısı | İndeks ve tarama | Basit liste | Dizi, tarama ve toplam | Hücreleri izleyerek sonuç bulma |
| 6. Kural makinesi | Fonksiyon ve ayrıştırma | Girdi–çıktı fikri | Parametre ve dönüş değeri | Fonksiyonun çıktısını tahmin etme |
| 7. Deneme üssü | Sınav stratejisi | 25 soruluk yönlendirmeli set | 30 soruluk süreli set | Güven seviyesi ve soru işaretleme |

## Silent Teacher’dan uyarlanan öğretim döngüsü

Her görev, kısa bir somut örnek ile açılır. Öğrenci önce tahminde bulunur. Yanlış olduğunda ekranda “yanlış” damgası yerine aynı kuralı başka değerlerle gösteren ikinci örnek görünür. İkinci deneme sonrasında öğrenci isterse `İzi gör` seçeneğiyle değişkenlerin, döngü sayaçlarının veya dalların durumunu görebilir. Kuralın kısa açıklaması, ancak örneklerle karşılaşma tamamlandıktan sonra açılır.

| Durum | Öğrenci deneyimi | Sistem tepkisi |
| --- | --- | --- |
| İlk deneme | Tahmin eder ve cevabı işaretler | Sakin, açık geri bildirim verir. |
| Yanlış | Yeni örneği inceler | Aynı hedefi farklı sayılarla tekrar kurar. |
| İpucu isteği | Durumu izler | Çözümü değil, değişken/dal izini gösterir. |
| Ustalık | Kuralı yeni bağlamda uygular | Bir sonraki atlas durağını açar. |
| Deneme | Soru seçer, işaretler ya da boş bırakır | Doğruluk ve risk farkını ayrı gösterir. |

## İlk kullanılabilir sürüm kapsamı

İlk sürümde her öğrencinin tarayıcısında ilerleme saklanır; seviye seçimi, görev tamamlama, rozet benzeri beceri damgaları, kısa dersler, bir akış izleme görevi ve bir süreli deneme bulunur. Ders içeriği örnek C parçacıklarını yürütür; kullanıcı kodu sunucuda derlenmez. Bu bilinçli sınır, yaş grubuna uygun, güvenli ve kaynaklı bir ilk öğrenme deneyimi sağlar. Kullanıcı hesabı, öğretmen paneli ve gerçek kod çalıştırma; sonraki sürümde güvenli arka uç ve ayrıca sınırlandırılmış yürütme ortamı gerektirir.

## Referanslar

[1]: https://istanbul.meb.gov.tr/isbo/assets/dosyalar/sartname_2026.pdf "İstanbul Bilim Olimpiyatları 2025–2026 Ön Eleme ve 1. Aşama Şartnamesi"
[2]: https://bilimolimpiyatlari.tubitak.gov.tr/tr/ulusal-bilim-olimpiyatlari "TÜBİTAK Ulusal Bilim Olimpiyatları"
[3]: https://akademi.izbo.org.tr/OrtaokulBilgisayar "İZBO Akademi — Ortaokul Bilgisayar"
