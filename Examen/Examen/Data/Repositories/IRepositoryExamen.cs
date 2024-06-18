using Examen.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IPeajeRepository
{
    Task<IEnumerable<Peaje>> GetAllPeajes();
    Task<Peaje> GetPeajeById(int IdPeaje);
    Task AddPeaje(Peaje Peaje);
    Task <int> UpdatePeaje(Peaje Peaje);
    Task <int> DeletePeaje(int IdPeaje);
    Task <int> InsertPeaje(Peaje Peaje);
}
