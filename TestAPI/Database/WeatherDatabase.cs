using Microsoft.EntityFrameworkCore;
using TestAPI.Models;

namespace TestAPI.Database
{
  public class WeatherDatabase : DbContext, IWeatherDatabase
  {
    public WeatherDatabase(DbContextOptions<WeatherDatabase> options) : base(options)
    {
    }
        public static string ConnectionString
        {
            get { return "Data Source=SPOPYPC;Initial Catalog=Weather;Integrated Security=True;"; }
        }
        public virtual DbSet<Summary> Summaries { get; set; }

    public virtual DbSet<Forecast> Forecasts { get; set; }

    void IWeatherDatabase.Migrate()
    {
      Database.Migrate();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Summary>().HasData(new Summary
      {
        Id = "Freezing",
        CelsiusLow = null,
        CelsiusHigh = 5
      }, new Summary
      {
        Id = "Chilly",
        CelsiusLow = 5,
        CelsiusHigh = 10
      }, new Summary
      {
        Id = "Cool",
        CelsiusLow = 10,
        CelsiusHigh = 15
      }, new Summary
      {
        Id = "Mild",
        CelsiusLow = 15,
        CelsiusHigh = 20
      }, new Summary
      {
        Id = "Warm",
        CelsiusLow = 20,
        CelsiusHigh = 25
      }, new Summary
      {
        Id = "Balmy",
        CelsiusLow = 25,
        CelsiusHigh = 30
      }, new Summary
      {
        Id = "Hot",
        CelsiusLow = 30,
        CelsiusHigh = 35
      }, new Summary
      {
        Id = "Sweltering",
        CelsiusLow = 35,
        CelsiusHigh = 40
      }, new Summary
      {
        Id = "Scorching",
        CelsiusLow = 40,
        CelsiusHigh = null
      });

      base.OnModelCreating(modelBuilder);
    }
  }
}