using Microsoft.EntityFrameworkCore;
using StokTakip.API.Data;
using StokTakip.API.DTOs;
using StokTakip.API.Models;

namespace StokTakip.API.Services;

public class SupplierService(AppDbContext db)
{
    public async Task<List<SupplierDto>> GetAllAsync()
    {
        return await db.Suppliers
            .Select(s => new SupplierDto(s.Id, s.Name, s.ContactPerson, s.Email, s.Phone))
            .ToListAsync();
    }

    public async Task<SupplierDto?> GetByIdAsync(int id)
    {
        var s = await db.Suppliers.FindAsync(id);
        return s is null ? null : new SupplierDto(s.Id, s.Name, s.ContactPerson, s.Email, s.Phone);
    }

    public async Task<SupplierDto> CreateAsync(SupplierCreateDto dto)
    {
        var supplier = new Supplier
        {
            Name = dto.Name,
            ContactPerson = dto.ContactPerson,
            Email = dto.Email,
            Phone = dto.Phone
        };
        db.Suppliers.Add(supplier);
        await db.SaveChangesAsync();
        return new SupplierDto(supplier.Id, supplier.Name, supplier.ContactPerson, supplier.Email, supplier.Phone);
    }

    public async Task<SupplierDto?> UpdateAsync(int id, SupplierUpdateDto dto)
    {
        var supplier = await db.Suppliers.FindAsync(id);
        if (supplier is null) return null;

        supplier.Name = dto.Name;
        supplier.ContactPerson = dto.ContactPerson;
        supplier.Email = dto.Email;
        supplier.Phone = dto.Phone;
        await db.SaveChangesAsync();
        return new SupplierDto(supplier.Id, supplier.Name, supplier.ContactPerson, supplier.Email, supplier.Phone);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var supplier = await db.Suppliers.FindAsync(id);
        if (supplier is null) return false;

        db.Suppliers.Remove(supplier);
        await db.SaveChangesAsync();
        return true;
    }
}
