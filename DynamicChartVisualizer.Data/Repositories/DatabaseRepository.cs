using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;

namespace DynamicChartVisualizer.Data.Repositories
{
    public class DatabaseRepository
    {
        private readonly string _connectionString;

        public DatabaseRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<dynamic>> ExecuteStoredProcedureAsync(string procedureName, object parameters = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<IEnumerable<dynamic>> ExecuteQueryAsync(string query)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryAsync(query);
            }
        }
    }
}
