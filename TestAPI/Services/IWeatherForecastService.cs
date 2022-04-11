using System.Collections.Generic;
using System.Threading;
using TestAPI.Models;

namespace TestAPI.Services
{
    public interface IWeatherForecastService
    {
        public IAsyncEnumerable<WeatherForecast> GetAsync(int number, CancellationToken token);
    }
}