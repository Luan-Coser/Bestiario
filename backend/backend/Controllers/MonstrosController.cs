using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BestiarioAPI.Data;
using BestiarioAPI.Models;
using Microsoft.AspNetCore.Identity;
using backend.Services;

namespace BestiarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonstrosController : ControllerBase
    {
        private IServiceMonstro _serviceMonstro;
        public MonstrosController(IServiceMonstro serviceMonstro)
        {
            _serviceMonstro = serviceMonstro;
        }

        // GET: api/Monstros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Monstro>>> GetMonstros()
        {
            var monstros = await _serviceMonstro.GetAllAsync();
            return Ok(monstros);

        }

        // GET: api/Monstros/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Monstro>> GetMonstro(int id)
        {
            var monstro = await _serviceMonstro.GetByIdAsync(id);
            if (monstro is null)
                return NotFound();

            return Ok(monstro);
        }

        // POST: api/Monstros
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Monstro>> PostMonstro(Monstro monstro)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                monstro = await _serviceMonstro.AddAsync(monstro);
                return CreatedAtAction(nameof(GetMonstro), new { id = monstro.Id }, monstro);
            }
            catch (InvalidOperationException ex) when (ex.Message == "Tipo não encontrado")
            {
                return BadRequest(new { message = ex.Message });
            }

        }
        // PUT: api/Monstros/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMonstro(int id, Monstro monstro)
        {
            if (id != monstro.Id)
                return BadRequest();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _serviceMonstro.UpdateAsync(monstro);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MonstroExists(id))
                    return NotFound();
                throw;
            }
        }

        // DELETE: api/Monstros/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMonstro(int id)
        {
            try
            {
               await _serviceMonstro.DeleteAsync(id);
               return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private bool MonstroExists(int id)
        {
            return _serviceMonstro.MonstroExists(id);
        }
    }
}
