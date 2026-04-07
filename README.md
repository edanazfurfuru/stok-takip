# StokTakip — Profesyonel Stok Takip Uygulaması

ASP.NET Core 9 + React + TypeScript + SQLite ile geliştirilmiş tam kapsamlı envanter yönetim sistemi.

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Backend | ASP.NET Core 9 Web API |
| ORM | Entity Framework Core 9 + SQLite |
| Frontend | React 19 + TypeScript + Vite |
| Stil | Tailwind CSS v4 |
| State | TanStack Query (React Query) |
| API Docs | Swagger / OpenAPI |

## Proje Yapısı

```
stok-takip/
├── backend/
│   └── StokTakip.API/     ← ASP.NET Core Web API
└── frontend/              ← React + Vite
```

## Kurulum

### Backend
```bash
cd backend/StokTakip.API
dotnet restore
dotnet run
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

## Özellikler

- Ürün yönetimi (CRUD)
- Kategori & tedarikçi yönetimi
- Stok giriş/çıkış hareketleri
- Düşük stok uyarıları
- Dashboard & analitik
- Arama, filtreleme, sayfalama
