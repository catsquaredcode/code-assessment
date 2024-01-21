using TestAPI.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using Microsoft.Extensions.Logging;
using Moq;
using TestAPI.Services;
using System.Threading;
using TestAPI.Models;
using TestAPI.Repositories;
using TestAPI.Tests;
using TestAPI.Services.Tests;

namespace TestAPI.Controllers.Tests
{
  [TestFixture(-1)]
  [TestFixture(0)]
  [TestFixture(1)]
  [TestFixture(5)]
  [TestFixture(10)]
  public class WeatherForecastControllerTests
  {
    #region Fields

    private readonly int _number;

    private readonly WeatherForecastService _weatherForecastService;

    private readonly WeatherRepository _weatherRepository;

    private readonly Mock<ILogger<WeatherForecastController>> mockLogger = new();

    private WeatherForecastController weatherForecastController;

    #endregion

    #region Public Constructors

    public WeatherForecastControllerTests(int value)
    {
      _number = value;
      _weatherRepository = new WeatherRepository(new TestDbContext().GetDatabaseContext());
      _weatherForecastService = new WeatherForecastService(_weatherRepository);
    }

    #endregion

    #region Public Methods

    [Test, Order(1)]
    public async Task GetAsyncTest()
    {
      weatherForecastController = new WeatherForecastController(mockLogger.Object, _weatherForecastService);
      IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetAsync(_number, CancellationToken.None);

      if (_number > 0)
      {
        if (weatherForecasts.Count() > 0)
        {
          Assert.Pass($"number: {_number}");
        }
        else
        {
          Assert.Fail($"number: {_number}");
        }
      }
      else
      {
        if (weatherForecasts.Count() == 0)
        {
          Assert.Pass($"number: {_number}");
        }
        else
        {
          Assert.Fail($"number: {_number}");
        }
      }
    }

    [Test, Order(2)]
    public async Task GetUnauthenticatedAsyncTest()
    {
      weatherForecastController = new WeatherForecastController(mockLogger.Object, _weatherForecastService);
      IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetUnauthenticatedAsync(_number, CancellationToken.None);

      if (_number > 0)
      {
        if (weatherForecasts.Count() > 0)
        {
          Assert.Pass($"number: {_number}");
        }
        else
        {
          Assert.Fail($"number: {_number}");
        }
      }
      else
      {
        if (weatherForecasts.Count() == 0)
        {
          Assert.Pass($"number: {_number}");
        }
        else
        {
          Assert.Fail($"number: {_number}");
        }
      }
    }

    #endregion
  }
}
