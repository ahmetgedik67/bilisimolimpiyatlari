# İlk Ünite Araştırma Notları — Akış ve Sıra / Kod İzleme

## Kaynak erişim kaydı

- TÜBİTAK Bilim Olimpiyatları’nın resmî geçmiş sınav sayfası, **Ortaokul Bilgisayar Dalı** için birinci aşama soru ve cevap dosyaları ile ikinci aşama soru dosyalarını ayrı sunar. 2022–2026 birinci aşama dosyaları ve **Tüm Yıllar** arşivi görünür durumdadır. Kaynak: <https://bilimolimpiyatlari.tubitak.gov.tr/tr/gecmis-sinav-sorulari>.
- İSBO’nun resmî “Kendini Dene” alanı, 2020–2024 aralığında ortaokul sınavlarını listeler; sayfa, soruları etkileşimli sınav/bağlantı akışında sunar. Kaynak: <https://istanbul.meb.gov.tr/isbo/kendini-dene>.
- İSBO sayfasının dinamik sınav kartları; “Hayyam Bilgisayar (Ortaokul)”, “Bilgisayar (Ortaokul)” ve “İSBO Ortaokul Bilgisayar” başlıklarıyla Google Forms bağlantıları içerir. Bu bağlantılar, soru metinleri yerine haricî ve etkileşimli form akışına yönlendirir. Bu nedenle içerikler salt kaynak ve soru türü incelemesinde kullanılacak; form metinleri ürün içine kopyalanmayacaktır.

## İnceleme ilkesi

Kamuya açık geçmiş sorular; kapsam, soru türü ve zorluk geçişi çözümlemesi için incelenecek. Soruların metni, seçenekleri veya çözümleri aynen kopyalanmayacak. İlk ünitedeki C soruları, aynı kazanımı ölçen özgün kod ve özgün seçeneklerle üretilecek.

## İlk ünite odağı

İlk soru bankası; sıralı yürütme, değişkenin başlangıç/güncellenmiş değeri, `printf` çıktısı ve basit aritmetik adımlarına odaklanacak. Her görev en az iki varyant ve cevabı vermeyen, kademeli ipuçları içerecek.

## Tüm erişilebilen soru kitapçıklarının tarama özeti

TÜBİTAK sayfasında listelenen 2018–2021 **Tüm Yıllar** arşivi ile 2022–2026 ayrı birinci aşama dosyaları indirildi. PDF metni bulunan dosyalar doğrudan, metin katmanı yetersiz 2020 ve 2023 dosyaları ise OCR ile tarandı. Bu işlem, her kitabın sorularında geçen C kodu, çıktı, algoritma ve değişken güncelleme kalıplarının görülmesini sağladı; soruların metni veya seçenekleri yeniden yayımlanmadı.

| Gözlem kümesi | İlk üniteye yansıyan soru türü | Ünite kararına etkisi |
| --- | --- | --- |
| 2018 kitapçığı | Basit `printf`, aritmetik öncelik, artırma/azaltma ve döngü çıktıları | Önce satır sırası ve güncel değer; sonra işleç önceliği |
| 2019 kitapçığı | İç içe koşul, döngü çıktısı, birikimli değişken ve fonksiyon çağrısı | İlk üniteyi yalnızca sıra/atama ile sınırla; koşul ve döngüyü ertele |
| 2020 kitapçığı | C çerçevesinde `switch`, `do...while`, iç içe döngü ve sayaç çıktıları | Satır izleme alışkanlığını sonraki kontrol yapıları için ön koşul yap |
| 2022–2023 kitapçıkları | Dizi güncellemesi, iç içe döngü, tamsayı işlemi, çıktı üretimi | Değişken güncelleme ile bölüm/kalan kavramını ilk rotaya ekle |
| 2024–2026 kitapçıkları | Resmî birinci aşama arşivindeki güncel soru dosyaları | Aynı özgünlük ve kazanım eşleme ilkesiyle sonraki ünitelerde incelenecek |
