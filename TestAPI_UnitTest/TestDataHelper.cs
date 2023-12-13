using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestAPI.Database;
using TestAPI.Models;

namespace TestAPI_UnitTest
{
    public static class TestDataHelper
    {
        private static List<Summary> Summaries { get; set; } = new List<Summary>
        {
            new Summary { Id = "Freezing", CelsiusLow = null, CelsiusHigh = 5 },
            new Summary { Id = "Chilly", CelsiusLow = 5, CelsiusHigh = 10 },
            new Summary { Id = "Cool", CelsiusLow = 10, CelsiusHigh = 15 },
            new Summary { Id = "Mild", CelsiusLow = 15, CelsiusHigh = 20 },
            new Summary { Id = "Warm", CelsiusLow = 20, CelsiusHigh = 25 },
            new Summary { Id = "Balmy", CelsiusLow = 25, CelsiusHigh = 30 },
            new Summary { Id = "Hot", CelsiusLow = 30, CelsiusHigh = 35 },
            new Summary { Id = "Sweltering", CelsiusLow = 35, CelsiusHigh = 40 },
            new Summary { Id = "Scorching", CelsiusLow = 40, CelsiusHigh = null }
        };

        private static List<WeatherForecast> WeatherForecasts { get; set; } = new List<WeatherForecast>
        {
            new WeatherForecast { Date = DateTime.Today, Summary = "Mild", TemperatureC = 17 },
            new WeatherForecast { Date = DateTime.Today.AddDays(1), Summary = "Mild", TemperatureC = 19 },
            new WeatherForecast { Date = DateTime.Today.AddDays(2), Summary = "Warm", TemperatureC = 22 },
            new WeatherForecast { Date = DateTime.Today.AddDays(3), Summary = "Warm", TemperatureC = 21 },
            new WeatherForecast { Date = DateTime.Today.AddDays(4), Summary = "Cool", TemperatureC = 15 }
        };

        public static List<Summary> GetFakeSummariesList()
        {
            return Summaries;
        }

        public static List<WeatherForecast> GetFakeWeatherForecastsList()
        {
            return WeatherForecasts;
        }

        public static WeatherDatabase GetDatabaseContext()
        {
            DbContextOptions<WeatherDatabase> options = new DbContextOptionsBuilder<WeatherDatabase>()
                                                        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                                                        .Options;

            WeatherDatabase databaseContext = new WeatherDatabase(options);

            databaseContext.Summaries.AddRange(Summaries);
            databaseContext.SaveChanges();

            return databaseContext;
        }

        public static WeatherDatabase GetNotPopulatedDatabaseContext()
        {
            DbContextOptions<WeatherDatabase> options = new DbContextOptionsBuilder<WeatherDatabase>()
                                                        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                                                        .Options;

            WeatherDatabase databaseContext = new WeatherDatabase(options);

            return databaseContext;
        }
    }
}
