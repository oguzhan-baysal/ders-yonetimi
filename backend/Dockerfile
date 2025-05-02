# Build aşaması
FROM node:18-alpine AS builder

# Çalışma dizinini belirleme
WORKDIR /app

# Package.json ve package-lock.json dosyalarını kopyalama
COPY package*.json ./

# Bağımlılıkları yükleme
RUN npm ci

# Tüm kaynak kodları kopyalama
COPY . .

# TypeScript kodunu JavaScript'e derleme
RUN npm run build

# Production aşaması
FROM node:18-alpine AS runner

# Güvenlik için non-root kullanıcı oluşturma
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Sadece gerekli dosyaları kopyalama
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Kullanıcı değiştirme
USER appuser

# Health check ekleme
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# 5000 portunu dışarıya açma
EXPOSE 5000

# Uygulamayı başlatma
CMD ["npm", "start"] 