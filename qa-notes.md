# Algoritma Atlası — Teslim Öncesi QA Notu

## Görsel doğrulama

Silent Teacher esintili güncelleme sonrasında masaüstü başlangıç görünümü yeniden kontrol edildi. Koyu petrol mavisi sahne, merkezde geniş görsel odak, az sayıda eylem ve oyun benzeri büyük ölçekli tipografi korunurken Algoritma Atlası’na özgü rota haritası varlığını sürdürdü. Görev istasyonu daha aşağıda konumlandığı için sonraki kontrol, etkileşimli tahtayı doğrudan hedeflemelidir.

Görev istasyonu masaüstünde doğrudan incelendi. Koyu petrol sahne içindeki özgün rota rehberi, beyaz kod tahtası ve mercan kapsül seçenekler görünür ve birbirinden ayrık kaldı. İlk iz sürme sorusuna yanlış yanıt verildiğinde görev; `x = 3; x = x + 2` örneğinden hemen `x = 6; x = x - 3` örneğine geçti. Rota kilidi kapalı kaldı ve durum şeridi aynı kuralın yeni değerlerle tekrar deneneceğini açıkladı.

Yeni örnekte ilk ipucu açıldığında yalnızca **“x'in başlangıç değerini bul.”** yönlendirmesi gösterildi; sonuç değeri ya da çözüm adımı verilmedi. Ardından doğru yanıt seçildiğinde rota, **Bellek kutuları** durağına otomatik geçti; yeni kod, seçenekler ve rota başlığı değişti. Bu kontrol, daha önce tamamlanmış ilk durağa geri dönülmüşken de doğru yanıtla ilerleme hatasının giderildiğini doğruladı.

Masaüstü tam sayfa incelemesi, `1280×720` görünümünde yapıldı. Tasarım; atlas haritası kahraman alanı, rota rayı, görev istasyonu, C belleği ve kaynak alanı boyunca tutarlı kaldı. Bağımsız görsel inceleme sonrasında atlas imzası; görev koordinat etiketi, kartografik nokta/ızgara yüzeyleri ve deneme alanındaki rota işaretleriyle güçlendirildi.

Mobil tam sayfa incelemesi, `375×812` görünümünde yapıldı. Kahraman alanı, yaş bandı seçimi, yatay görev rotası, aktif C görevi, geri bildirim alanı, öğrenme döngüsü, mini deneme çağrısı ve kaynaklar tek sütunda okunabilir kaldı. Görev rotası yatay taşarak küçük ekranda erişilebilirliğini koruyor; metin ve seçenekler birbirine binmiyor.

## Erişilebilirlik ve etkileşim kontrolü

| Kontrol | Sonuç | Kanıt |
| --- | --- | --- |
| Ana içeriğe atlama | Geçti | `Ana göreve geç` bağlantısı `#ana-gorev` hedefine bağlanıyor. |
| Odak erişimi | Geçti | Sayfada görünür odak stilleri ve 25 klavye ile erişilebilir öğe bulundu. |
| Etiketli seçimler | Geçti | Yaş bandı ve cevap grupları `role="group"` ile erişilebilir etiket taşıyor. |
| Seçili durum | Geçti | Altı butonda `aria-pressed` durumu var; yaş bandı, rota ve cevap seçimlerini kapsıyor. |
| Adsız buton | Geçti | DOM kontrolünde adsız buton sayısı `0` bulundu. |
| Durum geri bildirimi | Uygulandı | Görev ve deneme sonucu görünür olduğunda `role="status"` içeren geri bildirim kartı ekranda oluşur. Başlangıç durumunda herhangi bir sonuç olmadığı için DOM sayımı `0` döndü. |

Klavye turunda ilk `Tab` basışı, görünür odak halkasıyla **“Ana göreve geç”** bağlantısını seçti. `Enter` sonrasında URL’nin `#ana-gorev` hedefine geçtiği ve görünümün aktif görev alanına kaydığı doğrulandı. Bu, fare kullanmadan ders alanına doğrudan erişim sağlar.

İz sürme görevinin doğru yanıtı işaretlendiğinde görev tamamlandı, bir sonraki rota durağı açıldı ve DOM’da görünür bir `role="status"` kartı oluştu. Kart metni, **“İz tamamlandı. Kuralı kendi izinden çıkardın. Sıradaki durağın yolu artık açık.”** bilgisini içerdi.

Mini deneme çağrısı görünür ve erişilebilir buton olarak algılandı. Olaydan sonraki yeniden çizimde beş soru, `04:50 kaldı` biçiminde görünür geri sayım ve **“Denemeyi bitir”** kontrolü oluştu. İlk eşzamanlı DOM sorgusu, React yeniden çiziminden önce çalıştığı için deneme alanını görmedi; sonraki görünüm deneme akışının doğru açıldığını doğruladı.

Denemeyi bitir kontrolü görünür hâle geldi; indeksli dış tıklama sonrasında sonuç kartı gecikmeli olarak oluşmadı. Bu yüzden sonuç durum mesajı, olayın React katmanında işlendiğini doğrulamak amacıyla ayrıca doğrudan DOM olay kontrolüyle test edilecek.

Doğrudan olay kontrolünü takiben mini deneme sonuç kartı oluştu. Boş bırakılan beş soru için **0 net**, `0 doğru · 0 yanlış · 5 boş` ve `01:12 çözüm süresi` görünür biçimde sunuldu; üstteki durum şeridi de denemenin tamamlandığını açıkladı.

Son DOM doğrulamasında iki adet görünür `role="status"` bölgesi bulundu: biri görev başarısı, diğeri mini deneme sonucu için. Böylece hem görev hem deneme geri bildirimleri ekran okuyucu dostu durum duyuruları olarak oluşuyor.

Temiz başlangıç durumunda yapılan ilk `Tab` geçişi, görünür odak göstergesiyle **“Ana göreve geç”** bağlantısına ulaştı. Bu, klavye turunun beklenen ilk odağıyla başladığını yeniden doğruladı.

İkinci `Tab` geçişinde odak, erişilebilir ada sahip **“Algoritma Atlası — C · ortaokul rota defteri”** marka bağlantısına ilerledi. Böylece atlama bağlantısından sonraki odak sırası da doğrulandı.

Bir sonraki gerçek `Tab` geçişinde odak, **“Atlas rotası”** bağlantısına ulaştı. Üst gezinme öğelerinin sırayla klavye odağı alabildiği doğrulandı.

Takip eden iki `Tab` geçişinde odak sırasıyla **“Araştırma notu”** bağlantısına ve **“İlerlemeyi kaydet”** düğmesine geçti. Bu adımda aynı klavye akışı korunarak rota ayarı kontrollerine yaklaşım doğrulandı.

**7–8. sınıf / derin iz sürme** düğmesi 3 px görünür odak halkasıyla hedeflendi ve gerçek `Enter` tuşuyla etkinleştirildi. Ekranda “Rota, çok adımlı iz sürme ve sınav ritmi için ayarlandı.” bildirimi ile **yarışma rotası** etiketi göründü; rota seçiminin klavye ile çalıştığı doğrulandı.

