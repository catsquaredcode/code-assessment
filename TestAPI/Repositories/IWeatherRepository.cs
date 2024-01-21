using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Models;

namespace TestAPI.Repositories
{
  public interface IWeatherRepository
  {
    #region Public Methods

    Task<Forecast> GenerateForecastAsync(DateTime currentDate, CancellationToken token);

    IEnumerable<Forecast> GetAllForecasts();

    IEnumerable<Summary> GetAllSummaries();

    Task<Dictionary<DateTime, Forecast>> GetForecastsByDateAsync(DateTime startDate, DateTime endDate, CancellationToken token);

    #endregion
  }
}
