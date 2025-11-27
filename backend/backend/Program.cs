using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BestiarioAPI.Data;
using BestiarioAPI.Services;

// 1. CONFIGURAÇÃO PRINCIPAL DO ASP.NET
var builder = WebApplication.CreateBuilder(args);

// 2. Configuração do banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. TokenService para JWT
builder.Services.AddScoped<TokenService>();

// 4. Autenticação JWT
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

// 5. CORS - Permite seu front de produção e localhost:5173 (React/Vite)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "https://luan.starvingdevelopers.tech", // seu domínio de produção
                "http://localhost:5173"                 // porta padrão do Vite/React local
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// 6. Controllers e Serialização
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 7. SWAGGER SEMPRE DISPONÍVEL
app.UseSwagger();
app.UseSwaggerUI();

// 8. Habilita CORS antes do Auth
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 9. Endpoint de healthcheck para teste rápido
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

// 10. Garanta que o backend vai ouvir em todas as interfaces (0.0.0.0) na porta correta (Render, VPS, etc)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5283";
app.Urls.Add($"http://0.0.0.0:{port}");

Console.WriteLine("🚀 API Bestiário rodando!");
Console.WriteLine($"📍 Health: http://localhost:{port}/health");
Console.WriteLine($"📍 Swagger: http://localhost:{port}/swagger");

app.Run();
