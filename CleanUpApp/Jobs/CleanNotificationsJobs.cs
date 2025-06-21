using CleanUpApp.Data;
using CleanUpApp.Models;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace CleanUpApp.Jobs;

public class CleanNotificationsJobs(IServiceScopeFactory scopeFactory, ILogger<CleanNotificationsJobs> logger) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var threshold = DateTime.UtcNow.AddMinutes(-5);

        var oldNotifications = await db.Notifications
            .Where(n => n.CreatedAt < threshold)
            .ToListAsync();
        
        var count = oldNotifications.Count;

        if (count > 0)
        {
            db.Notifications.RemoveRange(oldNotifications);
            await db.SaveChangesAsync();
            logger.LogInformation("🧹 {count} notificaciones eliminadas por Quartz", oldNotifications.Count);
        }
        else
        {
            logger.LogInformation("No hay notificaciones para limpiar por Quartz.");
        }

        db.CleanLogs.Add(new CleanLog
        {
            DeleteCount = count,
            Note = count > 0 ? "Limpieza exitoza" : "No habia nada que limpiar"
        });
        
        await db.SaveChangesAsync();
    }
}