using Microsoft.EntityFrameworkCore;
using TestAPI.Common;
using TestAPI.Models;

namespace TestAPI.Database
{
  public class WeatherDatabase : DbContext, IWeatherDatabase
  {
    #region Public Constructors

    public WeatherDatabase(DbContextOptions<WeatherDatabase> options) : base(options)
    {
    }

    #endregion

    #region Properties

    public virtual DbSet<Forecast> Forecasts { get; set; }

    public virtual DbSet<Summary> Summaries { get; set; }

    #endregion

    #region Public Methods

    void IWeatherDatabase.Migrate()
    {
      Database.Migrate();
    }

    #endregion

    #region Protected Methods

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Summary>().HasData(MockSummaryData.GetSingleton().Data());

      base.OnModelCreating(modelBuilder);
    }

    #endregion
  }
}
