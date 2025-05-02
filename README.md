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

### DevOps & Deployment
- Docker
- Docker Compose
- MongoDB Atlas

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

2. Docker Compose ile uygulamayı başlatın
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

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://ozzyby:aPVt3KfTdvGxIDEK@cluster0.nhj97ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ders_yonetim_sistemi_gizli_anahtar_2024
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Docker Compose Yapılandırması

Proje, Docker Compose ile aşağıdaki servisleri içerir:

- **Frontend Container**:
  - Next.js uygulaması
  - Port: 3000
  - Hot-reload destekli development modu
  - Volume mapping ile anlık kod değişikliği

- **Backend Container**:
  - Express.js API
  - Port: 5000
  - TypeScript derleme ve çalıştırma
  - Volume mapping ile anlık kod değişikliği
  - Health check endpoint'i ile servis durumu kontrolü

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
│   ├── Dockerfile     # Frontend production Docker yapılandırması
│   ├── Dockerfile.dev # Frontend development Docker yapılandırması
│   └── README.md      # Frontend dokümantasyonu
│
├── backend/           # Express.js backend API
│   ├── src/          # Kaynak kodları
│   ├── tests/        # Test dosyaları
│   ├── Dockerfile    # Backend production Docker yapılandırması
│   ├── Dockerfile.dev # Backend development Docker yapılandırması
│   └── README.md     # Backend dokümantasyonu
│
├── docker-compose.yml # Docker Compose yapılandırması
├── .github/          # GitHub workflow ve şablonları
├── docs/            # Ek dokümantasyon
└── README.md        # Ana README dosyası
```

## 🚀 Geliştirme

### Docker ile Geliştirme
```bash
# Servisleri başlat
docker-compose up

# Servisleri yeniden build et ve başlat
docker-compose up --build

# Servisleri durdur
docker-compose down

# Container loglarını görüntüle
docker-compose logs -f
```

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

- Oğuzhan Baysal - [@oguzhan-baysal](https://github.com/oguzhan-baysal)

## 📞 İletişim

Sorularınız için: [oguzhanbaysal@outlook.com]