C görevinin doğru yanıtı olan **5** düğmesi 3 px görünür odak halkasıyla hedeflendi ve gerçek `Enter` tuşuyla etkinleştirildi. Görev tamamlandı, seçili değer işaretlendi ve anlaşılır sonuç geri bildirimi ekranda kaldı.

**Mini denemeyi aç** düğmesi 3 px görünür odak halkasıyla hedeflendi ve gerçek `Enter` tuşuyla etkinleştirildi. Beş soru, seçenek kontrolleri ve `05:00 kaldı` geri sayımı oluştu. Böylece rota seçimi, görev yanıtı ve mini deneme kontrolünde klavye etkinleştirmesi test edildi.

Uçtan uca denetim öncesinde, devre dışı kontroller hariç tab sırası DOM’dan kaydedildi: 8–9. odaklar yaş bandı rota seçimleri, 10. odak ilk ders durağı, 15. odak görevdeki **5** yanıtı, 18. odak **Mini denemeyi aç** ve deneme açıldıktan sonraki 39. odak **Denemeyi bitir** düğmesidir. Ardından sayfa temiz başlangıç odağıyla yeniden açıldı.

Uçtan uca turda ilk gerçek `Tab`, görünür 3 px odak halkasıyla **“Ana göreve geç”** bağlantısına ulaştı.

İkinci gerçek `Tab`, aynı 3 px odak göstergesiyle **“Algoritma Atlası — C · ortaokul rota defteri”** bağlantısına ulaştı.

Üçüncü gerçek `Tab`, 3 px görünür odakla **“Atlas rotası”** bağlantısına ulaştı.

## İçerik doğruluğu

İSBO şartnamesi temel alınarak ortaokul bilgisayar ön elemesinin 25, 1. aşamasının 30 çoktan seçmeli soru ve iki aşamanın da 90 dakika olduğu kaynağa bağlı olarak sunulmuştur. Dört seçenekli mini deneme neti, şartnamede verilen “3 yanlış 1 doğruyu götürür” kuralıyla hesaplanır. Platform, resmî sınavın aynısı veya resmî kurumların hizmeti olarak sunulmamaktadır.

## Cevap kilidi

Yeni görev görünümünde cevap alanı, ilk anda **“10 sn düşünme süresi: seçenekler birazdan açılacak.”** durum mesajını ve soluk mercan seçenek kapsüllerini gösterdi. Geri sayım tamamlanınca aynı erişilebilir durum alanı **“Seçenekler açık. Tek bir cevap işaretle.”** metnine geçti. Böylece öğrencinin ilk on saniye boyunca cevapları değiştirmesi ya da art arda tıklaması engellendi.

Tamamlanmış ilk duraktan **Bellek kutuları** durağına geçildiğinde geri sayım yeniden başladı ve ekranda **“9 sn düşünme süresi”** görüldü. Yeni görevin dört seçeneği bu sırada soluk ve devre dışıydı; kilidin görev değişiminde de uygulandığı doğrulandı.

Geri sayım dolduktan sonra yapılan DOM denetiminde devre dışı cevap kapsülü kalmadı ve durum metni **“Seçenekler açık. Tek bir cevap işaretle.”** olarak bulundu. Kilitli ve açık durumların görünür/açıklayıcı geçişi doğrulandı.

Açık durumdaki yanlış yanıt sonrasında görev, aynı kazanımın yeni değerli varyantına geçti; örneğin `x = 6; x = x - 3;` örneğinden `x = 2; x = x * 4;` örneğine geçişte cevap alanı yeniden **“9 sn düşünme süresi”** durumuyla kilitlendi. Böylece her benzer soru geçişinde yeni düşünme süresinin başlatıldığı doğrulandı.

Tek akışlı DOM denetiminde **Bellek kutuları** görevi açılır açılmaz dört cevap düğmesinin de `disabled` olduğu görüldü. Kilitli ilk düğmeye programatik tıklama uygulandığında kod, görev durumu ve tamamlanan durak sayısı değişmedi; düğme sayısı yine dört, devre dışı düğme sayısı yine dört kaldı. `10,2` saniye sonra aynı görevde devre dışı düğme sayısı `0` oldu ve durum metni **“Seçenekler açık. Tek bir cevap işaretle.”** biçiminde güncellendi.

## Bilfen markası ve ders sayfası

Masaüstü ana sayfasında kullanıcı tarafından sağlanan Bilfen logosu, **Bilişim Teknolojileri Bölümü** kurum başlığı ve üst gezinmedeki **Dersler** bağlantısı görünür oldu. Dersler bağlantısı tıklandığında URL `/konu-anlatimi` yoluna geçti; altı üniteyi, kod örneklerini, iz sürme adımlarını ve “Bu konunun rota görevine git” bağlantılarını içeren konu anlatımı sayfası açıldı.

Konu anlatımı sayfasındaki **Rota görevlerine dön** bağlantısı tıklandığında ana rota sayfasına geri döndü. Ana sayfa ile konu anlatımı sayfası 375 px mobil görünümde de ayrı, tek sütunlu ve okunabilir olarak görüntülendi; Bilfen kimliği ve gezinme kontrolleri taşmadan korundu.

Genişletilmiş ilk rota havuzunda iki ardışık yanlış yanıt tarayıcıda işlendi. Kod örnekleri sırasıyla `x = 3; x = x + 2;`, `x = 6; x = x - 3;` ve `x = 2; x = x * 4;` oldu; üçü de farklı varyanttı. Her yanlış geçişten sonra **“10 sn düşünme süresi”** kilidi yeniden göründü.

375 px mobil görünümde Bilfen logolu üst çubukta **Dersler** bağlantısı, konu anlatımı sayfasında ise geri dönüş simgesi görünür kaldı; konu kartları ve cevap kapsülleri tek sütunda taşmadan yerleşti. Bağlantı denetiminde Dersler bağlantısının hedefi `/konu-anlatimi`, `pointer-events` değeri `auto`, `disabled` niteliği `false` ve klavye odağını engelleyen `tabindex` niteliği olmadığı bulundu. Masaüstünde bu aynı bağlantı gerçek tıklamayla ders sayfasına, geri dönüş bağlantısı da ana rotaya yönlendirdi; görünür ve etkin aynı bağlantı yapısı mobil CSS altında korunuyor.

Gerçek `375 px` cihaz öykünmesinde Dersler bağlantısı etkinleştirildiğinde yol `/konu-anlatimi` oldu ve geri dönüş bağlantısı bulundu. Rota görevlerine dön bağlantısı etkinleştirildiğinde yol tekrar `/` oldu; burada Dersler bağlantısı yeniden mevcut kaldı. Aynı 375 px oturumunda iki ardışık yanlış yanıtla ilk rota sorusu üç farklı koda geçti: `x = 3; x = x + 2;`, `x = 6; x = x - 3;`, `x = 2; x = x * 4;`. Son geçişte `10 sn düşünme süresi` kilidi yine görünürdü.

## Robi ders rehberi

Robi rehber güncellemesi masaüstü (`1280 × 720`) ve mobil (`375 × 812`) görünümlerde denetlendi. Ana sayfadaki başlangıç haritası, etkin görev sahnesi ve mini deneme kartı Robi’yi içeriyor; konu anlatımı girişinde ve altı ünitenin her birindeki ipucu kartında da Robi kullanılıyor. Mobilde Robi kartları tek sütuna uyum sağladı ve ana sayfa/konu anlatımı ekranlarında yatay taşma gözlenmedi. Rehber metinleri sonuç ya da doğru seçeneği açıklamadan öğrenciyi ilgili değere, koşula, sayaca veya indekse yönlendiriyor.

