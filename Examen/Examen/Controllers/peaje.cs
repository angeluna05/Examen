using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Examen.Models;
using Examen.Repositories;

namespace PeajeAPI.Controllers
{
    [Route("api/pago")]
    [ApiController]
    public class PagosController : ControllerBase
    {
        private readonly IPeajeRepository _peajeRepository;

        public PagosController(IPeajeRepository peajeRepository)
        {
            _peajeRepository = peajeRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Peaje>> GetAllPeajes()
        {
            return await _peajeRepository.GetAllPeajes();
        }

        [HttpGet("{IdPeaje}")]
        public async Task<ActionResult<Peaje>> GetPeajeById(int IdPeaje)
        {
            var peaje = await _peajeRepository.GetPeajeById(IdPeaje);

            if (peaje == null)
            {
                return NotFound();
            }

            return peaje;
        }

        [HttpPost]
        public async Task<ActionResult<Peaje>> InsertPeaje(Peaje peaje)
        {
            if (peaje.Valor < ñ0 || string.IsNullOrEmpty(peaje.Placa) || string.IsNullOrEmpty(peaje.NombrePeaje) || string.IsNullOrEmpty(peaje.CategoriaTarifa) || !new List<string> { "I", "II", "III", "IV", "V" }.Contains(peaje.CategoriaTarifa))
            {
                return BadRequest("InvalIdPeaje input data");
            }

            var newIdPeaje = await _peajeRepository.InsertPeaje(peaje);
            peaje.IdPeaje = newIdPeaje;
            return CreatedAtAction(nameof(GetPeajeById), new { IdPeaje = newIdPeaje }, peaje);
        }

        [HttpPut("{IdPeaje}")]
        public async Task<IActionResult> UpdatePeaje(int IdPeaje, Peaje peaje)
        {
            if (IdPeaje != peaje.IdPeaje)
            {
                return BadRequest();
            }


            await _peajeRepository.UpdatePeaje(peaje);
            return NoContent();
        }

        [HttpDelete("{IdPeaje}")]
        public async Task<IActionResult> DeletePeaje(int IdPeaje)
        {
            var peaje = await _peajeRepository.GetPeajeById(IdPeaje);

            if (peaje == null)
            {
                return NotFound();
            }

            await _peajeRepository.DeletePeaje(IdPeaje);
            return NoContent();
        }
    }
}
