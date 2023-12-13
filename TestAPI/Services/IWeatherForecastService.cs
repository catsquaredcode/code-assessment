using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Models;

namespace TestAPI.Services
{
    public interface IWeatherForecastService
    {
        public IAsyncEnumerable<WeatherForecast> GetAsync(int number, CancellationToken token);
    }
}