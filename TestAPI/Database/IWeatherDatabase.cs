using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TestAPI.Models;

namespace TestAPI.Database
{
  public interface IWeatherDatabase
  {
    #region Properties

    DbSet<Forecast> Forecasts { get; set; }

    DbSet<Summary> Summaries { get; set; }

    #endregion

    #region Public Methods

    void Migrate();

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    #endregion
  }
}
