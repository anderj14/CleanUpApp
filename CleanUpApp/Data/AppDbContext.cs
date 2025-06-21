using CleanUpApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CleanUpApp.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<CleanLog> CleanLogs => Set<CleanLog>();
    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();
}