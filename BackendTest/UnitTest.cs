using NUnit.Framework;
using FakeItEasy;
using Microsoft.Extensions.Logging;
using TestAPI.Controllers;
using TestAPI.Services;
using System.Threading.Tasks;
using TestAPI.Database;
using Microsoft.EntityFrameworkCore;

namespace TestApiTests
{
    public class Tests
    {
        protected ILogger<WeatherForecastController> _weatherLogger;
        protected IWeatherForecastService _weatherForecastService;
        protected DbContextOptions<WeatherDatabase> _options;
        [SetUp]
        public void Setup()
        {
            _weatherLogger = A.Fake<ILogger<WeatherForecastController>>();
            var options = new DbContextOptionsBuilder<WeatherDatabase>()
            .UseSqlServer("Data Source=.\\SQLEXPRESS;Initial Catalog=Weather;Integrated Security=True;")
            .Options;
            _weatherForecastService = new WeatherForecastService(new WeatherDatabase(options));
        }

        [Test]
        public async Task Summary_Should_Have_Value()
        {
            WeatherForecastController weatherForecastController = new WeatherForecastController(_weatherLogger, _weatherForecastService);
            var items = await weatherForecastController.GetUnauthenticatedAsync();
            foreach(var item in items)
            {
                if (string.IsNullOrEmpty(item.Summary))
                {
                    Assert.That(false, "Summary must be present");
                }
            }
        }

        [Test]
        public async Task Check_Min_Celsius_Value()
        {
            WeatherForecastController weatherForecastController = new WeatherForecastController(_weatherLogger, _weatherForecastService);
            var items = await weatherForecastController.GetUnauthenticatedAsync();
            foreach (var item in items)
            {
                if (item.TemperatureC < -89.2)
                {
                    Assert.That(false, "Min Celsius Value Must Be Grather Than -89.2");
                }
            }
        }

        [Test]
        public async Task Check_Max_Celsius_Value()
        {
            WeatherForecastController weatherForecastController = new WeatherForecastController(_weatherLogger, _weatherForecastService);
            var items = await weatherForecastController.GetUnauthenticatedAsync();
            foreach (var item in items)
            {
                if (item.TemperatureC > 57.8)
                {
                    Assert.That(false, "Max Celsius Value Must Be Less or equal 57.8");
                }
            }
        }

    }
}