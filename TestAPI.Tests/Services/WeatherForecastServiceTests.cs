using TestAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using NUnit.Framework;
using System.Threading;
using TestAPI.Models;
using TestAPI.Repositories;
using TestAPI.Tests;
using TestAPI.Database;

namespace TestAPI.Services.Tests
{
  [TestFixture(-1)]
  [TestFixture(0)]
  [TestFixture(1)]
  [TestFixture(5)]
  [TestFixture(10)]
  public class WeatherForecastServiceTests
  {
    #region Fields

    private readonly int _number;

    private readonly WeatherRepository _weatherRepository;

    #endregion

    #region Public Constructors

    public WeatherForecastServiceTests(int value)
    {
      _number = value;
      _weatherRepository = new WeatherRepository(new TestDbContext().GetDatabaseContext());
    }

    #endregion

    #region Public Methods

    [Test, Order(1)]
    public async Task GetAsyncTest()
    {
      WeatherForecastService weatherService = new WeatherForecastService(_weatherRepository);

      List<WeatherForecast> result = await weatherService.GetAsync(_number, CancellationToken.None).ToListAsync();

      if (_number > 0)
      {
        if (result.Count > 0)
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
        if (result.Count == 0)
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
