namespace StokTakip.API.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string SKU,
    string? Description,
    decimal Price,
    int StockQuantity,
    int MinStockLevel,
    bool IsLowStock,
    int CategoryId,
    string CategoryName,
    int SupplierId,
    string SupplierName
);

public record ProductCreateDto(
    string Name,
    string SKU,
    string? Description,
    decimal Price,
    int StockQuantity,
    int MinStockLevel,
    int CategoryId,
    int SupplierId
);

public record ProductUpdateDto(
    string Name,
    string SKU,
    string? Description,
    decimal Price,
    int MinStockLevel,
    int CategoryId,
    int SupplierId
);

public record PagedResult<T>(IEnumerable<T> Items, int TotalCount, int Page, int PageSize);
