using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using Microsoft.EntityFrameworkCore;
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
            var startDate = DateTime.Today;
            var endDate = startDate + TimeSpan.FromDays(number);
            var forecasts = await _weatherDatabase.Forecasts.Include(x => x.Summary).Where(x => x.Id >= startDate && x.Id < endDate).ToDictionaryAsync(x => x.Id, token);
            var dirty = false;
            SummaryList summaries = null;

            for (var currentDate = startDate; currentDate < endDate; currentDate += TimeSpan.FromDays(1))
            {
                if (!forecasts.TryGetValue(currentDate, out var forecast))
                {
                    if (summaries == null)
                    {
                        summaries = new();
                        summaries.AddRange(await _weatherDatabase.Summaries.AsQueryable().ToListAsync(token));
                    }
                    var celsius = _rng.Next(-20, 55);

                    var summary = summaries.GetSummaries(celsius);
                    //var summary = summaries.Single(s => (!s.CelsiusLow.HasValue || celsius >= s.CelsiusLow.Value) && (!s.CelsiusHigh.HasValue || celsius < s.CelsiusHigh.Value));

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
    }
}