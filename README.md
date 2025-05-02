# 📚 Öğrenci ve Ders Yönetimi Sistemi

Modern web teknolojileri kullanılarak geliştirilmiş, öğrenci ve ders yönetimini kolaylaştıran kapsamlı bir yönetim sistemi.

> **Not**: Bu proje, bir işe alım değerlendirmesi için geliştirilmiştir. Kurulum ve test sürecini kolaylaştırmak amacıyla tüm konfigürasyon değerleri (JWT_SECRET, MongoDB URI vb.) README dosyasında paylaşılmıştır. Gerçek bir production ortamında bu değerler kesinlikle gizli tutulmalı ve güvenli bir şekilde yönetilmelidir.

## 🎯 Proje Amacı

Bu proje, eğitim kurumlarının öğrenci ve ders yönetimini dijital ortamda etkili bir şekilde yönetmelerini sağlamak amacıyla geliştirilmiştir. Sistem, öğrenci kayıtları, ders programları ve kayıt işlemlerini modern bir arayüz ile yönetme imkanı sunar.

## ✨ Özellikler

### 👥 Kullanıcı Yönetimi
- Rol tabanlı yetkilendirme (Admin/Öğrenci)
- Güvenli kimlik doğrulama
- JWT tabanlı oturum yönetimi

### 👨‍🎓 Öğrenci İşlemleri
- Öğrenci kayıt
- Öğrenci bilgi güncelleme
- Öğrenci listeleme ve arama
- Öğrenci silme

### 📚 Ders Yönetimi
- Ders ekleme ve düzenleme
- Ders listeleme ve filtreleme
- Kontenjan takibi
- Ders silme

### ✍️ Kayıt (Enrollment) İşlemleri
- Ders kaydı oluşturma
- Kayıt listeleme
- Kayıt iptal

## 🛠 Teknoloji Stack

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- Formik + Yup (Form yönetimi ve validasyon)
- React Query (Veri yönetimi)
- Shadcn/ui (UI komponentleri)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Veritabanı)
- JWT (Kimlik doğrulama)
- Mongoose (ODM)

## 📦 Kurulum

### Ön Gereksinimler
- Node.js (v18 veya üzeri)
- MongoDB (v6 veya üzeri)
- npm veya yarn

### Kurulum Adımları

1. Projeyi klonlayın
```bash
git clone <repo-url>
cd ders-yonetimi
```

2. Frontend kurulumu
```bash
cd frontend
npm install
npm run dev
```

3. Backend kurulumu
```bash
cd backend
npm install
npm run dev
```

## 🔧 Ortam Değişkenleri

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ders-yonetimi
JWT_SECRET=ders_yonetim_sistemi_gizli_anahtar_2024  # Not: Bu değer sadece development ortamı içindir
NODE_ENV=development
```

> **Güvenlik Notu**: Yukarıdaki konfigürasyon değerleri sadece local development ve test amaçlıdır. Gerçek bir uygulamada:
> - JWT_SECRET değeri benzersiz ve tahmin edilemez olmalıdır
> - Hassas bilgiler .env dosyasında saklanmalı ve bu dosya .gitignore'a eklenmelidir
> - Production ortamında environment variable'lar güvenli bir şekilde yönetilmelidir
> - MongoDB bağlantı URI'si güvenli ve şifreli olmalıdır

## 📁 Proje Yapısı

```
ders-yonetimi/
├── frontend/           # Next.js frontend uygulaması
│   ├── src/           # Kaynak kodları
│   ├── public/        # Statik dosyalar
│   └── README.md      # Frontend dokümantasyonu
│
├── backend/           # Express.js backend API
│   ├── src/          # Kaynak kodları
│   ├── tests/        # Test dosyaları
│   └── README.md     # Backend dokümantasyonu
│
├── .github/          # GitHub workflow ve şablonları
├── docs/            # Ek dokümantasyon
└── README.md        # Ana README dosyası
```

## 🚀 Geliştirme

### Frontend Geliştirme
```bash
cd frontend
npm run dev     # Geliştirme sunucusunu başlat
npm run build   # Production build
npm run lint    # Kod kalitesi kontrolü
```

### Backend Geliştirme
```bash
cd backend
npm run dev     # Geliştirme sunucusunu başlat
npm run build   # TypeScript derleme
npm run test    # Testleri çalıştır
```

## 🧪 Test

- Frontend: Jest ve React Testing Library
- Backend: Jest ve Supertest
- E2E: Cypress

## 📝 API Dokümantasyonu

API dokümantasyonuna aşağıdaki URL'den erişebilirsiniz:
```
http://localhost:5000/api-docs
```

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Rol bazlı yetkilendirme
- Input validasyonu
- XSS ve CSRF koruması
- Rate limiting

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 👥 Geliştiriciler

- Oğuzhan Güç - [@oguzhan-guc](https://github.com/oguzhan-guc)

## 📞 İletişim

Sorularınız için: [oguzhan.guc@example.com](mailto:oguzhan.guc@example.com) 