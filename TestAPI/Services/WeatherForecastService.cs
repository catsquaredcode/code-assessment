using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using TestAPI.Database;
using TestAPI.Models;

namespace TestAPI.Services
{
    public class WeatherForecastService : IWeatherForecastService
    {
        private readonly IWeatherDatabase _weatherDatabase;
        private readonly Random _rng = new();

        public WeatherForecastService(IWeatherDatabase weatherDatabase)
        {
            _weatherDatabase = weatherDatabase;
        }

        public async IAsyncEnumerable<WeatherForecast> GetAsync(int number, [EnumeratorCancellation] CancellationToken token)
        {
            if (number < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(number));
            }

            var startDate = DateTime.Today;
            var endDate = startDate + TimeSpan.FromDays(number);
            var forecasts = await _weatherDatabase.Forecasts.Include(x => x.Summary).Where(x => x.Id >= startDate && x.Id < endDate).ToDictionaryAsync(x => x.Id, token);
            var dirty = false;
            List<Summary> summaries = null;

            for (var currentDate = startDate; currentDate < endDate; currentDate += TimeSpan.FromDays(1))
            {
                if (!forecasts.TryGetValue(currentDate, out var forecast))
                {
                    summaries ??= await _weatherDatabase.Summaries.AsQueryable().ToListAsync(token);
                    var celsius = _rng.Next(-20, 55);
                    var summary = CalculateSummary(summaries, celsius);

                    forecast = new Forecast
                    {
                        Celsius = celsius,
                        Id = currentDate,
                        SummaryId = summary.Id,
                        Summary = summary
                    };

                    _weatherDatabase.Forecasts.Add(forecast);
                    dirty = true;
                }

                yield return new WeatherForecast
                {
                    Date = forecast.Id,
                    Summary = forecast.Summary.Id,
                    TemperatureC = forecast.Celsius
                };
            }

            if (dirty)
            {
                await _weatherDatabase.SaveChangesAsync(token);
            }
        }

        public Summary CalculateSummary(List<Summary> summaries, int celsius)
        {
            var summary = summaries.Single(s =>
                (!s.CelsiusLow.HasValue || celsius >= s.CelsiusLow.Value)
                && (!s.CelsiusHigh.HasValue || celsius < s.CelsiusHigh.Value));
            return summary;
        }

    }
}