## 100 aşamalı iz sürme rotası

Canlı masaüstü incelemesinde `İz sürme kampı` alanı; açık/kapalı durumları erişilebilir adlarla belirtilen 10 × 10 aşama ızgarası, `001 / 100` sayacı ve ilk özgün C göreviyle göründü. Aşama başlığı, kazanım etiketi, üç kademeli sonuç vermeyen ipucu alanı ve 10 saniyelik cevap kilidi korunuyor. Her görev ekranında geçmiş yarışma metninin kopyalanmadığı; yalnızca kazanım yapısından türetilen özgün C görevi kullanıldığı açıkça belirtiliyor.

Canlı 100 aşamalı rota testinde ilk görevin doğru yanıtı seçildiğinde sayaç `002 / 100` değerine geçti, 1. aşama tamamlandı olarak işaretlendi, 2. aşama açıldı ve puana iki birim eklendi. İkinci aşamada yanlış yanıt seçildiğinde görev numarası değişmeden yeni değerler ve seçenekler yüklendi; 10 saniyelik cevap kilidi yeniden başladı. Böylece hem doğru yanıtta ileri geçiş hem yanlışta aynı kazanımın farklı varyanta dönüşü doğrulandı.

Mobil `375 × 812` incelemesinde 100 aşamalı ızgara beş sütunlu düzene geçerek her aşama düğmesini en az 36 px yüksekliğe taşıdı; yatay taşma gözlenmedi. Şeffaf Robi düşünme GIF’i görev sahnesinin koyu rehber alanında görünür kaldı; kod tahtası, ipucu düğmesi ve kapsül seçenekler tek sütunda okunabildi.

Masaüstü canlı etkileşim denetiminde ikinci aşamanın doğru yanıtı seçildiğinde rehber alanı `Robi · kutlama modu` durumuna geçti. Arayüz, zıplama/OK işaretli kutlama GIF’ini `Robi doğru cevap için zıplarken OK işareti yapıyor` alternatif metniyle gösterdi; `İz tamamlandı` bildirimi görünür kaldı ve iki aşama tamamlandı olarak işaretlendi. Kutlama süresi 1,8 saniye sonra sonraki aşamaya geçecek biçimde ayarlandı.

Gerçek `375 × 812` cihaz öykünmesinde üçüncü aşamanın doğru yanıtı tıklanarak kutlama durumu sınandı. Rehber etiketi `Robi · kutlama modu`, görselin alternatif metni `Robi doğru cevap için zıplarken OK işareti yapıyor` ve kaynak yolu kutlama GIF’i olarak doğrulandı. Rehber alanı 351 px genişlikte kaldı; sayfanın kaydırılabilir genişliği 375 px olduğu için mobil yatay taşma oluşmadı.

Masaüstü otomatik geçiş denetiminde kutlama süresi sonrasında rota `005 / 100` sayacına ulaştı; ilk dört aşama tamamlandı, beşinci aşama açık duruma geçti ve rehber tekrar `Robi · düşünme modu` olarak göründü. Bu, kutlama gösteriminden sonra sıradaki aşamaya otomatik ilerleme davranışını canlı arayüzde doğruladı.

## Sekiz seçenek ve şık dağılımı

Her özgün iz sürme görevi artık A–H olarak etiketlenen sekiz kapsül seçenek içeriyor. Birim testi, her görevde doğru yanıtın tam bir kez bulunduğunu ve ilk 100 görevde A–H konumlarının tümünün kullanıldığını; konum frekansları arasındaki farkın en fazla bir olduğunu doğruladı. Masaüstünde seçenekler dört sütunlu iki sıra, `375 × 812` mobilde iki sütunlu dört sıra olarak göründü; şık etiketleri ve değerler okunabilir, taşmasız kaldı.

## 35 görevlik kolaydan zora rota

Kullanıcının sağladığı 2018–2019 İSBO, örnek soru ve C anlatım kaynakları yalnızca kazanım ve zorluk türleri açısından yeniden incelendi. Ürün rotası 35 özgün göreve indirildi; başlangıçta değişken/atama, orta bölümde koşul–döngü–dizi, son bölümde fonksiyon–modüler işlem–yapı–bağımlılık–strateji türleri yer alıyor. Canlı masaüstü akışında 1. görevde `Başlangıç değerini güncelle` doğru yanıtla tamamlandı; rota otomatik olarak 2. görevde farklı bir kazanım olan `Zincir güncelleme` görevine geçti. Her iki görevde sekiz A–H şıkkı ve cevap kilidi görünür kaldı.

Mobil `375 × 812` denetiminde 35 görevlik ızgara beş sütunlu, aşama düğmeleri dokunulabilir ve yatay taşmasız kaldı. Görev sahnesinde sekiz A–H seçeneği iki sütunlu dört sıra halinde yerleşti; kod, Robi rehberi, ipucu ve kapsül seçenekler okunabilir kaldı. `pnpm test` 12/12, tür denetimi ve üretim derlemesi başarılı tamamlandı.

| Görev aralığı | Seviye | Beceriler | Doğrulama |
| --- | --- | --- | --- |
| 1–6 | Başlangıç | Atama, zincir güncelleme, kopyalama, kısa atama, bölüm-kalan, iki değişken | İlk görev doğru yanıtla tamamlanıp ikinci, farklı beceriye geçti. |
| 7–11 | Gelişen | Karşılaştırma, çift-tek, `&&`, `||`, iç içe `if` | İlk dokuz görevin dokuz farklı beceri kullandığı birim testle doğrulandı. |
| 12–20 | Gelişen | `for`, koşullu toplam, adımlı sayaç, `while`, iç içe döngü, dizi işlemleri | Her görev üç varyant ve A–H arasında sekiz tekil şık üretiyor. |
| 21–29 | Yarışma yaklaşımı | Fonksiyon, küçük özyineleme, modüler işlem, basamak, bit kaydırma, 2B dizi | 35 görevin üç varyantındaki 105 C programı bağımsız olarak GCC ile derlenip çalıştırıldı; çıktı doğru cevapla karşılaştırıldı. |
| 30–35 | Derin iz | Ön koşul, yol sayma, doğru-yanlış sayma, kısıtlı arama, strateji, dinamik birikim | 13 birim testi, tür denetimi ve üretim derlemesi başarılıdır. |

Masaüstü canlı denetimde doğru yanıt sonrası ilk görev tamamlandı ve 2. görevde farklı kod yapısı açıldı. Mobil `375 × 812` ekran görüntüsünde 35 görev ızgarası ile sekiz A–H şıkkı taşmadan görüntülendi. Geçmiş soruların metinleri ya da şıkları uygulamaya kopyalanmadı; yalnızca konu türleri ve zorluk geçişleri özgün görev tasarımına aktarıldı.

