# 🚀 Öğrenci ve Ders Yönetimi Sistemi - Backend

Bu proje, öğrenci ve ders yönetimi için RESTful API sağlayan bir backend uygulamasıdır.

## 🛠 Teknolojiler

- **Runtime**: Node.js
- **Framework**: Express.js
- **Veritabanı**: MongoDB with Mongoose
- **Kimlik Doğrulama**: JWT (JSON Web Tokens)
- **Validasyon**: Express Validator
- **API Dokümantasyonu**: Swagger/OpenAPI
- **Test**: Jest & Supertest
- **Dil**: TypeScript

## 📦 Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri güncelleyin:
```bash
cp .env.example .env
```

3. Uygulamayı başlatın:
```bash
# Geliştirme modu (TypeScript watch mode)
npm run dev

# Production build
npm run build

# Production modu
npm start
```

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm test

# Test coverage raporu
npm run test:coverage

# Testleri watch modunda çalıştır
npm run test:watch
```

## 📝 API Dokümantasyonu

Swagger UI'a aşağıdaki URL'den erişebilirsiniz:
```
http://localhost:5000/api-docs
```

## 🔑 API Endpoints

### 👤 Kimlik Doğrulama
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgilerini getir
- `POST /api/auth/logout` - Çıkış yap

### 👨‍🎓 Öğrenci İşlemleri
- `GET /api/students` - Tüm öğrencileri listele
- `GET /api/students/:id` - Öğrenci detayını getir
- `PUT /api/students/:id` - Öğrenci bilgilerini güncelle
- `DELETE /api/students/:id` - Öğrenci sil
- `GET /api/students/:id/courses` - Öğrencinin kayıtlı olduğu dersleri getir

### 📚 Ders İşlemleri
- `GET /api/courses` - Tüm dersleri listele
- `GET /api/courses/:id` - Ders detayını getir
- `POST /api/courses` - Yeni ders oluştur (Admin)
- `PUT /api/courses/:id` - Ders bilgilerini güncelle (Admin)
- `DELETE /api/courses/:id` - Ders sil (Admin)
- `GET /api/courses/:id/students` - Derse kayıtlı öğrencileri getir

### ✍️ Kayıt (Enrollment) İşlemleri
- `POST /api/enrollments` - Derse kayıt ol
- `DELETE /api/enrollments/:id` - Ders kaydını sil
- `GET /api/enrollments` - Tüm kayıtları listele (Admin)

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Request rate limiting
- Input validasyonu
- MongoDB injection koruması
- CORS yapılandırması
- Security headers

## 🚥 Error Handling

Tüm API endpoint'leri standart bir hata formatı kullanır:

```json
{
  "message": "Hata açıklaması",
  "code": "ERROR_CODE",
  "details": {}
}
```

## 🔍 Logging

- Morgan middleware ile HTTP request logging
- Winston ile uygulama logging
- Error stack trace (development ortamında)

## 📈 Monitoring

- Health check endpoint'i (`/api/health`)
- MongoDB bağlantı durumu
- Temel metrikler

## 👥 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız. 