namespace StokTakip.API.DTOs;

public record CategoryDto(int Id, string Name, string? Description);

public record CategoryCreateDto(string Name, string? Description);

public record CategoryUpdateDto(string Name, string? Description);
