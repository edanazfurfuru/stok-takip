using Microsoft.EntityFrameworkCore;

namespace StokTakip.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // DbSet'ler Phase 2'de eklenecek
}
