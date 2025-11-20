using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BestiarioAPI.DTOs;
using BestiarioAPI.Models;
using BestiarioAPI.Data;
using BestiarioAPI.Services;

namespace BestiarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email já cadastrado" });

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Email
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Credenciais inválidas" });

            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Email
                }
            });
        }
    }
}
