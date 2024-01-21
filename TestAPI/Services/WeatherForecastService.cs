using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TestAPI.Controllers;
using TestAPI.Database;
using TestAPI.Models;
using TestAPI.Repositories;

namespace TestAPI.Services
{
  public class WeatherForecastService : IWeatherForecastService
  {
    #region Fields

    private readonly IWeatherRepository _weatherRepository;

    #endregion

    #region Public Constructors

    public WeatherForecastService(IWeatherRepository weatherRepository)
    {
      _weatherRepository = weatherRepository ?? throw new ArgumentNullException(nameof(weatherRepository));
    }

    #endregion

    #region Public Methods

    public async IAsyncEnumerable<WeatherForecast> GetAsync(int number, [EnumeratorCancellation] CancellationToken token)
    {
      var startDate = DateTime.Today;
      var endDate = startDate + TimeSpan.FromDays(number);
      var forecasts = await _weatherRepository.GetForecastsByDateAsync(startDate, endDate, token);

      for (var currentDate = startDate; currentDate < endDate; currentDate += TimeSpan.FromDays(1))
      {
        if (!forecasts.TryGetValue(currentDate, out var forecast))
          forecast = await _weatherRepository.GenerateForecastAsync(currentDate, token);

        yield return new WeatherForecast
        {
          Date = forecast.Id,
          Summary = forecast.Summary.Id,
          TemperatureC = forecast.Celsius
        };
      }
    }

    #endregion
  }
}
