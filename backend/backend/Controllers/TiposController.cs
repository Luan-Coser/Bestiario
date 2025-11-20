using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BestiarioAPI.Data;
using BestiarioAPI.Models;

namespace BestiarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiposController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TiposController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tipos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tipo>>> GetTipos()
        {
            return await _context.Tipos.ToListAsync();
        }

        // GET: api/Tipos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tipo>> GetTipo(int id)
        {
            var tipo = await _context.Tipos.FindAsync(id);

            if (tipo == null)
                return NotFound();

            return tipo;
        }

        // POST: api/Tipos
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Tipo>> PostTipo(Tipo tipo)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Tipos.Add(tipo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTipo), new { id = tipo.Id }, tipo);
        }

        // PUT: api/Tipos/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipo(int id, Tipo tipo)
        {
            if (id != tipo.Id)
                return BadRequest();

            _context.Entry(tipo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Tipos/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipo(int id)
        {
            var tipo = await _context.Tipos.FindAsync(id);
            if (tipo == null)
                return NotFound();

            // Verifica se existem monstros com este tipo
            var hasMonsters = await _context.Monstros.AnyAsync(m => m.TipoId == id);
            if (hasMonsters)
                return BadRequest(new { message = "Não é possível excluir tipo com monstros cadastrados" });

            _context.Tipos.Remove(tipo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoExists(int id)
        {
            return _context.Tipos.Any(e => e.Id == id);
        }
    }
}
