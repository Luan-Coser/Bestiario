using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BestiarioAPI.Data;
using BestiarioAPI.Models;

namespace BestiarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonstrosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MonstrosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Monstros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Monstro>>> GetMonstros()
        {
            return await _context.Monstros
                .Include(m => m.Tipo)
                .ToListAsync();
        }

        // GET: api/Monstros/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Monstro>> GetMonstro(int id)
        {
            var monstro = await _context.Monstros
                .Include(m => m.Tipo)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (monstro == null)
                return NotFound();

            return monstro;
        }

        // POST: api/Monstros
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Monstro>> PostMonstro(Monstro monstro)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verifica se o tipo existe
            var tipoExists = await _context.Tipos.AnyAsync(t => t.Id == monstro.TipoId);
            if (!tipoExists)
                return BadRequest(new { message = "Tipo não encontrado" });

            _context.Monstros.Add(monstro);
            await _context.SaveChangesAsync();

            // Recarrega com o tipo incluído
            await _context.Entry(monstro).Reference(m => m.Tipo).LoadAsync();

            return CreatedAtAction(nameof(GetMonstro), new { id = monstro.Id }, monstro);
        }

        // PUT: api/Monstros/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMonstro(int id, Monstro monstro)
        {
            if (id != monstro.Id)
                return BadRequest();

            // Verifica se o tipo existe
            var tipoExists = await _context.Tipos.AnyAsync(t => t.Id == monstro.TipoId);
            if (!tipoExists)
                return BadRequest(new { message = "Tipo não encontrado" });

            _context.Entry(monstro).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MonstroExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Monstros/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMonstro(int id)
        {
            var monstro = await _context.Monstros.FindAsync(id);
            if (monstro == null)
                return NotFound();

            _context.Monstros.Remove(monstro);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MonstroExists(int id)
        {
            return _context.Monstros.Any(e => e.Id == id);
        }
    }
}
