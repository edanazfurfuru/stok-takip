namespace StokTakip.API.DTOs;

public record SupplierDto(int Id, string Name, string? ContactPerson, string? Email, string? Phone);

public record SupplierCreateDto(string Name, string? ContactPerson, string? Email, string? Phone);

public record SupplierUpdateDto(string Name, string? ContactPerson, string? Email, string? Phone);
