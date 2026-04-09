using Microsoft.AspNetCore.Mvc;
using StokTakip.API.DTOs;
using StokTakip.API.Services;

namespace StokTakip.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(ProductService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] int? categoryId = null)
    {
        var result = await service.GetAllAsync(page, pageSize, search, categoryId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock() =>
        Ok(await service.GetLowStockAsync());

    [HttpPost]
    public async Task<IActionResult> Create(ProductCreateDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ProductUpdateDto dto)
    {
        var result = await service.UpdateAsync(id, dto);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
