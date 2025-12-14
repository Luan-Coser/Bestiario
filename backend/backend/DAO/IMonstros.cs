using BestiarioAPI.Data;
using BestiarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.DAO
{
    public interface IMonstroRepository
    {
        Task<IEnumerable<Monstro>> GetAllAsync();
        Task<Monstro?> GetByIdAsync(int id);
        Task<Monstro> AddAsync(Monstro monstro);
        Task UpdateAsync(Monstro monstro);
        Task DeleteAsync(int id);
        bool MonstroExists(int id);
    }
    public class MonstroRepository : IMonstroRepository
    {
        private readonly AppDbContext _context;

        public MonstroRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Monstro> AddAsync(Monstro monstro)
        {
            // Adiciona e salva no banco
            _context.Monstros.Add(monstro);
            await _context.SaveChangesAsync();

            // Recarrega o tipo para devolver o objeto "completo"
            await _context.Entry(monstro)
                          .Reference(m => m.Tipo)
                          .LoadAsync();

            // Repositório retorna só a entidade, sem ActionResult / CreatedAtAction
            return monstro;
        }

        public async Task DeleteAsync(int id)
        {
            var monstro = await _context.Monstros.FindAsync(id);
            if (monstro == null)
                throw new KeyNotFoundException("Monstro não encontrado");

            _context.Monstros.Remove(monstro);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Monstro>> GetAllAsync()
        {
            return await _context.Monstros
    .Include(m => m.Tipo)
    .ToListAsync();
        }

        public async Task<Monstro?> GetByIdAsync(int id)
        {
            var monstro = await  _context.Monstros
    .Include(m => m.Tipo)
    .FirstOrDefaultAsync(m => m.Id == id);

            if (monstro == null)
                return null;

            return monstro;
        }

        public bool MonstroExists(int id)
        {
            return _context.Monstros.Any(e => e.Id == id);
        }

        public async Task UpdateAsync(Monstro monstro)
        {
            _context.Entry(monstro).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var exists = _context.Monstros.Any(e => e.Id == monstro.Id);
                if (!exists)
                    throw new KeyNotFoundException("Monstro não encontrado");

                throw;
            }

        }
    }
}