Son semantik denetimde 35 görevin üç varyantındaki 105 C kodu bağımsız olarak GCC ile derlenip çalıştırıldı. Çıktılar görev cevabıyla karşılaştırıldı; ayrıca istemci görev üretimini içe aktarmayan ayrı bir test hesaplayıcısı her adımın giriş/işlem kuralından referans sonucu yeniden hesapladı. Denetim sırasında iki döngü sayacı ve iki uçlu dizi görevindeki cevap-kod uyumsuzlukları ortaya çıkarılıp düzeltildi; son durumda 14 birim testi, tür denetimi ve üretim derlemesi başarıyla tamamlandı.

## Öğretmen ve öğrenci hesapları

Yerel eğitim hesapları ayrı `localAccounts` tablosunda kullanıcı adı, scrypt parola özeti, öğretmen/öğrenci rolü, yöneten öğretmen, zorunlu parola değişimi ve hesap durumu ile tutulur. Parolanın kendisi hiçbir sorgu veya arayüz yanıtına dönmez. Öğretmen işlemleri yalnız öğretmen hesabına; ilk ve ek öğretmen oluşturma işlemi yalnız platform yöneticisine açıktır. Öğretmen yalnız kendi yönettiği öğrencinin geçici parolasını sıfırlayabilir ve yalnız kendi öğrencilerinin görev, puan ve son etkinlik özetlerini görür.

Canlı giriş denetiminde geçersiz kullanıcı adı/parola denemesi tek, genel hata ile reddedildi ve oturum oluşmadı. Oturum açılmadan `/ogretmen` yoluna gidildiğinde uygulama `/giris` sayfasına yönlendirdi. `375 × 812` mobil görüntüde kullanıcı adı, parola, giriş ve yönetici giriş kontrolleri tek sütunda okunabilir, dokunulabilir ve yatay taşmasız kaldı. Parola özeti/doğrulama ve kullanıcı adı normalleştirme testleri dahil 16 test, tür denetimi ve üretim derlemesi başarılıdır.

Yönlendirici düzeyi hesap erişim testi; doğru kullanıcı adı/parola ile imzalı oturum çerezi oluşturulmasını, öğrencinin öğretmen listesinden engellenmesini, öğretmenin yalnız kendi kimliğiyle öğrenci özetini sorgulamasını, öğrenci oluşturma ilişkisinin öğretmene bağlanmasını, yönetilmeyen öğrenci için sıfırlamanın reddedilmesini, yönetilen öğrenci için geçici parola yenilemesini ve öğrencinin kendi parolasını değiştirmesini kapsar. Bu denetimler ile toplam 23 test geçti. Gerçek yönetici oturumuyla tarayıcı denemesi, bağlı tarayıcı bağlantısının yanıt vermemesi nedeniyle tamamlanamadı; üretimde ilk öğretmen hesabı, `/giris` ekranındaki **Yönetici girişi** sonrasında `/ogretmen` panelinden oluşturulmalıdır.

Gerçek yönetici oturumuyla öğretmen paneli açıldı; panelden `deneme.ogrenci2026` öğrenci hesabı oluşturuldu. Öğrenci, geçici parola ile giriş yaptı; kendi parolasını değiştirdi; `/ogretmen` yolunda **Öğretmen erişimi gerekli** ile engellendi ve oturumu kapatabildi. Yönetici yeniden panele girerek aynı öğrencinin parolasını sıfırladı; öğrenci yeni geçici parolayla tekrar giriş yaptığında zorunlu parola değişikliği uyarısı yeniden görünür oldu. Panelde öğrenci için görev sayısı, puan, son deneme, son etkinlik ve sıfırlama kontrolü birlikte doğrulandı.

`375 × 812` mobil panel görünümünde üst gezinme, başlık, öğrenci ve öğretmen hesap formları ile öğrenci ilerleme tablosu tek sütunda taşmasız yerleşti. Öğrenci tablosu yatay taşma oluşturmadan rota, puan, son deneme, son etkinlik ve parola sıfırlama bilgilerini gösterdi. Yerel hesap için hesap sayfasındaki oturum kapatma kontrolü ayrıca denetlendi; sayfa tazelenince kullanıcı adı/parola giriş formuna döndü.

### Son gerçek yerel hesap ve izolasyon denetimi

Yönetici yüzeyinde oluşturulan iki yerel öğretmen hesabıyla ayrı tarayıcı oturumları açıldı. İlk öğretmen kendi panelinde başlangıçta **0 öğrenci** gördü; oluşturduğu denetim öğrencisinden sonra tabloda yalnız bu öğrenci, `0 görev`, `0 puan`, deneme bilgisi, son etkinlik tarihi ve parola sıfırlama denetimi ile listelendi. İkinci öğretmen oturumu açıldığında ilk öğretmenin öğrencisi görünmedi; kendi paneli **0 öğrenci** gösterdi. İkinci öğretmenin kendi öğrencisini oluşturmasının ardından liste yine yalnız bu öğrenciyle **1 öğrenci** oldu. Böylece gerçek kullanıcı arayüzünde öğretmen–öğrenci sahiplik izolasyonu doğrulandı.

İkinci öğretmen kendi öğrencisinin geçici parolasını arayüzden yeniledi ve başarı bildirimi aldı. Sıfırlanan öğrenci yeni geçici parolasıyla giriş yaptı; hesap sayfasında **“Bu geçici paroladır. Devam etmeden önce kendi parolanı belirle.”** uyarısı ve parola değiştirme alanları görünür oldu. Ayrı bir yerel öğrenci oturumunda `/ogretmen` yolu, **“Öğretmen erişimi gerekli”** ekranıyla engellendi. Bu denetim boyunca parola metinleri kayıt altına alınmadı veya arayüz/API yanıtından geri alınmadı.

Yerel öğretmen ve öğrenci oluşturma formlarına `autocomplete="off"`, ayrı alan adları, kullanıcı adı için büyük-küçük harf/imtika denetimi ve yeni parolalar için `autocomplete="new-password"` ipuçları eklendi. Gerçek yönetici, iki yerel öğretmen ve iki ayrı öğrenci oluşturma akışlarının tamamı güncellenmiş formlarla başarıyla tamamlandı. Bu korumalar `teacherDashboardForm.test.ts` ve `loginForm.test.ts` ile; rol, sahiplik, sıfırlama ve parola değiştirme kuralları ise mevcut erişim testleriyle sınanır. Birden çok yerel öğretmen ve öğrenci hesabının daha önce oturum açtığı aynı tarayıcıda giriş formu yeniden açıldı; seçilen öğretmen kullanıcı adı ve parola alanları gönderimden hemen önce doğru değerleri korudu, giriş sonrasında hesap sayfasında aynı öğretmen kullanıcı adı ile öğretmen paneli bağlantısı göründü. Başka bir hesabın kimlik bilgisi alanlara yerleşmedi.


## Robi görünürlüğü ve gelişim modülleri — son denetim

Yerel öğretmen Alfa oturumunda `/ogretmen` gerçek bağlı tarayıcıda yüklendi. Başlık içinde **ROBİ · DERS REHBERİ**, Robi görseli ve sınıf koçluğu kartı görünür oldu. Aynı panelde sınıf özeti, son yedi gün etkinliği, destek sırası, rota ortalaması ve görev eşiğine göre kazanım görünümü sunuldu. Öğrenci satırındaki ad düğmesi açılıp görev, mini deneme, risk önerisi ve Robi yönlendirmesini içeren ayrıntı satırı gösteriyor.

