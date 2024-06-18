using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using MySql.Data.MySqlClient;
using Examen.Models;
using Microsoft.Extensions.Configuration;

namespace Examen.Repositories
{
    public class PeajeRepository : IPeajeRepository
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public PeajeRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection Connection => new MySqlConnection(_connectionString);

        public async Task<IEnumerable<Peaje>> GetAllPeajes()
        {
            using (IDbConnection dbConnection = Connection)
            {
                string query = "SELECT * FROM Peaje";
                return await dbConnection.QueryAsync<Peaje>(query);
            }
        }

        public async Task<Peaje> GetPeajeById(int IdPeaje)
        {
            using (IDbConnection dbConnection = Connection)
            {
                string query = "SELECT * FROM Peaje WHERE IdPeaje = @IdPeaje";
                return await dbConnection.QueryFirstOrDefaultAsync<Peaje>(query, new { IdPeaje = IdPeaje });
            }
        }

        public async Task AddPeaje(Peaje peaje)
        {
            using (IDbConnection dbConnection = Connection)
            {
                string query = @"
                    INSERT INTO Peaje (Placa, NombrePeaje, categoriaTarifa, FechaRegistro, Valor)
                    VALUES (@Placa, @NombrePeaje, @categoriaTarifa, @FechaRegistro, @Valor);";
                await dbConnection.ExecuteAsync(query, peaje);
            }
        }

        public async Task<int> InsertPeaje(Peaje Peaje)
        {
            using (IDbConnection dbConnection = Connection)
            {
                string query = @"
                    INSERT INTO Peaje (Placa, NombrePeaje, categoriaTarifa, FechaRegistro, Valor)
                    VALUES (@Placa, @NombrePeaje, @categoriaTarifa, @FechaRegistro, @Valor);
                    SELECT LAST_INSERT_IdPeaje();";
                return await dbConnection.ExecuteScalarAsync<int>(query, Peaje);
            }
        }

        public async Task<int> UpdatePeaje(Peaje pago)
        {
            using (IDbConnection dbConnection = Connection)
            {
                string query = @"
                    UPDATE peaje
                    SET Placa = @Placa, NombrePeaje = @NombrePeaje, categoriaTarifa = @categoriaTarifa, FechaRegistro = @FechaRegistro, Valor = @Valor
                    WHERE IdPeaje = @IdPeaje";
                return await dbConnection.ExecuteAsync(query, pago);
            }
        }

        public async Task<int> DeletePeaje(int IdPeaje)
        {
            using (IDbConnection dbConnection = Connection)
            {
                string query = "DELETE FROM Peaje WHERE IdPeaje = @IdPeaje";
                return await dbConnection.ExecuteAsync(query, new {IdPeaje = IdPeaje});
            }
        }
    }
}
