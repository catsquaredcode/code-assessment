using System.Collections.Generic;
using System.Threading;
using TestAPI.Models;

namespace TestAPI.Services
{
    public interface IWeatherForecastService
    {
        IAsyncEnumerable<WeatherForecast> GetAsync(int number, CancellationToken token);

        Summary CalculateSummary(List<Summary> summaries, int celsius);

    }
}