Yerel öğretmen Alfa oturumunda ana rota `/` açıldığında Robi’nin başlangıç haritası kartı, etkin görev rehberi, mini deneme rehberi ve **Öğrenci gelişim panosu** görünür oldu. Gelişim panosunda hesap ilerlemesine bağlı rota/merak/ustalık metrikleri, dört beceri alanı ve gün değişimine göre belirlenen **Bugünün görevi** kartı göründü. Günlük görevin tamamlanması, hesap anahtarıyla ayrılmış `localStorage` durumuna kaydediliyor; böylece aynı tarayıcıdaki farklı denetim hesaplarının günlük görevi birbirine karışmıyor.

Robi görselleri `RobiImage` ortak bileşenine taşındı. Görsel yüklenemezse `onError` ile erişilebilir **“Robi rehber”** yedek kartı gösteriliyor; bileşen Login, Home, Lessons, Trace100 ve TeacherDashboard yüzeylerinde kullanılıyor. Yedek davranış, yeni birim testiyle kaynak düzeyinde doğrulandı. Öğrenci ve öğretmen oturumlarındaki Robi görünürlüğü gerçek tarayıcıda, günlük görev/kazanım/ayrıntı sözleşmeleri ise otomatik testlerle kontrol edildi.


## Yönetici oturumunda günlük görev API hatası — düzeltme

Yönetici oturumunda `/` açılırken öğrenciye özel `learning.dailyTask` sorgusunun çalışması nedeniyle **“Günlük görev yalnız öğrenci hesaplarına açıktır.”** hatası oluştu. Kök neden, gelişim panosunun günlük görev sorgusunu yalnızca genel `isAuthenticated` durumuna bağlamasıydı. Düzeltmede `account.status` sorgusu eklendi; profil ve günlük görev çağrıları yalnızca `role === "student"` olduğunda etkinleşiyor. Günlük görevi tamamlama mutasyonu da aynı istemci koşulunu kullanıyor; sunucu tarafında öğrenci rolü, aktif hesap ve kullanıcı sahipliği ayrıca korunuyor.

Düzeltme sonrasında gerçek bağlı yönetici oturumunda `/?from_webdev=1` yeniden açıldı. Sayfa hata bildirimi olmadan yüklendi; Robi, rota, gelişim panosu, günlük görev kartı ve mevcut öğretmen bağlantısı görünür kaldı. Birim testleri **10 dosya / 31 test**, tür denetimi ve üretim derlemesi başarılı oldu. Üretim derlemesinde mevcut büyük JS paketi için performans uyarısı sürüyor; derlemeyi engellemiyor.


## Uzman platform modülleri — son genişletme

Öğrenci gelişim panosuna görev serisi, günlük üç ipucundan oluşan Robi ipucu bütçesi ve mevcut beş soruluk süreli mini denemeye doğrudan geçiş eklendi. Görev serisi tamamlanan rota adımlarından türetiliyor; günlük görev tamamlanması öğrenci hesabı için `dailyTasks` tablosuna, misafir için ayrıştırılmış yerel yedeğe yazılıyor. Yönetici/öğretmen hesaplarında öğrenciye özel günlük görev sorgusu artık çalışmıyor; gerçek yönetici ana sayfası hata vermeden yüklendi.

Öğretmen panelinde açık **eksik kazanım özeti**, eşik altında kalan öğrenci sayıları ve sınıf içi görev önerisi seçimi eklendi. Öğrenci adına açılan ayrıntı satırı rota, deneme, risk ve Robi önerisini gösteriyor. Yeni alanlar `375 × 812` görünümünde taşmasız görüntülendi; Robi rehberi panel üstünde görünür kaldı. TeacherDashboard’daki yeni state hook’ları koşullu dönüşlerin önüne taşındı; böylece React’in “Rendered more hooks than during the previous render” çökmesi giderildi.


## Kalıcı görev ataması ve çalışma ritmi doğrulaması

Öğretmen panelindeki görev önerisi artık `teacherAssignments` tablosuna yazılıyor. Sunucu mutasyonu öğretmen rolünü ve `managedByUserId` sahiplik ilişkisini kontrol ediyor; başka sınıftaki öğrenciye atama yapılamıyor. Öğrenci tarafı yalnız aktif kendi hesabına ait atanmış görevleri sorguluyor ve gelişim panosunda öğretmen görevi kartı olarak gösteriyor. Öğrenci serisi tamamlanan adımlardan türetiliyor; günlük Robi ipucu bütçesi hesap/gün anahtarıyla tarayıcıda korunuyor; süreli mini deneme bağlantısı mevcut deneme akışına bağlanıyor.

Yeni modüller için `assignment.test.ts`, `teacherDashboardForm.test.ts` ve `studentGrowth.test.ts` sözleşmeleri; panel form etiketleri, durum mesajları, rol koşulları ve öğrenci sahipliği için kullanıldı. Yönetici ana sayfası günlük görev hatası olmadan, öğretmen paneli ise 375 px görünümde Robi, eksik kazanım özeti, öğrenci seçimi ve “Görevi ata” formuyla yüklendi. Son doğrulama: **11 test dosyası / 34 test**, `pnpm check` ve üretim derlemesi başarılı.


## Kalıcı pratik ve sınıf ataması — tamamlayıcı denetim

İpucu bütçesi artık `studentPractice` tablosunda tutuluyor; yalnız aktif öğrenci hesabı `practice` ve `spendHint` prosedürlerine erişebiliyor. Öğretmen ataması `teacherAssignments` tablosuna yazılıyor; tek öğrenci ve sınıfın tamamı için sahiplik doğrulaması yapılıyor. Görev seçeneklerine mini deneme de eklendi ve öğrenci gelişim panosu son atanmış görevi gösteriyor.

Erişilebilirlik kontrollerinde öğrenci/görev seçim etiketleri, atama başlığı, `role="status"`, günlük görev etiketi, ipucu butonunun tükenince disabled olması ve ilerleme çubuklarının `aria-valuenow` değerleri kontrol edildi. Boş sınıf ve boş öğrenci ataması durumları için kullanıcıya açıklayıcı durum mesajları bulunuyor. Son otomatik doğrulama: **11 test dosyası / 34 test**, tür denetimi ve üretim derlemesi başarılı; mobil ve masaüstü ekranlarında yeni paneller taşmadan yüklendi.

## Rol duyarlı ana sayfa ve kalıcı çalışma serisi doğrulaması

Gerçek `ogretmen.alfa2026` oturumunda ana sayfa yeniden yüklendiğinde öğrenciye özel günlük görev ve ipucu bütçesi kartı gösterilmedi; bunun yerine Robi’nin **“Robi’nin sınıf rehberi”** kartı ve öğretmen merkezine yönlendirme göründü. Böylece öğrenciye özel günlük görev sorgusundan kaynaklanan API hatası ve yanlış bağlam sunumu giderildi.

Gerçek `ogrenci.alfa2026` oturumunda Robi, öğrenci gelişim panosu, günlük görev ve oyunlaştırılmış çalışma ritmi birlikte göründü. **“Görevi tamamladım”** etkileşimi düğmeyi **“Kaydediliyor…”** durumuna geçirdi; API yanıtından sonra çalışma serisi `0 gün` değerinden **`1 gün`** değerine yükseldi ve ipucu bütçesi `3/3` olarak kaldı. Bu kanıt, günlük görev tamamlanmasının hesap bazlı sunucu durumuna işlendiğini doğruladı.

