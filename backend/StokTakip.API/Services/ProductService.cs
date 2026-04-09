using Microsoft.EntityFrameworkCore;
using StokTakip.API.Data;
using StokTakip.API.DTOs;
using StokTakip.API.Models;

namespace StokTakip.API.Services;

public class ProductService(AppDbContext db)
{
    private static ProductDto ToDto(Product p) => new(
        p.Id, p.Name, p.SKU, p.Description, p.Price,
        p.StockQuantity, p.MinStockLevel,
        p.StockQuantity <= p.MinStockLevel,
        p.CategoryId, p.Category.Name,
        p.SupplierId, p.Supplier.Name
    );

    public async Task<PagedResult<ProductDto>> GetAllAsync(int page, int pageSize, string? search, int? categoryId)
    {
        var query = db.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) || p.SKU.Contains(search));

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => ToDto(p))
            .ToListAsync();

        return new PagedResult<ProductDto>(items, total, page, pageSize);
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var p = await db.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .FirstOrDefaultAsync(p => p.Id == id);
        return p is null ? null : ToDto(p);
    }

    public async Task<List<ProductDto>> GetLowStockAsync()
    {
        return await db.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Where(p => p.StockQuantity <= p.MinStockLevel)
            .Select(p => ToDto(p))
            .ToListAsync();
    }

    public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            SKU = dto.SKU,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            MinStockLevel = dto.MinStockLevel,
            CategoryId = dto.CategoryId,
            SupplierId = dto.SupplierId
        };
        db.Products.Add(product);
        await db.SaveChangesAsync();

        await db.Entry(product).Reference(p => p.Category).LoadAsync();
        await db.Entry(product).Reference(p => p.Supplier).LoadAsync();
        return ToDto(product);
    }

    public async Task<ProductDto?> UpdateAsync(int id, ProductUpdateDto dto)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return null;

        product.Name = dto.Name;
        product.SKU = dto.SKU;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.MinStockLevel = dto.MinStockLevel;
        product.CategoryId = dto.CategoryId;
        product.SupplierId = dto.SupplierId;
        await db.SaveChangesAsync();

        await db.Entry(product).Reference(p => p.Category).LoadAsync();
        await db.Entry(product).Reference(p => p.Supplier).LoadAsync();
        return ToDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return false;

        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return true;
    }
}
