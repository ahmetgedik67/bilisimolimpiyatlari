# Ünite 1 — Akış ve Sıra / Kod İzleme

Bu paketteki tüm sorular **özgündür**. Kamuya açık geçmiş soru kitapçıkları; C çıktısı, değişken güncellemesi ve satır sırası türlerini belirlemek için incelenmiştir; soru metni, şıklar ve çözümler kopyalanmamıştır.[[1]](https://bilimolimpiyatlari.tubitak.gov.tr/tr/gecmis-sinav-sorulari) İSBO’nun etkileşimli geçmiş sınav bağlantıları da yalnızca kapsam karşılaştırması için kullanılmıştır.[[2]](https://istanbul.meb.gov.tr/isbo/kendini-dene)

> **Uyarlanabilir kural:** Öğrenci yanlış yanıt verirse aynı durağın diğer varyantı gösterilir. İpucu sayacı ve seçili cevap sıfırlanır. Öğrenci doğru yanıt verdiğinde rota bir sonraki durağa geçer.

## 1. Durak — Başlangıç değerini güncelle

| Alan | Varyant A | Varyant B |
| --- | --- | --- |
| Soru | Kodun çıktısı nedir? | Kodun çıktısı nedir? |
| Kod | `int x = 7;`<br>`x = x - 3;`<br>`printf("%d", x);` | `int x = 2;`<br>`x = x + 6;`<br>`printf("%d", x);` |
| Seçenekler | A) 3 &nbsp; B) 4 &nbsp; C) 7 &nbsp; D) 10 | A) 6 &nbsp; B) 8 &nbsp; C) 2 &nbsp; D) 10 |
| Doğru cevap | **B** | **B** |
| İpucu 1 | İlk satırda `x` için hangi başlangıç değeri yazıldı? | İlk satırda `x` için hangi başlangıç değeri yazıldı? |
| İpucu 2 | İkinci satır, `x` değerini azaltıyor mu yoksa artırıyor mu? | İkinci satır, `x` değerini azaltıyor mu yoksa artırıyor mu? |
| İpucu 3 | `printf`, en son güncellenmiş `x` değerini yazar. | `printf`, en son güncellenmiş `x` değerini yazar. |

## 2. Durak — Aynı değişkende iki adımı izle

| Alan | Varyant A | Varyant B |
| --- | --- | --- |
| Soru | Kodun çıktısı nedir? | Kodun çıktısı nedir? |
| Kod | `int puan = 3;`<br>`puan = puan + 4;`<br>`puan = puan - 2;`<br>`printf("%d", puan);` | `int adim = 10;`<br>`adim = adim - 4;`<br>`adim = adim + 1;`<br>`printf("%d", adim);` |
| Seçenekler | A) 1 &nbsp; B) 5 &nbsp; C) 7 &nbsp; D) 9 | A) 5 &nbsp; B) 6 &nbsp; C) 7 &nbsp; D) 11 |
| Doğru cevap | **B** | **C** |
| İpucu 1 | İlk işlemden sonraki ara değeri küçük bir not olarak tut. | İlk işlemden sonraki ara değeri küçük bir not olarak tut. |
| İpucu 2 | Üçüncü satır, başlangıç değerine değil bir önceki satırın sonucuna uygulanır. | Üçüncü satır, başlangıç değerine değil bir önceki satırın sonucuna uygulanır. |
| İpucu 3 | Satırları yukarıdan aşağıya, atlamadan yürüt. | Satırları yukarıdan aşağıya, atlamadan yürüt. |

## 3. Durak — Değeri diğer kutuya kopyala

| Alan | Varyant A | Varyant B |
| --- | --- | --- |
| Soru | Kodun çıktısı nedir? | Kodun çıktısı nedir? |
| Kod | `int a = 5;`<br>`int b = a;`<br>`a = a + 3;`<br>`printf("%d %d", a, b);` | `int kutu1 = 4;`<br>`int kutu2 = kutu1 + 2;`<br>`kutu1 = kutu1 - 1;`<br>`printf("%d %d", kutu1, kutu2);` |
| Seçenekler | A) `8 5` &nbsp; B) `8 8` &nbsp; C) `5 5` &nbsp; D) `5 8` | A) `3 5` &nbsp; B) `3 6` &nbsp; C) `4 6` &nbsp; D) `4 5` |
| Doğru cevap | **A** | **B** |
| İpucu 1 | `b = a` satırında `b`, o anda `a` içinde olan değeri alır. | `kutu2` değeri atanırken `kutu1` hangi değerdedir? |
| İpucu 2 | Daha sonra değişen değişkenin hangisi olduğuna bak. | Sonraki satır yalnızca hangi kutuyu değiştiriyor? |
| İpucu 3 | `printf` içindeki yazım sırası, çıktının sırasını belirler. | `printf` içindeki yazım sırası, çıktının sırasını belirler. |

## 4. Durak — Kısa atama işaretlerini oku

