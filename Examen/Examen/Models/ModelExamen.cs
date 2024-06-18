using System;
using System.ComponentModel.DataAnnotations;

namespace Examen.Models // Asegúrate de que el namespace coincida con el de tu proyecto
{
    public class Peaje
    {
        [Key]
        public int IdPeaje { get; set; }

        [Required]
        [MaxLength(10)]
        public string Placa { get; set; }

        [Required]
        [MaxLength(60)]
        public string NombrePeaje { get; set; }

        [Required]
        [RegularExpression("^(I|II|III|IV|V)$", ErrorMessage = "CategoriaTarifa debe ser I, II, III, IV o V")]
        public string CategoriaTarifa { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "El valor debe ser mayor o igual a 0")]
        public decimal Valor { get; set; }
    }
}
