# Öğrenci ve Ders Yönetimi Uygulaması - Product Requirements Document (PRD)

## 1. Ürün Tanımı

### 1.1 Genel Bakış
Öğrenci ve Ders Yönetimi Uygulaması, öğrencilerin ve derslerin yönetimini sağlayan kapsamlı bir web uygulamasıdır. Uygulama, farklı kullanıcı rolleri arasında yetkilendirme mekanizmaları sunarak veri güvenliğini ve doğruluğunu ön planda tutar.

### 1.2 Hedef Kullanıcılar
- **Admin kullanıcılar**: Sistem yöneticileri, öğrenci ve ders kayıtlarını yönetebilen kullanıcılar
- **Öğrenciler**: Kendi profillerini yönetebilen ve derslere kayıt olabilen kullanıcılar

### 1.3 İş Hedefi
Eğitim kurumlarının öğrenci ve ders yönetimini dijitalleştirerek veri bütünlüğünü korumak, kullanım kolaylığı sağlamak ve güvenli bir ortamda bilgi alışverişini mümkün kılmak.

## 2. Teknoloji Seçimi

### 2.1 Backend
- **Node.js (Express.js)**: Hızlı API geliştirme, geniş ekosistem ve JavaScript tabanlı yazılım geliştirmenin avantajları nedeniyle tercih edildi.

### 2.2 Frontend
- **React.js**: Komponent bazlı mimarisi, virtual DOM performansı ve geniş ekosistemi ile modern kullanıcı arayüzleri geliştirmek için kullanılacak.
- **State Management**: Redux Toolkit ile merkezi durum yönetimi sağlanacak.

### 2.3 Veritabanı
- **MongoDB**: NoSQL yapısı sayesinde esnek şema avantajı, ölçeklenebilirlik ve JSON benzeri döküman tabanlı veri saklama özellikleri için tercih edildi. JavaScript ekosistemi ile uyumlu olması, Node.js ile birlikte kullanımı daha kolay hale getirmektedir.

### 2.4 Konteynerizasyon
- **Docker & Docker Compose**: Tüm servislerin izole edilmiş ortamlarda çalışmasını sağlamak ve deployment sürecini standartlaştırmak için kullanılacak.

### 2.5 Diğer Teknolojiler
- **JWT (JSON Web Token)**: Kimlik doğrulama ve yetkilendirme mekanizması için
- **Jest**: Backend testleri için
- **React Testing Library**: Frontend testleri için
- **Axios**: API istekleri için
- **Formik & Yup**: Form yönetimi ve validasyon için
- **Mongoose**: MongoDB ODM (Object Document Mapper) olarak kullanılacak

## 3. Mimari Tasarım

### 3.1 Sistem Mimarisi
Uygulama, frontend ve backend olarak ayrılmış bir mimari kullanacaktır:

1. **Frontend Katmanı**: React.js ile geliştirilecek SPA (Single Page Application)
2. **Backend Katmanı**: Express.js ile geliştirilecek RESTful API
3. **Veritabanı Katmanı**: MongoDB NoSQL veritabanı

### 3.2 Veritabanı Şeması

