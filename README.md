# 📚 Öğrenci ve Ders Yönetimi Sistemi

Modern web teknolojileri kullanılarak geliştirilmiş, öğrenci ve ders yönetimini kolaylaştıran kapsamlı bir yönetim sistemi.

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

### DevOps & Tools
- Docker & Docker Compose
- Git & GitHub Actions
- ESLint & Prettier
- Jest & React Testing Library
- Swagger/OpenAPI

## 📦 Kurulum

### Ön Gereksinimler
- Docker ve Docker Compose
- Node.js (v18 veya üzeri) - Lokal geliştirme için
- MongoDB (v6 veya üzeri) - Lokal geliştirme için
- npm veya yarn - Lokal geliştirme için

### Docker ile Kurulum (Önerilen)

1. Projeyi klonlayın
```bash
git clone <repo-url>
cd ders-yonetimi
```

2. Ortam değişkenlerini ayarlayın
```bash
# Frontend için
cp frontend/.env.example frontend/.env.local

# Backend için
cp backend/.env.example backend/.env
```

3. Docker Compose ile uygulamayı başlatın
```bash
docker-compose up --build
```

Uygulama aşağıdaki adreslerde çalışacaktır:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

### Manuel Kurulum (Lokal Geliştirme İçin)

1. Frontend kurulumu
```bash
cd frontend
npm install
npm run dev
```

2. Backend kurulumu
```bash
cd backend
npm install
npm run dev
```

## 🔧 Ortam Değişkenleri

Her servis için `.env.example` dosyaları bulunmaktadır. Bu dosyaları kopyalayıp kendi değerlerinizle güncelleyin:

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
# Örnek konfigürasyon - Kendi değerlerinizle güncelleyin
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Test

[Test dokümantasyonu için tıklayın](docs/TESTING.md)

## 📝 API Dokümantasyonu

[API dokümantasyonu için tıklayın](docs/API.md)

## 🔒 Güvenlik

[Güvenlik dokümantasyonu için tıklayın](docs/SECURITY.md)

## 📁 Proje Yapısı

```
ders-yonetimi/
├── frontend/           # Next.js frontend uygulaması
│   ├── src/           # Kaynak kodları
│   ├── public/        # Statik dosyalar
│   ├── tests/         # Test dosyaları
│   └── README.md      # Frontend dokümantasyonu
│
├── backend/           # Express.js backend API
│   ├── src/          # Kaynak kodları
│   ├── tests/        # Test dosyaları
│   └── README.md     # Backend dokümantasyonu
│
├── docs/             # Detaylı dokümantasyon
│   ├── API.md        # API dokümantasyonu
│   ├── SECURITY.md   # Güvenlik dokümantasyonu
│   └── TESTING.md    # Test dokümantasyonu
│
├── docker-compose.yml # Docker Compose yapılandırması
└── README.md         # Ana README dosyası
```

## 👥 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 👥 Geliştiriciler

- Oğuzhan Baysal - [@oguzhan-baysal](https://github.com/oguzhan-baysal)

## 📞 İletişim

Sorularınız için: [oguzhanbaysal@outlook.com]