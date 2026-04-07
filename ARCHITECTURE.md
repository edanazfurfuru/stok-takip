# StokTakip — Mimari Dokümantasyon

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Backend | ASP.NET Core 9 Web API |
| ORM | Entity Framework Core 9 |
| Veritabanı | SQLite |
| Frontend | React 19 + TypeScript + Vite |
| Stil | Tailwind CSS v4 |
| State / Data Fetching | TanStack Query (React Query) |
| API Docs | Swagger / OpenAPI |

---

## Proje Yapısı

```
stok-takip/
├── backend/
│   └── StokTakip.API/
│       ├── Controllers/        ← API endpoint'leri (Phase 3)
│       ├── Data/
│       │   └── AppDbContext.cs ← EF Core DbContext (Phase 2)
│       ├── DTOs/               ← Request/Response modelleri (Phase 3)
│       ├── Models/             ← Domain entity'leri (Phase 2)
│       ├── Services/           ← İş mantığı (Phase 3-4)
│       ├── Migrations/         ← EF Core migrations (Phase 2)
│       └── Program.cs          ← Uygulama başlangıcı
└── frontend/
    └── src/
        ├── components/         ← Yeniden kullanılabilir UI bileşenleri (Phase 5)
        ├── pages/              ← Sayfa bileşenleri (Phase 5)
        ├── services/           ← API çağrıları (Phase 5)
        └── types/              ← TypeScript tip tanımları (Phase 5)
```

---

## Faz Planı

### Phase 1 — Proje Temeli ✅
- ASP.NET Core 9 Web API projesi
- React + Vite + TypeScript frontend
- EF Core + SQLite bağlantısı (Program.cs)
- CORS yapılandırması
- Swagger entegrasyonu
- Git init + GitHub push

### Phase 2 — Veri Katmanı
**Hedef:** Domain modelleri ve veritabanı şeması

Domain modelleri (`Models/`):
- `Product` — Id, Name, SKU, Description, Price, StockQuantity, MinStockLevel, CategoryId, SupplierId
- `Category` — Id, Name, Description
- `Supplier` — Id, Name, ContactPerson, Email, Phone

Yapılacaklar:
- [ ] `Models/Product.cs`, `Category.cs`, `Supplier.cs` oluştur
- [ ] `AppDbContext`'e DbSet'leri ekle
- [ ] İlk migration oluştur (`InitialCreate`)
- [ ] Seed data ekle (test kategorileri, ürünler)

### Phase 3 — CRUD API Endpoint'leri
**Hedef:** Tüm entity'ler için REST API

Controller'lar (`Controllers/`):
- `ProductsController` — GET, POST, PUT, DELETE + sayfalama
- `CategoriesController` — GET, POST, PUT, DELETE
- `SuppliersController` — GET, POST, PUT, DELETE

DTO'lar (`DTOs/`):
- `ProductCreateDto`, `ProductUpdateDto`, `ProductResponseDto`
- `CategoryDto`, `SupplierDto`

Yapılacaklar:
- [ ] DTO sınıfları
- [ ] Service katmanı (iş mantığı controller'dan ayrılır)
- [ ] FluentValidation veya DataAnnotations ile validasyon
- [ ] Global exception handler middleware
- [ ] Tutarlı API response formatı

### Phase 4 — Stok Hareketleri
**Hedef:** Stok giriş/çıkış takibi ve uyarılar

Yeni model:
- `StockMovement` — Id, ProductId, Type (In/Out), Quantity, Reason, Date, UserId

Özellikler:
- [ ] `StockMovement` modeli ve migration
- [ ] `StockMovementsController`
- [ ] Stok seviyesi otomatik güncelleme (trigger yerine service)
- [ ] Düşük stok uyarısı endpoint'i (`/api/products/low-stock`)
- [ ] Stok hareketi geçmişi

### Phase 5 — React Frontend
**Hedef:** Tam işlevsel kullanıcı arayüzü

Sayfalar (`pages/`):
- `ProductsPage` — liste, arama, filtreleme
- `ProductDetailPage` — detay, düzenle, stok hareketi ekle
- `CategoriesPage`
- `SuppliersPage`

Bileşenler (`components/`):
- `DataTable` — sıralama, sayfalama
- `ProductForm` — oluştur/düzenle
- `StockBadge` — stok durumu göstergesi
- `LowStockAlert` — uyarı bileşeni

Altyapı:
- [ ] `services/api.ts` — axios/fetch ile API istemcisi
- [ ] TanStack Query hook'ları
- [ ] React Router v6 kurulumu
- [ ] Tailwind CSS bileşen stilleri

### Phase 6 — Dashboard ve Deployment
**Hedef:** Analitik ve yayına alma

Dashboard:
- [ ] Toplam ürün, kategori, tedarikçi sayıları
- [ ] Düşük stok uyarıları özeti
- [ ] Stok hareketleri grafiği (Recharts)
- [ ] En düşük stoktaki ürünler listesi

Ek özellikler:
- [ ] Ürün arama (debounce)
- [ ] Kategori/tedarikçi filtresi
- [ ] CSV export
- [ ] Deployment config (Docker / publish profili)

---

## API Endpoint'leri (Planlanan)

```
GET    /api/products              ← Liste (sayfalama, filtre)
GET    /api/products/{id}         ← Detay
POST   /api/products              ← Yeni ürün
PUT    /api/products/{id}         ← Güncelle
DELETE /api/products/{id}         ← Sil
GET    /api/products/low-stock    ← Düşük stok listesi

GET    /api/categories
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}

GET    /api/suppliers
POST   /api/suppliers
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}

GET    /api/stock-movements?productId={id}
POST   /api/stock-movements       ← Stok giriş/çıkış
```

---

## Önemli Kararlar

| Konu | Karar | Neden |
|------|-------|-------|
| Veritabanı | SQLite | Geliştirme kolaylığı, dosya tabanlı |
| ORM | EF Core | .NET ekosistemi standardı |
| Migration | Code First | Model değişiklikleri kodda yönetilir |
| CORS | localhost:3000 | React dev server portu |
| JSON | IgnoreCycles | Navigation property döngülerini önler |
