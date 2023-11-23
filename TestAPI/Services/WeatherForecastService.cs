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
      var startDate = DateTime.Today;
      var endDate = startDate + TimeSpan.FromDays(number);

      //replaced by the repository method
      var forecasts = await _weatherDatabase.GetForecastsAsync(startDate, endDate, token);
      var dirty = false;
      IEnumerable<Summary> summaries = null;

      for (var currentDate = startDate; currentDate < endDate; currentDate += TimeSpan.FromDays(1))
      {
        if (!forecasts.TryGetValue(currentDate, out var forecast))
        {
          //replaced by the repository method
          summaries ??= await _weatherDatabase.GetSummariesAsync(token);
          var celsius = _rng.Next(-20, 55);
          //moved this logic to a public method in order to add a unit test on it
          var summary = GetSummary(summaries, celsius);

          forecast = new Forecast
          {
            Celsius = celsius,
            Id = currentDate,
            SummaryId = summary.Id,
            Summary = summary
          };

          //replaced by the repository method
          _weatherDatabase.AddForecast(forecast);
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

    public Summary GetSummary(IEnumerable<Summary> summaries, int celsius)
    {
       return summaries.Single(s => (!s.CelsiusLow.HasValue || celsius >= s.CelsiusLow.Value) && (!s.CelsiusHigh.HasValue || celsius < s.CelsiusHigh.Value));
    }
  }
}