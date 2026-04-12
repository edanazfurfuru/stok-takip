using Microsoft.EntityFrameworkCore;
using StokTakip.API.Data;
using StokTakip.API.DTOs;
using StokTakip.API.Models;

namespace StokTakip.API.Services;

public class StockMovementService(AppDbContext db)
{
    private static StockMovementDto ToDto(StockMovement m) => new(
        m.Id, m.ProductId, m.Product.Name, m.Product.SKU,
        m.Type, m.Quantity, m.Reason, m.Date
    );

    public async Task<List<StockMovementDto>> GetByProductAsync(int productId)
    {
        return await db.StockMovements
            .Include(m => m.Product)
            .Where(m => m.ProductId == productId)
            .OrderByDescending(m => m.Date)
            .Select(m => ToDto(m))
            .ToListAsync();
    }

    public async Task<StockMovementDto> CreateAsync(StockMovementCreateDto dto)
    {
        var product = await db.Products.FindAsync(dto.ProductId)
            ?? throw new KeyNotFoundException($"Ürün bulunamadı: {dto.ProductId}");

        if (dto.Type == MovementType.Out && product.StockQuantity < dto.Quantity)
            throw new InvalidOperationException($"Yetersiz stok. Mevcut: {product.StockQuantity}, İstenen: {dto.Quantity}");

        product.StockQuantity += dto.Type == MovementType.In ? dto.Quantity : -dto.Quantity;

        var movement = new StockMovement
        {
            ProductId = dto.ProductId,
            Type = dto.Type,
            Quantity = dto.Quantity,
            Reason = dto.Reason,
            Date = DateTime.UtcNow
        };

        db.StockMovements.Add(movement);
        await db.SaveChangesAsync();

        await db.Entry(movement).Reference(m => m.Product).LoadAsync();
        return ToDto(movement);
    }
}
