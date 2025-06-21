namespace CleanUpApp.Models;

public class CleanLog
{
    public int Id { get; set; }
    public DateTime ExecuteAt { get; set; } = DateTime.UtcNow;
    public int DeleteCount { get; set; }
    public string? Note { get; set; }
}