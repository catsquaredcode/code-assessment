using TestAPI.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using TestAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using TestAPI.Common;
using TestAPI.Tests;
using System.Threading;
using TestAPI.Services;
using System.Collections;
using Microsoft.VisualBasic;

namespace TestAPI.Repositories.Tests
{
  [TestFixture(-1)]
  [TestFixture(0)]
  [TestFixture(1)]
  [TestFixture(5)]
  [TestFixture(10)]
  public class WeatherRepositoryTests
  {
    #region Fields

    private readonly int _number;

    private readonly WeatherRepository _weatherRepository;

    #endregion

    #region Public Constructors

    public WeatherRepositoryTests(int value)
    {
      _number = value;
      _weatherRepository = new WeatherRepository(new TestDbContext().GetDatabaseContext());
    }

    #endregion

    #region Public Methods

    [Test, Order(1)]
    public async Task WeatherRepositoryTests_GenerateForecastTestAsync()
    {
      DateTime currentDate = DateTime.Today.AddDays(_number);

      /* Fix for problem with multidata in run */
      var forecast = await _weatherRepository.GenerateForecastAsync(currentDate, CancellationToken.None);

      /* inverse result */
      bool testResult = false;
      if (currentDate >= DateTime.Today)
      {
        testResult = true;
      }

      if ((testResult && forecast != null) ||
          (!testResult && forecast == null))
      {
        Assert.Pass($"GenerateForecastTestsAsync with data {currentDate}");
      }
      else
      {
        Assert.Fail($"Error to GenerateForecastTestsAsync with data {currentDate}");
      }
    }

    #endregion
  }
}
