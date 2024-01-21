using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Database;
using TestAPI.Models;

namespace TestAPI.Repositories
{
  public class WeatherRepository : IWeatherRepository
  {
    #region Fields

    private readonly object _lock = new object();

    private readonly Random _rng = new();

    private readonly WeatherDatabase _weatherDbContext;

    #endregion

    #region Public Constructors

    public WeatherRepository(WeatherDatabase weatherDbContext)
    {
      _weatherDbContext = weatherDbContext ?? throw new ArgumentNullException(nameof(weatherDbContext));
    }

    #endregion

    #region Public Methods

    /// <summary>
    /// Generate new random forecast
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    public async Task<Forecast> GenerateForecastAsync(DateTime currentDate, CancellationToken token)
    {
      Forecast forecast = null;

      /* Generate only future */
      if (currentDate < DateTime.Today)
      {
        return null;
      }

      var summaries = await _weatherDbContext.Summaries.AsQueryable().ToListAsync(token);

      var celsius = _rng.Next(-20, 55);
      var summary = summaries.Single(s => (!s.CelsiusLow.HasValue || celsius >= s.CelsiusLow.Value) && (!s.CelsiusHigh.HasValue || celsius < s.CelsiusHigh.Value));

      forecast = await _weatherDbContext.Forecasts.AsQueryable().Where(w => w.Id.Equals(currentDate) && w.SummaryId == summary.Id).FirstOrDefaultAsync();
      if (forecast == null)
      {
        forecast = new Forecast
        {
          Celsius = celsius,
          Id = currentDate,
          SummaryId = summary.Id,
          Summary = summary
        };
        _weatherDbContext.Forecasts.Add(forecast);
        await _weatherDbContext.SaveChangesAsync(token);
      }

      return forecast;
    }

    public IEnumerable<Forecast> GetAllForecasts() => _weatherDbContext.Forecasts.Include(x => x.Summary);

    public IEnumerable<Summary> GetAllSummaries() => _weatherDbContext.Summaries;

    /// <summary>
    /// Get all forecast with summary by two date (start and end)
    /// </summary>
    /// <param name="startDate">Start data for get data on database (equal and major)</param>
    /// <param name="endDate">End data for get data on database (minor)</param>
    /// <param name="token"></param>
    /// <returns></returns>
    public async Task<Dictionary<DateTime, Forecast>> GetForecastsByDateAsync(DateTime startDate, DateTime endDate, CancellationToken token) =>
      await _weatherDbContext.Forecasts.Include(x => x.Summary).Where(x => x.Id >= startDate && x.Id < endDate).ToDictionaryAsync(x => x.Id, token);

    #endregion
  }
}
