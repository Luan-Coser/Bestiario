using backend.DAO;
using BestiarioAPI.Data;
using BestiarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IServiceTipo
    {
        Task<ActionResult<IEnumerable<Tipo>>> GetTipos();
        Task<ActionResult<Tipo>> GetTipo(int id);
        Task<ActionResult<Tipo>> PostTipo(Tipo tipo);
        Task<IActionResult> PutTipo(int id, Tipo tipo);
        Task<IActionResult> DeleteTipo(int id);
        bool TipoExists(int id);
    }

    public class ServiceTipo : IServiceTipo
    {
        ITipo _tipo;
        public ServiceTipo(ITipo tipo)
        {
            _tipo = tipo;
        }

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
           return _tipo.TipoExists(id);
        }
    }
}
