# 🧪 Test Dokümantasyonu

Bu dokümantasyon, projenin test stratejisini ve test süreçlerini detaylı olarak açıklar.

## Backend Testleri

### Test Komutları

```bash
# Tüm testleri çalıştır
cd backend
npm test

# Test coverage raporu oluştur
npm run test:coverage

# Testleri watch modunda çalıştır
npm run test:watch
```

### Test Teknolojileri
- **Jest**: Test framework'ü
- **Supertest**: HTTP assertion kütüphanesi
- **MongoDB Memory Server**: Test ortamı için bellek-içi MongoDB
- **TypeScript**: Tip güvenliği

### Test Kapsamı

#### Unit Testler
- Servis katmanı testleri
- Yardımcı fonksiyon testleri
- Model validasyon testleri
- Middleware testleri

#### Entegrasyon Testleri
- Auth API testleri
  - Kullanıcı kaydı
  - Giriş/çıkış işlemleri
  - Token validasyonu
- Öğrenci API testleri
  - CRUD işlemleri
  - Validasyon kontrolleri
- Ders API testleri
  - CRUD işlemleri
  - Yetkilendirme kontrolleri
- Kayıt API testleri
  - Enrollment işlemleri
  - Kapasite kontrolleri

### Test Ortamı

- `.env.test` konfigürasyonu
- MongoDB Memory Server kullanımı
- Test-specific middleware ve helper'lar
- Mock ve stub kullanımı

## Frontend Testleri

### Test Komutları

```bash
# Tüm testleri çalıştır
cd frontend
npm test

# Test coverage raporu oluştur
npm run test:coverage

# Testleri watch modunda çalıştır
npm run test:watch
```

### Test Teknolojileri
- **Jest**: Test framework'ü
- **React Testing Library**: React komponent testleri
- **MSW (Mock Service Worker)**: API mock'lama
- **Jest DOM**: DOM assertion'ları

### Test Kapsamı

#### Komponent Testleri
- UI komponentleri
  - Form elemanları
  - Tablolar
  - Modal'lar
  - Navigasyon
- Form validasyonları
- State yönetimi
- Event handler'lar

#### Hook Testleri
- Custom hook'lar
- API hook'ları
- State hook'ları
- Effect hook'ları

#### Util Testleri
- Helper fonksiyonlar
- Validasyon fonksiyonları
- Format fonksiyonları
- API util'leri

## E2E Testleri (Cypress)

### Test Komutları

```bash
# Cypress test runner'ı aç
cd frontend
npm run cypress:open

# Headless modda testleri çalıştır
npm run cypress:run
```

### Test Kapsamı
- Kullanıcı kaydı ve girişi
- Öğrenci işlemleri
- Ders işlemleri
- Kayıt işlemleri
- Form validasyonları
- Error handling
- Responsive tasarım testleri

## Test Best Practices

### Kod Kalitesi
- Her PR için test coverage kontrolü
- Kritik iş mantığı için kapsamlı testler
- DRY prensibine uygun test yazımı
- Test fixture'larının etkin kullanımı

### Test İzolasyonu
- Her test kendi verisini oluşturmalı
- Test verileri test sonunda temizlenmeli
- Mock ve stub kullanımı
- Test ortamı izolasyonu

### Test Organizasyonu
- Anlamlı test isimlendirmesi
- Test gruplarının doğru organizasyonu
- Test dokümantasyonu
- Setup ve teardown fonksiyonları

## CI/CD Test Pipeline

### GitHub Actions
- Her PR'da otomatik test çalıştırma
- Test coverage raporu
- Lint ve format kontrolü
- Security scan

### Quality Gates
- Minimum test coverage gereklilikleri
- Sonar analizi
- Lint hataları kontrolü
- TypeScript tip kontrolü 