using CleanUpApp.Data;
using CleanUpApp.Jobs;
using CleanUpApp.Models;
using Microsoft.EntityFrameworkCore;
using Quartz;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlite("Data Source=cleanup.db"));

builder.Services.AddQuartz(q =>
{
    var jobKey = new JobKey("CleanNotificationsJob");

    q.AddJob<CleanNotificationsJobs>(opts => opts.WithIdentity(jobKey));

    q.AddTrigger(t => t
        .ForJob(jobKey)
        .WithIdentity("CleanNotificationsTrigger")
        .WithSimpleSchedule(s => s
            .WithIntervalInMinutes(1)
            .RepeatForever()));
    
    var deactivateJobKey = new JobKey("DeactivateInactiveUsersJob");
    
    q.AddJob<DeactivateInactiveUsersJob>(opts => opts.WithIdentity(deactivateJobKey));
    
    q.AddTrigger(t => t
        .ForJob(deactivateJobKey)
        .WithIdentity("DeactivateUsersTrigger")
        .WithSimpleSchedule(s => s
            .WithIntervalInMinutes(2)
            .RepeatForever()));
});

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.MapPost("/notifications", async (AppDbContext db, string message) =>
{
    db.Notifications.Add(new Notification { Message = message });
    await db.SaveChangesAsync();
    return Results.Ok("Notificación guardada");
});

app.MapGet("/notifications", async (AppDbContext db) =>
    await db.Notifications.OrderByDescending(n => n.CreatedAt).ToListAsync());

app.MapPost("/users", async (AppDbContext db, string username, DateTime? lastActiveAt) =>
{
    db.UserAccounts.Add(new UserAccount
    {
        Username = username,
        LastActiveAt = lastActiveAt ?? DateTime.UtcNow
    });

    await db.SaveChangesAsync();
    return Results.Ok("Usuario creado");
});

app.MapGet("/users", async (AppDbContext db) =>
    await db.UserAccounts.ToListAsync());

app.Run();