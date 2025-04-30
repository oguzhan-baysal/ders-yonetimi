# Öğrenci ve Ders Yönetimi Sistemi - Backend

Bu proje, öğrenci ve ders yönetimi için RESTful API sağlayan bir backend uygulamasıdır.

## Teknolojiler

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Express Validator

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun ve aşağıdaki değişkenleri tanımlayın:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

3. Uygulamayı başlatın:
```bash
# Geliştirme modu
npm run dev

# Prodüksiyon modu
npm start
```

## API Endpoints

### Kimlik Doğrulama
- POST /api/auth/register - Yeni kullanıcı kaydı
- POST /api/auth/login - Kullanıcı girişi
- GET /api/auth/me - Mevcut kullanıcı bilgilerini getir

### Öğrenci İşlemleri
- GET /api/students - Tüm öğrencileri listele
- GET /api/students/:id - Öğrenci detayını getir
- PUT /api/students/:id - Öğrenci bilgilerini güncelle
- DELETE /api/students/:id - Öğrenci sil
- GET /api/students/:id/courses - Öğrencinin kayıtlı olduğu dersleri getir

### Ders İşlemleri
- GET /api/courses - Tüm dersleri listele
- GET /api/courses/:id - Ders detayını getir
- POST /api/courses - Yeni ders oluştur
- PUT /api/courses/:id - Ders bilgilerini güncelle
- DELETE /api/courses/:id - Ders sil
- GET /api/courses/:id/students - Derse kayıtlı öğrencileri getir

## Lisans

MIT 