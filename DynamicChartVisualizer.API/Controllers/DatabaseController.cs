using Microsoft.AspNetCore.Mvc;

namespace DynamicChartVisualizer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseController : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "API is working 🚀" });
        }
    }
}
