using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestAPI.Common;
using TestAPI.Database;
using TestAPI.Models;

namespace TestAPI.Tests
{
  public class TestDbContext
  {
    #region Fields

    private WeatherDatabase databaseContext;

    #endregion

    #region Public Methods

    public WeatherDatabase GetDatabaseContext()
    {
      if (databaseContext == null)
      {
        DbContextOptions<WeatherDatabase> options = new DbContextOptionsBuilder<WeatherDatabase>()
                                                    .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                                                    .Options;

        databaseContext = new WeatherDatabase(options);

        databaseContext.Summaries.AddRange(MockSummaryData.GetSingleton().Data());
        databaseContext.SaveChanges();
      }

      return databaseContext;
    }

    #endregion
  }
}
