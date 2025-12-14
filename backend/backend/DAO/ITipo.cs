using BestiarioAPI.Data;
using BestiarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.DAO
{
    public interface ITipo
    {
        Task<ActionResult<IEnumerable<Tipo>>> GetTipos();
        Task<ActionResult<Tipo>> GetTipo(int id);
        Task<ActionResult<Tipo>> PostTipo(Tipo tipo);
        Task<IActionResult> PutTipo(int id, Tipo tipo);
        Task<IActionResult> DeleteTipo(int id);
        bool TipoExists(int id);
    }
    public class TipoRepository : ITipo
    {
        private readonly AppDbContext _context;

        public Task<IActionResult> DeleteTipo(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<Tipo>> GetTipo(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<IEnumerable<Tipo>>> GetTipos()
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<Tipo>> PostTipo(Tipo tipo)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> PutTipo(int id, Tipo tipo)
        {
            throw new NotImplementedException();
        }

        public bool TipoExists(int id)
        {
            return _context.Tipos.Any(e => e.Id == id);
        }
    }
}
