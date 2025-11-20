using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BestiarioAPI.Data;
using BestiarioAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<TokenService>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
        };
    });

// CORS - CONFIGURAÇÃO AMPLA PARA DESENVOLVIMENTO
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger sempre disponível
app.UseSwagger();
app.UseSwaggerUI();

// REMOVER HTTPS redirection em desenvolvimento
// app.UseHttpsRedirection();

// CORS deve vir ANTES de Authentication
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", async (AppDbContext db) =>
{
    try
    {
        await db.Database.CanConnectAsync();
        return Results.Ok(new { status = "Healthy", database = "PostgreSQL conectado com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Erro na conexão: {ex.Message}");
    }
});

Console.WriteLine("🚀 API Bestiário rodando!");
Console.WriteLine($"📍 Swagger: http://localhost:{builder.Configuration["ASPNETCORE_URLS"]?.Split(':').Last() ?? "5283"}/swagger");
Console.WriteLine($"📍 Health: http://localhost:{builder.Configuration["ASPNETCORE_URLS"]?.Split(':').Last() ?? "5283"}/health");

app.Run();
