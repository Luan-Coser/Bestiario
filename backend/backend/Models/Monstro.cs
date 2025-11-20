using System.ComponentModel.DataAnnotations;

namespace BestiarioAPI.Models
{
    public class Monstro
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        public int TipoId { get; set; }

        public Tipo Tipo { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        [MaxLength(500)]
        public string ImagemUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
