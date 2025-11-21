using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BestiarioAPI.Models
{
    public class Monstro
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tipo é obrigatório")]
        public int TipoId { get; set; }

        // JsonIgnore para evitar referência circular
        [JsonIgnore]
        public Tipo? Tipo { get; set; }

        [MaxLength(1000)]
        public string? Descricao { get; set; }

        [MaxLength(500)]
        public string? ImagemUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
