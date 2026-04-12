using StokTakip.API.Models;

namespace StokTakip.API.DTOs;

public record StockMovementDto(
    int Id,
    int ProductId,
    string ProductName,
    string ProductSKU,
    MovementType Type,
    int Quantity,
    string? Reason,
    DateTime Date
);

public record StockMovementCreateDto(
    int ProductId,
    MovementType Type,
    int Quantity,
    string? Reason
);
