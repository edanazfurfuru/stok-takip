using Microsoft.EntityFrameworkCore;
using StokTakip.API.Models;

namespace StokTakip.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

        // Seed data
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Elektronik", Description = "Elektronik ürünler" },
            new Category { Id = 2, Name = "Giyim", Description = "Giyim ürünleri" },
            new Category { Id = 3, Name = "Gıda", Description = "Gıda ürünleri" }
        );

        modelBuilder.Entity<Supplier>().HasData(
            new Supplier { Id = 1, Name = "TechSupply A.Ş.", ContactPerson = "Ali Yılmaz", Email = "ali@techsupply.com", Phone = "0212 111 22 33" },
            new Supplier { Id = 2, Name = "ModaGroup Ltd.", ContactPerson = "Ayşe Kaya", Email = "ayse@modagroup.com", Phone = "0212 444 55 66" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Laptop", SKU = "ELK-001", Price = 25000, StockQuantity = 10, MinStockLevel = 3, CategoryId = 1, SupplierId = 1 },
            new Product { Id = 2, Name = "Kulaklık", SKU = "ELK-002", Price = 1500, StockQuantity = 2, MinStockLevel = 5, CategoryId = 1, SupplierId = 1 },
            new Product { Id = 3, Name = "T-Shirt", SKU = "GIY-001", Price = 250, StockQuantity = 50, MinStockLevel = 10, CategoryId = 2, SupplierId = 2 }
        );
    }
}
