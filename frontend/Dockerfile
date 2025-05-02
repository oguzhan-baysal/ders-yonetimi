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

# Next.js uygulamasını build etme
RUN npm run build

# Production aşaması
FROM node:18-alpine AS runner

# Güvenlik için non-root kullanıcı oluşturma
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Sadece gerekli dosyaları kopyalama
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Kullanıcı değiştirme
USER appuser

# Health check ekleme
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# 3000 portunu dışarıya açma
EXPOSE 3000

# Uygulamayı başlatma
ENV NODE_ENV=production
CMD ["node", "server.js"] 