using Microsoft.AspNetCore.Mvc;
using StokTakip.API.DTOs;
using StokTakip.API.Services;

namespace StokTakip.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockMovementsController(StockMovementService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetByProduct([FromQuery] int productId) =>
        Ok(await service.GetByProductAsync(productId));

    [HttpPost]
    public async Task<IActionResult> Create(StockMovementCreateDto dto)
    {
        try
        {
            var result = await service.CreateAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