## Son canlı QA — Robi fallback ve günlük görev

23 Ağustos 2026 tarihli canlı tarayıcı kontrolünde `?qaRobiFallback=1` parametresiyle kontrollü görsel yükleme hatası simüle edildi. Ana sayfada ve `/konu-anlatimi` sayfasında Robi görsel alanı yerine **“Robi / REHBER”** fallback rozeti göründü; içerik akışında sayfa düzeni bozulmadı ve diğer Robi rehber metinleri okunabilir kaldı. `/giris` ekranında da aynı koşulda Robi rehber kartı yüklenerek erişilebilir fallback görünümü korundu. Bileşenin DOM sözleşmesi `role="img"`, `data-testid="robi-image-fallback"` ve `aria-label="…; görsel yüklenemedi"` niteliklerini içeriyor; bu davranış, gerçek tarayıcıda parametreli kontrol ve üç birim testle güvenceye alındı. QA parametresi yalnızca kontrollü test içindir; normal URL’de `shouldSimulateFailure()` pasif kalır.

Öğrenci akışının önceki canlı kontrolünde günlük görev tamamlanırken **“Kaydediliyor…”** durumu ve çalışma serisinin `0` günden `1` güne yükselmesi gözlendi; bu hesap bazlı kalıcı tRPC/DB akışını doğruladı. Son kalite kapısında `pnpm test` sonucu **11 dosya / 36 test geçti**, `pnpm check` başarılı ve `pnpm build` başarılıdır. Derlemede yalnızca 500 kB üzeri istemci chunk’ları için performans uyarısı raporlanmıştır; işlevsel derleme hatası yoktur.

Ek canlı kontrol: `/ogretmen?qaRobiFallback=1` URL’si mevcut öğrenci oturumunda açıldığında uygulama Robi verisini sızdırmadan **“Öğretmen erişimi gerekli / Bu alan yalnız öğretmen hesapları içindir.”** koruma ekranını gösterdi. Bu, TeacherDashboard’ın rol kapısının fallback simülasyonundan önce çalıştığını doğrular; yetkili TeacherDashboard içindeki RobiImage kullanımı ve fallback sözleşmesi birim testleriyle ayrıca kapsanır. Trace100 ayrı bir route değil, ana rota görev görünümünün parçasıdır; `/?qaRobiFallback=1` canlı kontrolünde görev sahnesindeki **Robi / REHBER** fallback görünümü, `role="img"` ve `görsel yüklenemedi` aria sözleşmesiyle birlikte doğrulandı.

## Yeni modül QA — İlk 20 ve profil avatarları

Ana sayfa gerçek tarayıcıda `/` yolunda kontrol edildi. **“İlk 20: izini büyütenler”** başlığı, puanlar, sıralama numaraları ve avatar rozetleri yüklendi; mevcut veritabanındaki aktif öğrenciler puana göre listelendi. Kullanıcı adı yerine görünen adın ilk bölümü kullanıldığı için genel liste öğrencilerin gereksiz kişisel bilgilerini açığa çıkarmıyor. Öğrenci hesabı `ogrenci.alfa2026` profil sayfasında `/giris` yolunda **“Kendine bir avatar seç”** bölümüyle birlikte 20 erişilebilir seçim düğmesi gösterildi. Bir avatar seçildiğinde **“Avatarın güncellendi.”** durum mesajı oluştu; ana sayfaya dönüldüğünde seçilen mercan tilki sembolü ilgili öğrenci satırında göründü.

Mobil görsel kontrolde `375×812` görünümünde ana sayfa kahraman alanı ve `/giris` profil ekranı taşmadan görüntülendi. Avatar grid’i mobilde dört sütuna düşerek dokunulabilir seçim alanlarını korudu. İlk 20 kartı masaüstünde iki sütunlu, küçük ekranda tek sütunlu düzene geçti. `leaderboard.test.ts` ile 20 benzersiz avatar, aktif öğrenci filtresi, puan/eşitlik sıralaması, public leaderboard ve öğrenci-only avatar mutation sözleşmeleri doğrulandı. Son paket: **12 test dosyası / 40 test geçti**, `pnpm check` ve `pnpm build` başarılı; derleme yalnızca büyük istemci chunk’ı için mevcut performans uyarısını bildirdi.

## İlk 20–Robi yerleşim düzeltmesi

Kullanıcı geri bildirimi üzerine ana sayfa içerik sırası yeniden düzenlendi. Genel **İlk 20** kartı artık Robi’nin personel yönlendirme kartından sonra geliyor; böylece önce kullanıcının bağlamı ve yönlendirmesi, ardından rekabet/ilerleme yüzeyi okunuyor. Önceki görünümde `growth-panel` için özel grid stilleri eksik olduğundan Robi görseli metinden kopuyor ve geniş dikey boşluk oluşturuyordu. Kart artık masaüstünde 150 px Robi alanı ile metni yatay kompozisyonda, mobilde 74 px görsel alanı ile kompakt iki sütunlu düzende gösteriyor. `375×812` full-page görsel kontrolde Robi kartı taşmadan ve İlk 20 bölümü hemen altında tutarlı ritimle görüntülendi. Dev server güncellemesinden sonra TypeScript hatası kalmadı.


Düzeltme sonrası masaüstü browser kontrolünde `/` sayfasında öğrenci görünümü doğrulandı: öğrenme durumu şeridinin ardından öğrenci gelişim panosu, onun altında İlk 20 kartı yer alıyor. Böylece sıralama artık Robi/gelişim bağlamından kopuk görünmüyor; seçili avatar sembolü ve puan satırları okunur durumda. Önceki büyük dikey boşluk ve Robi görselinin metinden ayrılması gözlenmedi. Bu değişiklikten sonra `pnpm check` başarılı oldu; leaderboard ve öğrenci gelişim regresyon çalıştırması 12 test dosyasında 40 testi geçirdi.


## Öğrenci sıralaması anonim ad gösterimi

İlk 20 sıralaması gerçek tarayıcıda yeniden kontrol edildi. Öğrenci adları artık `De..... Öğ.....`, `Öğ..... Al.....`, `Öğ..... Be.....` ve `sd..... Öğ.....` biçiminde görünüyor; tam adlar sıralama arayüzüne taşınmıyor. Sunucu tarafındaki `maskStudentDisplayName` fonksiyonu adın ve soyadın ilk iki Unicode karakterini koruyor, kalan bölümü beş noktayla kapatıyor. Türkçe karakter, fazla boşluk, tek isim ve kullanıcı adı fallback senaryoları birim testte doğrulandı. Leaderboard test paketi 5 test, toplam regresyon paketi 12 dosyada 41 test geçti; `pnpm check` ve `pnpm build` başarılı.


## Bilim ve Zekâ — 20 soruluk ek modül

Bilge Kunduz/Bebras’ın resmî Türkiye sayfası, 2019–2023 arşivi ve 5–6. sınıf etkinlik denemesi incelendi. Kaynaklardan yalnızca bilgi işlemsel düşünme, örüntü, algoritmik akıl yürütme, strateji ve yaş grubu yaklaşımı çıkarıldı; özgün soru metni veya ayırt edici şık düzeni kopyalanmadı. Araştırma ayrıntıları `research-bilim-zeka.md` dosyasına kaydedildi.

