using DynamicChartVisualizer.Data.Repositories;

namespace DynamicChartVisualizer.Business.Services
{
    public class DatabaseService
    {
        private readonly DatabaseRepository _repository;

        public DatabaseService(string connectionString)
        {
            _repository = new DatabaseRepository(connectionString);
        }

        public async Task<IEnumerable<dynamic>> GetDataFromSPAsync(string procedureName, object parameters = null)
        {
            return await _repository.ExecuteStoredProcedureAsync(procedureName, parameters);
        }

        public async Task<IEnumerable<dynamic>> GetDataFromQueryAsync(string query)
        {
            return await _repository.ExecuteQueryAsync(query);
        }
    }
}
