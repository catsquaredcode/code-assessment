using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TestAPI.Models;
using TestAPI.Services;

namespace TestAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IWeatherForecastService _weatherForecastService;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IWeatherForecastService weatherForecastService)
        {
            _logger = logger;
            _weatherForecastService = weatherForecastService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IEnumerable<WeatherForecast>> GetAsync(int days = 5, CancellationToken token = default)
        {
            using var loggingScope = _logger.BeginScope($"{nameof(WeatherForecastController)}.{nameof(GetAsync)}");
            return await _weatherForecastService.GetAsync(days, token).ToListAsync(token);
        }

        [HttpGet("unauthenticated")]
        public async Task<IEnumerable<WeatherForecast>> GetUnauthenticatedAsync(int days = 5, CancellationToken token = default)
        {
            using var loggingScope = _logger.BeginScope($"{nameof(WeatherForecastController)}.{nameof(GetUnauthenticatedAsync)}");
            return await _weatherForecastService.GetAsync(days, token).ToListAsync(token);
        }
    }
}