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
    private readonly IRandomGenerator _rng;
    public WeatherForecastService(IWeatherDatabase weatherDatabase, IRandomGenerator rng)
    {
      _weatherDatabase = weatherDatabase;
      _rng = rng;
    }

    public async IAsyncEnumerable<WeatherForecast> GetAsync(int number, [EnumeratorCancellation] CancellationToken token)
    {
      var startDate = DateTime.Today;
      var endDate = startDate + TimeSpan.FromDays(number);
      var forecasts = await _weatherDatabase.GetForecastsByDate(startDate, endDate, token);
      var dirty = false;
      List<Summary> summaries = null;

      for (var currentDate = startDate; currentDate < endDate; currentDate += TimeSpan.FromDays(1))
      {
        if (!forecasts.TryGetValue(currentDate, out var forecast))
        {
          summaries = await _weatherDatabase.GetSummariesAsAList(token);
          var celsius = _rng.Next(-20, 55);
          var summary = summaries.Single(s => (!s.CelsiusLow.HasValue || celsius >= s.CelsiusLow.Value) && (!s.CelsiusHigh.HasValue || celsius < s.CelsiusHigh.Value));

          forecast = new Forecast
          {
            Celsius = celsius,
            Id = currentDate,
            SummaryId = summary.Id,
            Summary = summary
          };

          _weatherDatabase.AddToForecasts(forecast);
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