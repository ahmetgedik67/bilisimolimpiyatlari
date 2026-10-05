# Silent Teacher İncelemesi — Tasarım Yaklaşımları

## Yaklaşım Seçenekleri

### 1. Sessiz Keşif Defteri
**Very Brief Intro:** Editoryal bir araştırma günlüğünün dinginliğiyle tasarlanan; soruları, denemeyi ve çıkarımı ön plana alan açık tonlu bir arayüz. Kullanıcıda, bir pedagojik tasarımın iç işleyişini adım adım keşfetme hissi uyandırır.

**Probability:** 0.037

### 2. Öğrenme Laboratuvarı
**Very Brief Intro:** Bilimsel ölçüm ve eğitimsel geri bildirimi harmanlayan, net etiketli ve yüksek karşıtlıklı bir analitik kontrol paneli. İnceleme bulgularını ölçülebilir tasarım kararlarına dönüştürür.

**Probability:** 0.082

### 3. Kodun Sessiz Haritası
**Very Brief Intro:** Renkli kavram düğümleri, akışkan rotalar ve soyut örüntüler kullanarak oyunun sözsüz ilerleyişini görsel bir ekosisteme çevirir. Keşif odaklı öğrenme sürecini hareketli bir zihin haritası gibi anlatır.

**Probability:** 0.014

---

## Seçilen Yaklaşım: Sessiz Keşif Defteri

### Design Movement
**Çağdaş editoryal bilgi tasarımı** ile **Montessori esintili eğitim materyali** estetiğinin birleşimi. Arayüz, ders anlatan bir panel gibi değil; kanıt, gözlem ve yorumun aynı sayfada buluştuğu düşünceli bir saha defteri gibi hissedilir.

### Core Principles
1. **Sükûnet, yönlendirmeden önce gelir.** Boşluk, zayıf renk paleti ve az sayıda güçlü odak noktası; Silent Teacher'ın açıklama yerine keşfe dayanan tavrını yansıtır.
2. **Kanıt görünür olmalıdır.** Her iddia, kaynak bağlantısı, kategori ya da açıkça belirtilmiş yorum olarak ayrıştırılır.
3. **Etkileşim açıklayıcıdır.** Grafik seçicileri ve ayrıntı açılırları yeni bir görev eklemek için değil, aynı bulguyu farklı bir mercekten görmek için kullanılır.
4. **Hata bir sinyal olarak ele alınır.** Yanlış yanıtın cezalandırılmadığı özgün tasarıma paralel olarak, sınırlılıklar ve tasarım gerilimleri saklanmaz; sakin bir dil ile belirtilir.

### Color Philosophy
Sayfa, sıcak kâğıt zeminini Silent Teacher'ın koyu petrol mavisiyle birleştirir. Petrol mavisi araştırma ciddiyeti ve odak hissi verir; öğretici sarı küçük müdahale noktalarında merak uyandırır; yosun yeşili ise doğru yanıtı ödüllendiren olumlu geri bildirim mantığını taşır. Vurgu renkleri yalnızca bilgi hiyerarşisi için kullanılır, süsleme için değil.

### Layout Paradigm
Merkezi bir kart ızgarası yerine, sol tarafta yapışkan bir **araştırma indeksi**, sağda ise farklı ritimlerde akan bir **okuma şeridi** kullanılır. Geniş ekranlarda başlık, sayı ve kanıt katmanları asimetrik kolonlarda durur; mobilde bunlar ardışık ve rahat okunur bloklara dönüşür.

### Signature Elements
- **Sarmal ilerleme çizgisi:** Özgün oyundaki soyut ilerleme özetine atıf yapan ince, kesikli bir rota.
- **Kenar notu etiketleri:** “Kaynak”, “Tasarım çıkarımı” ve “Sınırlılık” ayrımını belirginleştiren küçük, renk kodlu işaretler.
- **Yanıt izi grafiği:** Öğrenme döngüsünü sorudan geri bildirime ve kavram sağlamlaştırmaya bağlayan çizgisel mini görselleştirme.

