using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestAPI.Controllers;
using TestAPI.Services;
using FluentAssertions;
using System.Threading;
using NUnit.Framework;
using TestAPI.Models;
using System.Linq;
using System;
using Moq;

namespace TestApiUnitTests.ControllerTests
{
    [TestFixture]
    public class WeatherForecastControllerTests
    {
        private WeatherForecastController _weatherForecastController;
        CancellationToken mockCancellationToken = default;
        int mockDays = 5;

        [SetUp]
        public void Setup()
        {
            var mockDisposable = new Mock<IDisposable>();
            var mockLogger = new Mock<ILogger<WeatherForecastController>>();
            mockLogger.Setup(x => x.BeginScope($"{nameof(WeatherForecastController)}.{nameof(WeatherForecastController.GetAsync)}")).Returns(mockDisposable.Object);

            var mockWeatherForecastService = new Mock<IWeatherForecastService>();
            mockWeatherForecastService.Setup(x => x.GetAsync(mockDays, mockCancellationToken)).Returns(GetTestValues());

            _weatherForecastController = new WeatherForecastController(mockLogger.Object, mockWeatherForecastService.Object);
        }
    
        /// <summary>
        /// This tests if the controller is returning the correct forecasts/formatting.
        /// </summary>
        /// <returns></returns>
        [Test]
        public async Task ItShouldReturnAListOfForecasts()
        {
            var actual = await _weatherForecastController.GetAsync(mockDays, mockCancellationToken);
            var expected = await GetTestValues().ToListAsync(mockCancellationToken);

            actual.Should().BeEquivalentTo(expected);
        }

        /// <summary>
        /// This tests if the controller is returning the correct forecasts/formatting.
        /// </summary>
        /// <returns></returns>
        [Test]
        public async Task ItShouldReturnAListOfForecastsUnauthenticated()
        {
            var actual = await _weatherForecastController.GetUnauthenticatedAsync(mockDays, mockCancellationToken);
            var expected = await GetTestValues().ToListAsync(mockCancellationToken);

            actual.Should().BeEquivalentTo(expected);
        }

        /// <summary>
        /// Creates the test WeatherForecast list.
        /// </summary>
        /// <returns></returns>
        public static async IAsyncEnumerable<WeatherForecast> GetTestValues()
        {
            yield return new WeatherForecast
            {
                Date = DateTime.Parse("2023-01-05T00:00:00"),
                Summary = "Scorching",
                TemperatureC = 40
            };
            yield return new WeatherForecast
            {
                Date = DateTime.Parse("2023-01-06T00:00:00"),
                Summary = "Sweltering",
                TemperatureC = 36
            };
            yield return new WeatherForecast
            {
                Date = DateTime.Parse("2023-01-07T00:00:00"),
                Summary = "Scorching",
                TemperatureC = 51
            };
            yield return new WeatherForecast
            {
                Date = DateTime.Parse("2023-01-08T00:00:00"),
                Summary = "Cool",
                TemperatureC = 10
            };
            yield return new WeatherForecast
            {
                Date = DateTime.Parse("2023-01-09T00:00:00"),
                Summary = "Chilly",
                TemperatureC = 7
            };

            await Task.CompletedTask;
        }
    }
}