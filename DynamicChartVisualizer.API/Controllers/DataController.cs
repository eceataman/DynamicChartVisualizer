using Microsoft.AspNetCore.Mvc;
using DynamicChartVisualizer.Business.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Data.SqlClient;
using System.Diagnostics;

namespace DynamicChartVisualizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController : ControllerBase
    {
        private readonly ILogger<DataController> _logger;

        public DataController(ILogger<DataController> logger)
        {
            _logger = logger;
        }

        [HttpPost("execute-sp")]
        public async Task<IActionResult> ExecuteSP([FromBody] SPRequest request)
        {
            var requestId = Guid.NewGuid().ToString("N"); 
            var sw = Stopwatch.StartNew();

            try
            {
                _logger.LogInformation("➡️ [Request:{reqId}] SP çağrısı başladı. SP: {sp}", requestId, request.StoredProcedureName);

                if (string.IsNullOrWhiteSpace(request.ConnectionString) ||
                    string.IsNullOrWhiteSpace(request.StoredProcedureName))
                {
                    _logger.LogWarning("⚠️ [Request:{reqId}] Eksik parametre: ConnectionString veya StoredProcedureName boş.", requestId);
                    return BadRequest(new
                    {
                        error = "Eksik parametre: bağlantı veya SP adı belirtilmedi.",
                        errorId = requestId
                    });
                }
                var connectionString = request.ConnectionString;
                var maskedConn = MaskConnectionString(connectionString);
                var service = new DatabaseService(connectionString);
                var result = await service.GetDataFromSPAsync(request.StoredProcedureName);

                sw.Stop();
                _logger.LogInformation("✅ [Request:{reqId}] SP tamamlandı. Satır: {count}, Süre: {elapsed} ms",
                    requestId, result?.Count() ?? 0, sw.ElapsedMilliseconds);

                return Ok(result);
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError(sqlEx, " [Request:{reqId}] SQL hatası oluştu: {msg}", requestId, sqlEx.Message);
                return BadRequest(new
                {
                    error = "Veritabanı hatası oluştu. Lütfen bağlantı bilgilerini veya SP adını kontrol edin.",
                    errorId = requestId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Request:{reqId}] Genel hata oluştu: {msg}", requestId, ex.Message);
                return BadRequest(new
                {
                    error = "Beklenmeyen bir hata oluştu. Hata kimliği: " + requestId,
                    errorId = requestId
                });
            }
        }
        private static string MaskConnectionString(string conn)
        {
            if (string.IsNullOrWhiteSpace(conn)) return string.Empty;

            var parts = conn.Split(';', StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < parts.Length; i++)
            {
                if (parts[i].StartsWith("Password=", StringComparison.OrdinalIgnoreCase) ||
                    parts[i].StartsWith("Pwd=", StringComparison.OrdinalIgnoreCase))
                {
                    parts[i] = "Password=****";
                }
            }
            return string.Join(';', parts);
        }
    }
}
