namespace CleanUpApp.Models;

public class Notification
{
    public int Id { get; set; }
    public string Message { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}