### Interaction Philosophy
Etkileşimler merak uyandıracak kadar görünür, dikkat bölmeyecek kadar hafiftir. Grafiklerde sekme seçimi, teknoloji odağını değiştirir; kavram kartlarında odaklanan alanlar derinleşir; kaynaklar yeni sekmede açılır. Tüm kontroller klavye odağı ve açık etiketlerle erişilebilirdir.

### Animation
Girişlerde kartlar sırayla belirme ve kısa yukarı hareket kullanır; süre 220 ms'yi geçmez. Sarmal rota yavaşça çizilir, ancak `prefers-reduced-motion` durumunda hareketsiz görünür. Hover efektleri yalnızca gölge, opaklık ve dönüşümle sınırlıdır; hareket akademik okuma akışını asla bölmez.

### Typography System
Başlıklar için **DM Serif Display**, gövde ve veri etiketleri için **DM Sans** kullanılır. Büyük başlıklar belirgin ama ölçülüdür; tablo ve grafik sayı etiketleri sabit genişlikli **IBM Plex Mono** ile ayrıştırılır. Metin hiyerarşisi, yüksek ses yerine boşluk ve ağırlık farkı ile kurulur.

### Brand Essence
**Silent Teacher İncelemesi, sözsüz keşif yoluyla programlama öğreniminin tasarım mantığını görünür kılan, eğitim tasarımcıları ve meraklı yetişkin öğrenenler için bir araştırma notudur.**

Kişilik: **düşünceli, berrak, cesaretlendirici**.

### Brand Voice
Başlıklar ve mikro metinler talimat vermek yerine gözlem yapar; kısa, kesin ve yargılamayan bir dil kullanır.

Örnekler:

> “Kural söylenmiyor; örüntü görünür hâle geliyor.”

> “Hata burada bir kesinti değil, sıradaki ipucudur.”

### Wordmark & Logo
Metinsiz logo; bir soru işareti ile açık döngüyü birleştiren, yukarı doğru kıvrılan **tek çizgili spiral işaret** olacaktır. İşaret, ilerleme özeti ve keşif rotasıyla aynı geometri ailesini paylaşır.

### Signature Brand Color
**Sessiz Petrol — #0F4C5C**. Bu renk, markanın dingin fakat kararlı araştırma tavrını taşır.

---

# Platforma Dönüşüm — C Olimpiyat Hazırlık Alanı

## Yeni Tasarım Yönleri

### 1. Algoritma Atlası
**Very Brief Intro:** Bir keşif haritasında ilerleyen, her bölgesi ayrı bir algoritmik beceriyi temsil eden macera tabanlı ders deneyimi. Başarı, puan bombardımanından çok yeni düşünme araçlarına erişim olarak görünür.

**Probability:** 0.061

### 2. C Atölyesi
**Very Brief Intro:** Kod parçacıkları, mantık blokları ve ölçülü oyun döngüleriyle çalışan sıcak bir çalışma masası. Öğrencinin çözümü izleyip değiştirebileceği, sakin ama canlı bir problem laboratuvarı kurar.

**Probability:** 0.029

### 3. Olimpiyat Pusulası
**Very Brief Intro:** Sınav ritmi ve ilerleme verisini görünür kılan, yön bulma metaforu üzerine kurulu yapı. Kısa görevler, rozetlerden çok bir sonraki beceriye giden yolu açar.

**Probability:** 0.084

## Seçilen Yaklaşım: Algoritma Atlası

### Design Movement
**Çağdaş eğitim oyunu arayüzü** ile **bilimsel saha atlası** estetiğinin birleşimi. Silent Teacher’ın örnekten kural çıkarma tavrı, bir keşif rotasının her durağında korunur; ancak olimpiyat hazırlığının gerektirdiği açık yapı ve deneme stratejisi de görünür hâle getirilir.

