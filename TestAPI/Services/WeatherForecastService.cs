using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TestAPI.Database;
using TestAPI.Models;

namespace TestAPI.Services
{
    public class WeatherForecastService : IWeatherForecastService
    {
        private readonly Random _rng = new();
        private readonly IWeatherDatabase _weatherDatabase;

        public WeatherForecastService(IWeatherDatabase weatherDatabase)
            => _weatherDatabase = weatherDatabase;

        public async IAsyncEnumerable<WeatherForecast> GetAsync(int number, [EnumeratorCancellation] CancellationToken token)
        {
            DateTime startDate = DateTime.Today.Date, endDate = startDate + TimeSpan.FromDays(number);

            if (endDate <= startDate) yield break; // Break early since we know there won't be results

            var forecasts = await _weatherDatabase.Forecasts.AsQueryable().Where(x => x.Id >= startDate && x.Id < endDate).ToDictionaryAsync(x => x.Id, token);
            var dirty = false;
            
            for (var currentDate = startDate; currentDate < endDate; currentDate += TimeSpan.FromDays(1))
            {
                if (!forecasts.TryGetValue(currentDate, out var forecast))
                {
                    dirty = true;
                    int celsius = _rng.Next(-20, 55);
                    var summary = await GetSummaryAsync(celsius);

                    _weatherDatabase.Forecasts.Add(forecast = new Forecast
                    {
                        Celsius = celsius,
                        Id = currentDate,
                        SummaryId = summary.Id,
                        Summary = summary
                    });
                }

                yield return new WeatherForecast
                {
                    Date = forecast.Id,
                    Summary = forecast.SummaryId,
                    TemperatureC = forecast.Celsius
                };
            }

            if (dirty)
                await _weatherDatabase.SaveChangesAsync(token);
        }

        private async Task<Summary> GetSummaryAsync(int celsius)
            => await _weatherDatabase.Summaries.AsQueryable()
                .SingleOrDefaultAsync(s => (!s.CelsiusLow.HasValue || celsius >= s.CelsiusLow.Value) && (!s.CelsiusHigh.HasValue || celsius < s.CelsiusHigh.Value));
    }
}