using System.ComponentModel.DataAnnotations;

namespace BestiarioAPI.Models
{
    public class Tipo
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nome { get; set; }

        [MaxLength(200)]
        public string Descricao { get; set; }

        public ICollection<Monstro> Monstros { get; set; } = new List<Monstro>();
    }
}
