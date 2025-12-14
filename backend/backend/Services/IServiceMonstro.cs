using backend.DAO;
using BestiarioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IServiceMonstro
    {
            Task<IEnumerable<Monstro>>GetAllAsync();
            Task<Monstro?> GetByIdAsync(int id);
            Task<Monstro> AddAsync(Monstro monstro);
            Task UpdateAsync(Monstro monstro);
            Task DeleteAsync(int id);
            bool MonstroExists(int id);
    }
    public class ServiceMonstros : IServiceMonstro
    {
        private readonly IMonstroRepository _monstroRepository;
        private readonly IServiceTipo _serviceTipo;

        // Construtor com injeção de dependência
        public ServiceMonstros(IMonstroRepository monstroRepository, IServiceTipo serviceTipo)
        {
            _monstroRepository = monstroRepository;
            _serviceTipo = serviceTipo;
        }

        public Task<Monstro> AddAsync(Monstro monstro)
        {
            var tipoExists = _serviceTipo.TipoExists(monstro.TipoId);
            if (!tipoExists)
                throw new InvalidOperationException("Tipo não encontrado");

            return _monstroRepository.AddAsync(monstro);
        }

        public Task DeleteAsync(int id)
        {
            return _monstroRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<Monstro>> GetAllAsync()
        {
            return _monstroRepository.GetAllAsync();
        }

        public Task<Monstro?> GetByIdAsync(int id)
        {
            return _monstroRepository.GetByIdAsync(id);
        }

        public bool MonstroExists(int id)
        {
          return _monstroRepository.MonstroExists(id);
        }

        public Task UpdateAsync(Monstro monstro)
        {
            if (!(_serviceTipo.TipoExists(monstro.TipoId)))
                throw new InvalidOperationException("Tipo não encontrado");

            return _monstroRepository.UpdateAsync(monstro);
        }
    }
}
