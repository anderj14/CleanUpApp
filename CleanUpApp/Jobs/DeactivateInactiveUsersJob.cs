using CleanUpApp.Data;
using CleanUpApp.Models;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace CleanUpApp.Jobs;

public class DeactivateInactiveUsersJob(IServiceScopeFactory scopeFactory, ILogger<DeactivateInactiveUsersJob> logger): IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        var threshold = DateTime.UtcNow.AddDays(-30);

        var inactiveUsers = await db.UserAccounts
            .Where(u => u.IsActive && u.LastActiveAt < threshold)
            .ToListAsync();

        foreach (var user in inactiveUsers)
        {
            user.IsActive = false;
        }
        
        var count = inactiveUsers.Count;

        if (count > 0)
        {
            await db.SaveChangesAsync();
            logger.LogInformation("{count} cuentas desactivadas por inactividad", count);
        }
        else
        {
            logger.LogInformation("Todas las cuentas están activas.");
        }

        db.CleanLogs.Add(new CleanLog
        {
            DeleteCount = count,
            Note = count > 0 ? "Cuentas inactivas desactivadas" : "Ninguna cuenta para desactivar"
        });
        
        await db.SaveChangesAsync();
    }
}