| Alan | Varyant A | Varyant B |
| --- | --- | --- |
| Soru | Kodun çıktısı nedir? | Kodun çıktısı nedir? |
| Kod | `int n = 6;`<br>`n += 5;`<br>`n -= 4;`<br>`printf("%d", n);` | `int sayi = 3;`<br>`sayi *= 4;`<br>`sayi += 2;`<br>`printf("%d", sayi);` |
| Seçenekler | A) 1 &nbsp; B) 7 &nbsp; C) 9 &nbsp; D) 11 | A) 10 &nbsp; B) 12 &nbsp; C) 14 &nbsp; D) 18 |
| Doğru cevap | **B** | **C** |
| İpucu 1 | `+=` işareti, değişkenin mevcut değeriyle toplama yapar. | `*=` işareti, değişkenin mevcut değeriyle çarpma yapar. |
| İpucu 2 | Her kısa atama, değişkenin değerini hemen değiştirir. | Her kısa atama, değişkenin değerini hemen değiştirir. |
| İpucu 3 | Son satırdan önceki güncel değeri izle. | Son satırdan önceki güncel değeri izle. |

## 5. Durak — Bölüm ve kalanı ayır

| Alan | Varyant A | Varyant B |
| --- | --- | --- |
| Soru | Kodun çıktısı nedir? | Kodun çıktısı nedir? |
| Kod | `int paket = 17;`<br>`int grup = paket / 5;`<br>`int kalan = paket % 5;`<br>`printf("%d %d", grup, kalan);` | `int sayi = 23;`<br>`int onlar = sayi / 10;`<br>`int birler = sayi % 10;`<br>`printf("%d %d", onlar, birler);` |
| Seçenekler | A) `3 2` &nbsp; B) `3 5` &nbsp; C) `5 3` &nbsp; D) `2 3` | A) `2 3` &nbsp; B) `2 0` &nbsp; C) `3 2` &nbsp; D) `3 0` |
| Doğru cevap | **A** | **A** |
| İpucu 1 | `/` işareti, iki `int` değerde tam bölümü verir. | `/` işareti, iki `int` değerde tam bölümü verir. |
| İpucu 2 | `%` işareti bölme bittikten sonra artan parçayı verir. | `%` işareti bölme bittikten sonra artan parçayı verir. |
| İpucu 3 | Önce iki değişkeni ayrı bul, sonra `printf` sırasını izle. | Önce iki değişkeni ayrı bul, sonra `printf` sırasını izle. |

## 6. Durak — İki kutunun güncel değerini koru

| Alan | Varyant A | Varyant B |
| --- | --- | --- |
| Soru | Kodun çıktısı nedir? | Kodun çıktısı nedir? |
| Kod | `int sol = 4;`<br>`int sag = 9;`<br>`sol = sol + 2;`<br>`sag = sag - sol;`<br>`printf("%d %d", sol, sag);` | `int kirmizi = 8;`<br>`int mavi = 3;`<br>`mavi = mavi + 2;`<br>`kirmizi = kirmizi - mavi;`<br>`printf("%d %d", kirmizi, mavi);` |
| Seçenekler | A) `4 5` &nbsp; B) `6 3` &nbsp; C) `6 5` &nbsp; D) `4 3` | A) `3 5` &nbsp; B) `3 3` &nbsp; C) `5 3` &nbsp; D) `5 5` |
| Doğru cevap | **B** | **A** |
| İpucu 1 | Son değişken satırı çalışmadan önce ilk değişken güncellenmiş olabilir. | Son değişken satırı çalışmadan önce ilk değişken güncellenmiş olabilir. |
| İpucu 2 | Çıkarma satırında sağ taraftaki değişkenin o andaki değerini kullan. | Çıkarma satırında sağ taraftaki değişkenin o andaki değerini kullan. |
| İpucu 3 | İki kutuyu aynı anda değil, satır sırasıyla güncelle. | İki kutuyu aynı anda değil, satır sırasıyla güncelle. |

## İçerik doğrulama özeti

| Kontrol | Sonuç |
| --- | --- |
| Özgünlük | Geçmiş soru metni veya seçeneği kullanılmadı. |
| Tek kazanım | Her varyant yalnızca sıralı kod izleme becerisini ölçer. |
| Uyarlanabilirlik | Her durakta aynı kazanımı ölçen iki ayrı varyant vardır. |
| İpucu güvenliği | İpuçları sonuç, doğru şık veya tam ara değer içermez. |
| C geçerliliği | Tüm kod parçaları standart `int` ve `printf` sözdizimine göre ayrı ayrı doğrulanacaktır. |

## Kaynaklar

[1]: https://bilimolimpiyatlari.tubitak.gov.tr/tr/gecmis-sinav-sorulari "TÜBİTAK Bilim Olimpiyatları — Geçmiş Sınav Soruları"
[2]: https://istanbul.meb.gov.tr/isbo/kendini-dene "İSBO — Kendini Dene"