#### MongoDB Koleksiyonları:
1. **users**:
   ```javascript
   {
     _id: ObjectId,
     username: String,
     email: String,
     password: String, // hashed
     role: String, // enum: "admin", "student"
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **students**:
   ```javascript
   {
     _id: ObjectId,
     userId: ObjectId, // Reference to users collection
     firstName: String,
     lastName: String,
     birthDate: Date,
     createdAt: Date,
     updatedAt: Date
   }
   ```

3. **courses**:
   ```javascript
   {
     _id: ObjectId,
     name: String, // unique
     description: String,
     createdAt: Date,
     updatedAt: Date
   }
   ```

4. **enrollments**:
   ```javascript
   {
     _id: ObjectId,
     studentId: ObjectId, // Reference to students collection
     courseId: ObjectId, // Reference to courses collection
     enrollmentDate: Date,
     createdAt: Date,
     updatedAt: Date
   }
   ```

### 3.3 API Endpoint Yapısı

#### Authentication Endpoints:
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

#### Student Endpoints:
- GET /api/students
- GET /api/students/:id
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id

#### Course Endpoints:
- GET /api/courses
- GET /api/courses/:id
- POST /api/courses
- PUT /api/courses/:id
- DELETE /api/courses/:id

#### Enrollment Endpoints:
- GET /api/enrollments
- POST /api/enrollments
- DELETE /api/enrollments/:id
- GET /api/students/:id/courses
- GET /api/courses/:id/students

## 4. Kullanıcı Hikayeleri ve Fonksiyonel Gereksinimler

### 4.1 Kimlik Doğrulama ve Yetkilendirme

#### 4.1.1 Kullanıcı Girişi
- **Hikaye**: Kullanıcı, sistemdeki kayıtlı bilgilerini kullanarak uygulamaya giriş yapabilir.
- **Kabul Kriterleri**:
  - Kullanıcı giriş formunda e-posta/kullanıcı adı ve şifre alanları bulunmalıdır
  - Hatalı giriş denemelerinde kullanıcıya uygun hata mesajları gösterilmelidir
  - Başarılı giriş sonrasında JWT token oluşturulup istemciye gönderilmelidir
  - Token'da kullanıcı rolü bilgisi bulunmalıdır

#### 4.1.2 Kullanıcı Çıkışı
- **Hikaye**: Kullanıcı, uygulamadan güvenli şekilde çıkış yapabilir.
- **Kabul Kriterleri**:
  - Kullanıcı çıkış yaptığında client tarafında JWT token silinmelidir
  - Çıkış sonrası kullanıcı login sayfasına yönlendirilmelidir

#### 4.1.3 Yetki Kontrolleri
- **Hikaye**: Sistem, kullanıcı yetkilerine göre erişimi kontrol eder.
- **Kabul Kriterleri**:
  - Tüm API istekleri yetkilendirme kontrolünden geçmelidir
  - Admin olmayan kullanıcılar yönetimsel işlemlere erişememelidir
  - API isteği yetkilendirme hatası durumunda 403 (Forbidden) yanıtı dönmelidir
  - Frontend, kullanıcı rolüne göre menü ve özellikleri dinamik olarak göstermelidir

### 4.2 Öğrenci Yönetimi

#### 4.2.1 Öğrenci Listeleme
- **Hikaye**: Admin, sistemdeki tüm öğrencileri listeleyebilir.
- **Kabul Kriterleri**:
  - Sayfalandırma (pagination) desteklenmelidir (varsayılan: sayfa başına 10 kayıt)
  - MongoDB agregasyon pipeline ile verimli sorgu sağlanmalıdır
  - Temel sıralama ve filtreleme özellikleri bulunmalıdır
  - Öğrenci adına tıklandığında detay modal/popup penceresi açılmalıdır

#### 4.2.2 Öğrenci Ekleme
- **Hikaye**: Admin, sisteme yeni öğrenci ekleyebilir.
- **Kabul Kriterleri**:
  - Form, öğrencinin adı, soyadı, doğum tarihi ve kullanıcı bilgilerini içermelidir
  - Ad ve soyad alanları boş olmamalıdır
  - Doğum tarihi gelecekte bir tarih olmamalıdır
  - E-posta adresi geçerli formatta ve benzersiz olmalıdır
  - Şifre güvenlik kriterlerini karşılamalıdır (en az 8 karakter, büyük/küçük harf ve rakam içermelidir)
  - MongoDB transaction kullanarak atomik işlem garantisi sağlanmalıdır

#### 4.2.3 Öğrenci Güncelleme
- **Hikaye**: Admin, mevcut öğrenci bilgilerini güncelleyebilir.
- **Kabul Kriterleri**:
  - Öğrenci bilgileri form üzerinde ön yüklenmiş olmalıdır
  - Ad ve soyad alanları boş olmamalıdır
  - Doğum tarihi gelecekte bir tarih olamamalıdır
  - Güncellenecek e-posta adresi, sistemdeki diğer kullanıcılarla çakışmamalıdır

#### 4.2.4 Öğrenci Silme
- **Hikaye**: Admin, sistemden bir öğrenciyi silebilir.
- **Kabul Kriterleri**:
  - Silme işlemi için onay kutusu gösterilmelidir
  - Silme işlemi, öğrencinin ders kayıtlarını da silmelidir (cascade delete)
  - MongoDB işlemi için birden fazla koleksiyonda güncelleme yapmak üzere transaction kullanılmalıdır
  - İşlem sonucu kullanıcıya bildirilmelidir

### 4.3 Ders Yönetimi

#### 4.3.1 Ders Listeleme
- **Hikaye**: Admin, sistemdeki tüm dersleri listeleyebilir.
- **Kabul Kriterleri**:
  - Sayfalandırma (pagination) desteklenmelidir (varsayılan: sayfa başına 10 kayıt)
  - Temel sıralama ve filtreleme özellikleri bulunmalıdır
  - Ders adına tıklandığında detay modal/popup penceresi açılmalıdır

#### 4.3.2 Ders Ekleme
- **Hikaye**: Admin, sisteme yeni ders ekleyebilir.
- **Kabul Kriterleri**:
  - Form, dersin adı ve açıklamasını içermelidir
  - Ders adı boş olmamalıdır
  - Ders adı, MongoDB unique index kullanılarak benzersiz tutulmalıdır
  - Ders adı sistemde zaten varsa, uygun hata mesajı gösterilmelidir

#### 4.3.3 Ders Güncelleme
- **Hikaye**: Admin, mevcut ders bilgilerini güncelleyebilir.
- **Kabul Kriterleri**:
  - Ders bilgileri form üzerinde ön yüklenmiş olmalıdır
  - Ders adı boş olmamalıdır
  - Güncellenecek ders adı, sistemdeki diğer derslerle çakışmamalıdır

#### 4.3.4 Ders Silme
- **Hikaye**: Admin, sistemden bir dersi silebilir.
- **Kabul Kriterleri**:
  - Silme işlemi için onay kutusu gösterilmelidir
  - Silme işlemi, dersin öğrenci kayıtlarını da silmelidir (cascade delete)
  - MongoDB transaction kullanılarak bağlantılı kayıtlar silinmelidir
  - İşlem sonucu kullanıcıya bildirilmelidir

### 4.4 Öğrenci-Ders Eşleştirmesi (Kayıt Olma)

#### 4.4.1 Derse Kayıt Olma
- **Hikaye**: Öğrenci, mevcut derslere kaydolabilir.
- **Kabul Kriterleri**:
  - Öğrenci, kayıtlı olmadığı derslerin listesini görebilmelidir
  - MongoDB sorgusuyla aynı derse birden fazla kayıt yapılması engellenmelidir
  - Kayıt işlemi sonucu kullanıcıya bildirilmelidir

#### 4.4.2 Ders Kaydını İptal Etme
- **Hikaye**: Öğrenci, kayıtlı olduğu bir dersten çekilebilir.
- **Kabul Kriterleri**:
  - Öğrenci, kayıtlı olduğu derslerin listesini görebilmelidir
  - Kaydı silme işlemi için onay alınmalıdır
  - İptal işlemi sonucu kullanıcıya bildirilmelidir

#### 4.4.3 Admin Tarafından Eşleştirme
- **Hikaye**: Admin, öğrencileri derslere atayabilir veya kayıtlarını kaldırabilir.
- **Kabul Kriterleri**:
  - Admin, öğrenci-ders eşleştirme ekranında öğrenciyi ve dersi seçebilmelidir
  - Sistem, aynı eşleştirmenin tekrar yapılmasını engellemelidir
  - İşlem sonucu kullanıcıya bildirilmelidir

#### 4.4.4 Eşleştirme Listesi
- **Hikaye**: Admin, öğrenci-ders eşleştirmelerini listeleyebilir.
- **Kabul Kriterleri**:
  - Liste sayfalandırılmış olmalıdır
  - MongoDB $lookup agregasyonu ile öğrenci ve ders bilgileri birleştirilmelidir
  - Listede öğrenci adı, ders adı ve kayıt tarihi bilgileri bulunmalıdır
  - Filtreleme seçenekleri (öğrenciye veya derse göre) sağlanmalıdır

### 4.5 Öğrenci Deneyimi

#### 4.5.1 Öğrenci Profili
- **Hikaye**: Öğrenci, kendi profil bilgilerini görüntüleyebilir ve güncelleyebilir.
- **Kabul Kriterleri**:
  - Öğrenci sadece kendi bilgilerini görebilmelidir
  - Şifre güncellemesi için eski şifre doğrulaması gerekmelidir
  - Güncelleme işlemi sonucu kullanıcıya bildirilmelidir

#### 4.5.2 Kayıtlı Dersleri Görüntüleme
- **Hikaye**: Öğrenci, kayıtlı olduğu dersleri listeleyebilir.
- **Kabul Kriterleri**:
  - MongoDB $lookup ile öğrencinin kayıtlı dersleri bulunmalıdır
  - Liste, ders adı ve kayıt tarihi bilgilerini içermelidir
  - Öğrenci, bu ekrandan ders kaydını iptal edebilmelidir

#### 4.5.3 Yeni Derslere Kayıt
- **Hikaye**: Öğrenci, henüz kayıtlı olmadığı derslere kayıt olabilir.
- **Kabul Kriterleri**:
  - MongoDB $lookup ve $match operatörleri ile öğrencinin henüz kayıtlı olmadığı dersler bulunmalıdır
  - Liste, öğrencinin henüz kayıtlı olmadığı dersleri göstermelidir
  - Kayıt işlemi sonucu kullanıcıya bildirilmelidir

## 5. UI/UX Tasarım Gereksinimleri

### 5.1 Genel UI Gereksinimleri
- Responsive tasarım (mobil, tablet ve masaüstü cihazlara uyumlu)
- Tutarlı renk şeması ve tipografi
- Kolay gezinme için sezgisel navigasyon
- Erişilebilirlik standartlarına uygun UI elemanları

### 5.2 Temel Sayfalar

#### 5.2.1 Giriş Sayfası
- Kullanıcı adı/e-posta ve şifre alanları
- Giriş butonu
- Hata mesajlarının görüntülenmesi için alan

#### 5.2.2 Dashboard
- Kullanıcı rolüne göre özet bilgiler
- Navigasyon menüsü
- Hızlı erişim linkleri

#### 5.2.3 Öğrenci Listesi Sayfası
- Sayfalandırılmış tablo görünümü
- Arama ve filtreleme bileşenleri
- Öğrenci ekle, düzenle, sil butonları
- Öğrenci detay modalı için tetikleyici

#### 5.2.4 Ders Listesi Sayfası
- Sayfalandırılmış tablo görünümü
- Arama ve filtreleme bileşenleri
- Ders ekle, düzenle, sil butonları
- Ders detay modalı için tetikleyici

#### 5.2.5 Kayıt Yönetimi Sayfası
- Öğrenci-ders eşleştirmelerinin tablo görünümü
- Filtreleme seçenekleri
- Kayıt ekle/sil butonları

#### 5.2.6 Öğrenci Profil Sayfası
- Kişisel bilgilerin görüntülenmesi ve düzenlenmesi
- Şifre değiştirme formu
- Kayıtlı dersler listesi
- Ders kayıt/iptal butonları

### 5.3 Modallar/Popup'lar

#### 5.3.1 Öğrenci Detay Modalı
- Öğrenci bilgileri (ad, soyad, doğum tarihi)
- Kayıtlı olduğu dersler listesi

#### 5.3.2 Ders Detay Modalı
- Ders bilgileri (ad, açıklama)
- Derse kayıtlı öğrenciler listesi

#### 5.3.3 Onay Modalları
- Silme işlemleri için onay modalı
- Kritik işlemler için onay modalı

## 6. Teknik Gereksinimler

### 6.1 Güvenlik Gereksinimleri
- JWT tabanlı kimlik doğrulama ve yetkilendirme
- Şifrelerin güvenli bir şekilde hashlenmesi (bcrypt)
- API isteklerinde JWT doğrulaması
- XSS ve CSRF korumaları
- Input validasyonu ve sanitizasyonu
- MongoDB RBAC (Role-Based Access Control) kullanılması

### 6.2 Performans Gereksinimleri
- Sayfa yükleme süresi < 2 saniye
- API yanıt süresi < 500 ms
- MongoDB sorgu optimizasyonu (uygun indekslerin oluşturulması)
- Frontend için lazy loading ve code splitting

### 6.3 Ölçeklenebilirlik Gereksinimleri
- Mikroservis mimarisine geçiş için modüler tasarım
- Docker konteynerizasyonu ile yatay ölçeklendirme desteği
- MongoDB'nin replica set yapılandırması ile ölçeklenebilirlik
- MongoDB Atlas kullanımına uygun yapı

### 6.4 Test Gereksinimleri
- Backend için birim ve entegrasyon testleri (en az %70 kod kapsaması)
- MongoDB test veritabanı kullanımı (in-memory MongoDB ya da test container)
- Frontend için komponent testleri
- E2E testleri için test senaryoları

### 6.5 Deployment ve DevOps Gereksinimleri
- Docker ve Docker Compose yapılandırması
- CI/CD pipeline için yapılandırma
- Environment değişkenleri ile konfigürasyon
- Loglama ve izleme mekanizmaları

## 7. Teslimat Gereksinimleri

### 7.1 Kod Kalitesi ve Standartları
- Tutarlı kod stiline uygunluk (ESLint, Prettier)
- Modüler ve yeniden kullanılabilir kod yapısı
- İyi dokümante edilmiş fonksiyonlar ve modüller
- SOLID prensiplerine uygunluk
- MongoDB kullanımı için Mongoose şemalarının doğru tasarımı

### 7.2 Dokümantasyon
- README.md ile proje hakkında genel bilgiler
- API dokümantasyonu (Swagger/OpenAPI)
- Kurulum ve çalıştırma talimatları
- MongoDB şema açıklaması ve indeks stratejisi

### 7.3 Versiyonlama ve Kod Paylaşımı
- Git kullanarak kod paylaşımı
- GitHub repository oluşturma
- Anlamlı commit mesajları
- Branching stratejisi (Git Flow veya benzeri)

## 8. Proje Timeline ve Önceliklendirme

### 8.1 Faz 1: Temel Altyapı (1. Hafta)
- Proje yapısının oluşturulması
- Docker ve MongoDB konfigürasyonu
- Mongoose şemalarının oluşturulması
- Kimlik doğrulama mekanizmasının kurulması

### 8.2 Faz 2: Yönetim Modülleri (2. Hafta)
- Öğrenci yönetimi modülü
- Ders yönetimi modülü
- Yetkilendirme sistemi

### 8.3 Faz 3: Kayıt Sistemi ve Öğrenci Deneyimi (3. Hafta)
- Öğrenci-ders eşleştirme sistemi
- Öğrenci profili ve ders kayıt modülü
- Frontend iyileştirmeleri

### 8.4 Faz 4: Test, Optimizasyon ve Dokümantasyon (4. Hafta)
- Backend ve frontend testleri
- MongoDB indeksleme ve performans optimizasyonu
- API ve kod dokümantasyonu
- Proje README ve kullanım talimatları

## 9. Değerlendirme Kriterleri

### 9.1 Fonksiyonel Gereksinimler
- Tüm kullanıcı hikayelerinin tamamlanması
- Kimlik doğrulama ve yetkilendirme sisteminin doğru çalışması
- Veri doğrulama kurallarının uygulanması
- MongoDB'nin etkin kullanımı

### 9.2 Teknik Gereksinimler
- Docker ile konteynerizasyon
- Frontend state management çözümü
- API güvenliği ve hata yönetimi
- MongoDB optimizasyonları
- Test kapsamı ve kalitesi

### 9.3 Kod Kalitesi
- Kod okunabilirliği ve bakım yapılabilirliği
- Mimari tasarımın uygunluğu
- Modülerlik ve yeniden kullanılabilirlik
- Best practice'lere uygunluk
- MongoDB kullanım pratikleri

### 9.4 Dokümantasyon
- Proje dokümantasyonunun eksiksiz olması
- API dokümantasyonunun yeterliliği
- Kurulum talimatlarının açıklığı
- MongoDB şema ve yapılandırma dokümantasyonu

## 10. Gelecek Geliştirmeler İçin Öneriler

- Öğretmen rolü ve öğretmen-ders ilişkisi
- Ders programı ve takvim entegrasyonu
- Bildirim sistemi
- Dosya yükleme ve paylaşma özellikleri
- MongoDB change streams ile real-time güncellemeler
- Mobil uygulama geliştirme
- Raporlama ve analitik özellikleri
- Çoklu dil desteği