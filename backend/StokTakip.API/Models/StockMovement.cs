namespace StokTakip.API.Models;

public enum MovementType { In, Out }

public class StockMovement
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public MovementType Type { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
}
