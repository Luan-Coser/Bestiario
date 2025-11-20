using System.ComponentModel.DataAnnotations;

namespace BestiarioAPI.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Username é obrigatório")]
        [MaxLength(100)]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Senha é obrigatória")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
        public string Password { get; set; }
    }
}
