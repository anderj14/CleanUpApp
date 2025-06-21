namespace CleanUpApp.Models;

public class UserAccount
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;
}