### Core Principles
1. **Keşif, açıklamadan önce gelir.** Ders kartı önce küçük bir soruyla başlar; öğrenci kuralı fark ettikten sonra kısa açıklama açılır.
2. **Yaş bandı görünür olmalıdır.** 5–6 ve 7–8 rotaları aynı temelleri paylaşır; zorluk, örnek türü ve görev derinliği farklılaşır.
3. **Oyun döngüsü öğrenme döngüsüdür.** Görev, deneme, ipucu, tekrar ve ustalık işareti; puan toplamaktan daha önemlidir.
4. **Olimpiyat hazırlığı dürüstçe çerçevelenir.** Platform bağımsız bir hazırlık alanıdır; resmî kurum, sınav ya da puan verisi izlenimi yaratmaz.

### Color Philosophy
Ana zemin; sıcak taş kâğıdıdır. Koyu mürekkep mavisi problem çözme odağını taşır; canlı mercan “deneme” anlarını, deniz yeşili “kavradım” anlarını, altın sarısı ise keşfedilecek ipuçlarını işaretler. Renk, seviyeyi değil işlevi ifade eder.

### Layout Paradigm
Masaüstünde solda dikey **atlas rotası**, ortada aktif görev sahnesi, sağda ise yalnızca gerektiğinde açılan **ipuçları ve C belleği** alanı kullanılır. Mobilde rota, görev öncesinde yatay kaydırılabilir bir yol haritasına dönüşür. Merkezi tek kartlı yerleşimden kaçınılır.

### Signature Elements
- **Altıgen koordinat taşı:** Her ders alanını ve açılan görevi temsil eden, köşeleri hafif düzensiz kartografik işaret.
- **Bellek kavanozları:** Değişken değerlerini, soyut C durumunu anlatan renkli ama sade veri kutuları.
- **İz çizgisi:** Öğrencinin tamamladığı görevler arasında oluşan noktalı, yönlü rota.

### Interaction Philosophy
Tıklama, öğrenciye yeni bir etiket değil yeni bir ipucu, örnek veya düşünme yolu vermelidir. Her görevde geri bildirim anlıktır, fakat doğru yanıtı doğrudan vermeden ikinci bir örnek ya da durum izleme seçeneği sunar. Tüm oyunlaştırılmış kontroller klavye ile çalışır ve metinsel durum bildirimi taşır.

### Animation
Rotadaki görev açıldığında yalnızca altıgen işaret yer değiştirir ve görev sahnesi 200 ms içinde görünür. Başarılı çözümde bir “mürekkep damgası” kısa süreli büyür; yanlışta kart titreşmez, sadece yeni örnek yumuşakça girer. `prefers-reduced-motion` seçeneğinde tüm hareketler devre dışı kalır.

### Typography System
Başlıklar için **DM Serif Display**, arayüz ve anlatım için **DM Sans**, C kodu, sayaç ve görev etiketleri için **IBM Plex Mono** kullanılır. Kod blokları ders kitabı gibi net; başlıklar ise macera tonunu taşıyacak kadar karakterlidir.

### Brand Essence
**Algoritma Atlası, ortaokul öğrencilerinin C dilini ve olimpiyat tipi problem çözmeyi küçük keşif görevleriyle öğrenmesi için bağımsız bir hazırlık alanıdır.**

Kişilik: **meraklı, dayanıklı, açık sözlü**.

### Brand Voice
Dil; ne aşırı çocukça ne de sınav kaygısını büyüten türdedir. Başlıklar öğrenciyi yönlendirir, ancak çözümü elinden almaz.

> “Önce izi sür. Kural, bir sonraki örnekte netleşecek.”

> “Boş bırakmak da bir seçimdir; önce hangi bilgi eksik, onu bulalım.”

### Wordmark & Logo
Metinsiz işaret; bir C harfinin içinden ilerleyen, kuzeydoğuya yönelmiş kısa bir rota ve tek koordinat noktasıdır. Sembol, rota öğesi ve favicon olarak aynı ölçekte çalışır.

### Signature Brand Color
**Atlas Mürekkebi — #173F5F**.