`/bilim-zeka` rotası gerçek tarayıcıda açıldı. Başlık, Robi rehber kartı, `1 / 20` sayaç, kategori, 10 saniyelik cevap kilidi, A–H sekiz seçenek ve üç kademeli ipucu alanı görünür durumda. `375×812` full-page kontrolünde soru kartı, seçenekler ve kaynak/telif bağımsızlık notu taşmadan görüntülendi. 20 soru veri testinde soru sayısı, tekil seçenekler, cevap bulunması, üç ipucu, sıralı numaralar ve benzersiz kimlikler doğrulandı. Düzeltilen mikroskop sorusunun cevabı seçenek listesine eklendi. Son kalite kapısı: **13 test dosyası / 44 test geçti; `pnpm check` ve `pnpm build` başarılı**. Build yalnızca mevcut büyük istemci chunk’ı uyarısını veriyor.


## Bilim ve Zekâ — konfeti ve öğretmen analizi

Doğru cevap sonrası `/bilim-zeka?qa=confetti` akışında 10 saniyelik kilit tamamlandı; B seçeneği tıklanınca `Harika iz sürdün!` ve `Robi seninle gurur duyuyor.` mesajları görünür oldu. Görsel konfeti parçacıkları, `role="status"` ve `aria-live="polite"` canlı durum alanı birlikte çalıştı. İlk denemede anonim kullanıcı sonuç mutation’ının login yönlendirmesi ürettiği görüldü; sonuç kaydı yalnızca oturum açmış ve hesap rolü öğrenci olan kullanıcılara çağrılacak şekilde düzeltildi. Böylece anonim öğrenciler kutlamayı görmeye devam eder, yetkili öğrencilerin sonuçları kaydedilir.

`scienceResults` tablosu migration `0008_wealthy_micromacro.sql` ile oluşturuldu. Öğretmen sorgusu yalnızca kendi yönettiği aktif öğrenci hesaplarını döndürür; öğrenci adları sunucu tarafında anonimleştirilir. Öğretmen paneline öğrenci bazlı soru/doğru/yanlış tablosu ve yanlış oranına göre sıralanan “En çok zorlanılan beceriler” görünümü eklendi. Yetkisiz `/ogretmen` ziyareti `/giris` sayfasına yönlendirildi; yetkili yüzey için tRPC rol koruması birim testte doğrulandı.

Son kalite sonucu: **14 test dosyası / 46 test geçti; `pnpm check` ve `pnpm build` başarılı.** Build mevcut istemci chunk boyutu uyarısını vermeye devam ediyor; işlevsel hata değil.


## Bilim ve Zekâ puan sıralaması ve Bilim ve Zekâ Ustası rozeti — 23 Ağustos 2026

Ana sayfadaki ortak keşif tahtasında `Atlas puanı` ve `Bilim ve Zekâ` sekmeleri gerçek tarayıcıda doğrulandı. Bilim ve Zekâ sekmesi seçildiğinde başlık `İlk 20: bilim ve zekâ izleri` oldu; ayrı sorgu yüklenerek puan listesi ve anonim ad/avatar satırları gösterildi. Bilim puanı, aynı sorunun tekrar doğru yanıtlanmasıyla şişmeyecek şekilde benzersiz doğru soru kimliklerinden hesaplanır ve her benzersiz doğru soru 10 puandır.

Sunucu sonuç kaydı 20 benzersiz doğru soruya ulaşan öğrenciye `bilim-zeka-ustasi` rozetini bir kez verir. Profil ekranında bu anahtar bulunduğunda `Bilim ve Zekâ Ustası` özel başarı kartı ve `20 sorunun tamamını doğru izlerle tamamladın.` açıklaması görünür. Ana sayfa, Bilim/Zekâ modülü ve giriş/profil yüzeyleri masaüstü 1280×720 ve mobil 375×812 screenshot QA’da taşmasız kaldı. `pnpm test`: 14 dosya, 46 test başarılı; `pnpm check` ve `pnpm build` başarılı.


## Bilim ve Zekâ kişisel sıra, rozet ilerlemesi ve sınıf karşılaştırma QA — 23 Ağustos 2026

Bilim ve Zekâ leaderboard sorgusu artık İlk 20 listesinin yanı sıra oturumdaki aktif öğrenci için `personal` kaydı döndürüyor. Öğrenci ilk 20 dışında olsa da kişisel anonim adı, sıra numarası ve puanı ayrı `Senin yerin` satırında gösteriliyor; yönetici/öğretmen veya anonim ziyaretçide bu satır açılmıyor. Sunucu sıralaması puan eşitliğinde kullanıcı kimliğiyle deterministik kalıyor.

Öğrenci profil sorgusu benzersiz doğru Bilim ve Zekâ sorusu sayısını, 20 hedefini, puanı ve kalan doğru sayısını döndürüyor. Profilde `Bilim ve Zekâ Ustası` ilerleme çubuğu `role=progressbar`, `aria-valuenow`, `aria-valuemax=20` ile görünür; kalan hedef metni doğru sayıya göre değişiyor.

Öğretmen analiz sorgusu yalnız öğretmenin yönettiği aktif öğrencileri yaş/sınıf bandına göre gruplayarak ortalama puan ve 20 soru üzerinden başarı oranı üretiyor. Panelde `Sınıfların genel karşılaştırması` bölümü, her bandı puan/başarı çubuğu ve öğrenci sayısıyla gösteriyor. Masaüstü 1280×720 ve mobil 375×812 screenshot QA’da ana sayfa, profil ve öğretmen paneli taşmasız kaldı. `pnpm test`: 14 dosya, 46 test başarılı; `pnpm check` başarılı. Build kontrolü daha önceki aynı değişiklik paketi için başarılı.


## Sesli kutlama, puanlı ipucu ve CSV dışa aktarma QA — 23 Ağustos 2026

Bilim ve Zekâ sayfasında cevap kilidi kalkmadan `İpucu · 5 puan` düğmesinin görünür fakat pasif olduğu, kilit kalkınca erişilebilir hâle geldiği gerçek tarayıcıda kontrol edildi. Doğru ilk yanıt seçildiğinde konfeti kutlaması, `Harika iz sürdün!`, `Robi seninle gurur duyuyor.` ve `Sesi kapat` kontrolü aynı kutlama kartında oluştu. Ses Web Audio ile yalnız kullanıcı tıklaması sonrasında başlıyor; kullanıcı kontrolü `aria-pressed` ile erişilebilir biçimde sesi kapatabiliyor.

Puanlı ipucu akışı sunucuda aktif öğrenci oturumuna ve soru başına tek kullanıma bağlandı; ipucu kullanımı 5 puan ceza ile kaydediliyor ve mevcut puan 5’in altındaysa reddediliyor. Öğretmen analiz kartındaki CSV dışa aktarma kodu öğrenci, beceri ve sınıf bandı satırlarını UTF-8 BOM’lu CSV olarak üretiyor; formül başlangıç karakterleri hücreye güvenli apostrofla yazılıyor. `pnpm check` ve test paketi başarılı; üretim derlemesi son kalite geçişinde yeniden çalıştırılacak.


