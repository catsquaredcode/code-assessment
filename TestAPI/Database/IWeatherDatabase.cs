using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Models;

namespace TestAPI.Database
{
  public interface IWeatherDatabase
    {
        #region Added methods for unit test mocking
        Task<IDictionary<DateTime, Forecast>> GetForecastsAsync(DateTime startDate, DateTime endDate, CancellationToken token);
        void AddForecast(Forecast forecast);
        Task<IEnumerable<Summary>> GetSummariesAsync(CancellationToken token);
        #endregion

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        void Migrate();
  }
}