using Microsoft.EntityFrameworkCore;
using StokTakip.API.Data;
using StokTakip.API.DTOs;
using StokTakip.API.Models;

namespace StokTakip.API.Services;

public class CategoryService(AppDbContext db)
{
    public async Task<List<CategoryDto>> GetAllAsync()
    {
        return await db.Categories
            .Select(c => new CategoryDto(c.Id, c.Name, c.Description))
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var c = await db.Categories.FindAsync(id);
        return c is null ? null : new CategoryDto(c.Id, c.Name, c.Description);
    }

    public async Task<CategoryDto> CreateAsync(CategoryCreateDto dto)
    {
        var category = new Category { Name = dto.Name, Description = dto.Description };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return new CategoryDto(category.Id, category.Name, category.Description);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, CategoryUpdateDto dto)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return null;

        category.Name = dto.Name;
        category.Description = dto.Description;
        await db.SaveChangesAsync();
        return new CategoryDto(category.Id, category.Name, category.Description);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return false;

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return true;
    }
}