## Bilfen Öğretmen Kampüsü ve öğrenci grupları — son doğrulama

Migration 0010 sonrasında yerel öğretmen hesabı tek bir `campusKey` ile eşleştirildi. Sunucu tarafındaki öğrenci oluşturma ve öğrenci listeleme akışları öğretmenin kampüs kapsamını koruyor; öğretmen yeni öğrenci formunda kampüs seçimini değiştiremiyor ve açıklama metni öğrencinin öğretmen kampüsüne bağlanacağını açıkça belirtiyor. Yönetici hesabı kampüs seçimini yönetebiliyor.

Öğrenci profil sorgusu artık kampüs anahtarını, sınıf düzeyini ve alanını birlikte döndürüyor. `Login.tsx` içinde öğrenci profil kartı kampüsün tam Bilfen adını, `5/6/7. sınıf` etiketini ve `Explorer/Innovator/Designer` alanını gösteriyor. Mobil kartta bilgiler dikey akışa geçiyor.

Öğretmen ilerleme roster’ında grup filtresi `Tüm gruplar` ile dokuz kombinasyonu (`5/6/7 × Explorer/Innovator/Designer`) sunuyor. Filtre; öğrenci sayacını, ilerleme tablosunu, destek özeti ve görev atama öğrenci listesini aynı kampüs kapsamı içinde birlikte daraltıyor. Filtre sonucu boş olduğunda yanıltıcı genel boş durum yerine “Bu grupta henüz öğrenci bulunmuyor.” mesajı gösteriliyor.

Kalite kapısı: `server/campusGrouping.test.ts` ile kampüs anahtarlarının benzersizliği, 19 kampüs adı ve dokuz ortaokul grubu doğrulandı. Toplam `15` test dosyasında `48` test geçti; `pnpm check` ve `pnpm build` başarılı. Üretim derlemesinde yalnızca mevcut Vite chunk-size uyarısı görüldü. Önizlemede ana sayfa görseli doğru açıldı; `/giris` oturum durumu yüklenirken erişilebilir “Hesap durumu hazırlanıyor…” metnini gösterdi. Gerçek My Browser bağlantısı bu oturumda kurulamadığı için öğretmen oturumlu etkileşimli QA yeniden çalıştırılamadı; erişim izolasyonu ve kampüs kapsamı mevcut sunucu testleriyle korunuyor.


## Dinamik analiz, toplu aktarım ve kampüs yönetim raporu

Bilim ve Zekâ analiz sorgusu artık öğretmen roster’ındaki seçili `5/6/7 × Explorer/Innovator/Designer` grubunu tRPC input’u olarak alıyor. Grup değiştiğinde öğrenci sonuçları, beceri zorlukları, band grafiği ve CSV dışa aktarma verisi aynı filtreyle yeniden hesaplanıyor; sunucu sorgusu yalnızca öğretmenin yönettiği aktif öğrencileri kapsıyor.

Roster satırlarında `Grubu düzenle` akışı sınıf ve alanı değiştiriyor. Güncelleme helper’ı önce öğrencinin gerçekten ilgili öğretmene bağlı olduğunu doğruluyor; farklı öğretmenin öğrencisi için `NOT_FOUND` dönüyor. Kampüs anahtarı öğretmen tarafından değiştirilemiyor.

CSV aktarımı UTF-8 dosya seçimi, beklenen başlıklar (`displayName,username,temporaryPassword,gradeLevel,track`) ve en fazla 100 satır ile çalışıyor. Parolalar istemciden hash olarak gönderilmiyor; sunucuda hashleniyor. Öğrenciler aktarımı yapan öğretmenin kampüsüne bağlanıyor ve her satır için başarı/hata sonucu gösteriliyor.

`/kampus-raporu` yalnız yönetici rolüne açık yeni sayfadır. Gerçek aktif öğrenci kayıtlarından kampüs bazında öğrenci sayısı, Atlas tamamlanma yüzdesi, Bilim ve Zekâ ortalama puanı ve başarı oranı hesaplanıyor. Görsel çubuk grafikler, özet kartları ve erişilebilir veri tablosu masaüstü ve mobil akışa uygun biçimde sunuluyor. Yetkisiz kullanıcıya erişim mesajı veriliyor.

Kalite kapısı: `16` test dosyasında `51` test geçti; `pnpm check` ve `pnpm build` başarılı. Üretim derlemesinde yalnız mevcut Vite chunk-size uyarısı görüldü. Kimlik doğrulama gerektiren öğretmen ve yönetici ekranlarında önizleme oturum açma bekleme durumunu gösterdi; gerçek My Browser bağlantısı bulunmadığından oturum içi tıklama QA’sı ayrıca çalıştırılamadı.


## CSV önizleme, dönem karşılaştırması ve çoklu grup güncellemesi

CSV aktarım alanına örnek şablon indirme eklendi. Dosya seçildiğinde satırlar hemen aktarılmıyor; başlıklar ve temel alanlar doğrulanıyor, geçerli satırlar tablo önizlemesinde gösteriliyor, hatalı satırlar numarasıyla raporlanıyor ve aktarım kullanıcı onayından sonra başlıyor.

Kampüs raporunda başlangıç/bitiş tarihleri admin tRPC input’una bağlandı. Seçili dönem için gerçek `learningResults` ve `scienceResults` zaman damgaları kullanılıyor; aynı uzunluktaki önceki dönemle Atlas gelişim farkı kampüs bazında görsel çubuklarla karşılaştırılıyor.

Öğretmen roster’ına görünür öğrencileri seçme, tümünü seçme ve ortak sınıf/alan güncelleme formu eklendi. Toplu mutation en fazla 100 öğrenci alıyor ve her öğrenciyi mevcut öğretmen-kampüs kapsam helper’ı üzerinden güncelliyor.

Mobil önizleme, kimlik doğrulama gerektiren ekranlarda bekleme durumunu gösterdi. Testler ve üretim derlemesi başarılıdır; gerçek oturum içi etkileşimler için bağlı tarayıcı oturumu gereklidir.


## CSV çakışma uyarısı, Bilim/Zekâ ikinci seri ve toplu işlem onayı

CSV önizlemesi dosya içindeki tekrarları ve mevcut roster kullanıcı adlarıyla çakışmaları küçük harf duyarsız karşılaştırmayla tespit ediyor; çakışan satırlar aktarılacak listeden çıkarılıp satır numarasıyla gösteriliyor.

Dönem karşılaştırma grafiğinde Atlas tamamlanmasına ek olarak Bilim ve Zekâ puanı için seçili dönem/önceki eş dönem farkı ikinci görsel seri olarak gösteriliyor.

Toplu grup güncellemesi artık doğrudan çalışmıyor. Öğretmen önce etkilenecek öğrencilerin adlarını, seçili sınıfı ve alanı modal içinde görüyor; yalnızca “Onayla ve güncelle” seçildikten sonra sunucu mutation’ı çağrılıyor.

Kalite kapısı: `16` test dosyasında `51` test geçti; `pnpm check` ve `pnpm build` başarılı. Üretim derlemesinde yalnız mevcut Vite chunk-size uyarısı görüldü.
