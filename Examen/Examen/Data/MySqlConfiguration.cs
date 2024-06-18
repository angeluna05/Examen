using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Examen.Repositories
{
    public class MysqlConfiguration
    {
        public MysqlConfiguration(string connectionString) => this.ConnectionString = connectionString;

        public string ConnectionString { get; set; }
    }
}