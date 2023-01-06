using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using TestAPI.Services;
using System.Threading;
using TestAPI.Database;
using NUnit.Framework;
using TestAPI.Models;
using System.Linq;
using System;
using Moq;

namespace TestApiUnitTests.ServicesTests
{
    [TestFixture]
    public class WeatherForecastServiceTests
    {
        private WeatherForecastService _weatherForecastService;
        CancellationToken mockCancellationToken = default;
        
        static int mockDays = 5;
        static DateTime mockStartDate = DateTime.Today;
        DateTime mockEndDate = mockStartDate + TimeSpan.FromDays(mockDays);

        static int mockDaysNewForecastTest = 6;
        DateTime mockEndDateNewForecastTest = mockStartDate + TimeSpan.FromDays(mockDaysNewForecastTest);

        [SetUp]
        public void Setup()
        {
            var testDictionary = GetTestForecastsDictionary();

            var mockWeatherDatabase = new Mock<IWeatherDatabase>();
            mockWeatherDatabase.Setup(x => x.GetForecastsByDate(mockStartDate, mockEndDate, mockCancellationToken)).ReturnsAsync(testDictionary);
            mockWeatherDatabase.Setup(x => x.GetForecastsByDate(mockStartDate, mockEndDateNewForecastTest, mockCancellationToken)).ReturnsAsync(testDictionary);
            mockWeatherDatabase.Setup(x => x.GetSummariesAsAList(mockCancellationToken)).ReturnsAsync(GetTestSummaryList());
            mockWeatherDatabase.Setup(x => x.SaveChangesAsync(mockCancellationToken)).ReturnsAsync(1);
            mockWeatherDatabase.Setup(x => x.AddToForecasts(It.IsAny<Forecast>()));

            var mockRandomGenerator = new Mock<IRandomGenerator>();
            mockRandomGenerator.Setup(x => x.Next(-20, 55)).Returns(25);

            _weatherForecastService = new WeatherForecastService(mockWeatherDatabase.Object, mockRandomGenerator.Object);
        }

        /// <summary>
        /// Checks to see if we are getting the correct count/formatting of the weather forecasts returned.
        /// </summary>
        /// <returns></returns>
        [Test]
        public async Task ItShouldReturnForecasts()
        {

            var actual = await _weatherForecastService.GetAsync(mockDays, mockCancellationToken).ToListAsync(mockCancellationToken);
            actual.Should().HaveCount(5);

            var expected = GetWeatherForecastList(false);

            actual.Should().BeEquivalentTo(expected);
        }

        /// <summary>
        /// Checks to see if we are getting the correct count/formatting of weather forecasts returned.
        /// This test includes adding a new forecast due to the date not having an active forecast in the data set.
        /// </summary>
        /// <returns></returns>
        [Test]
        public async Task ItShouldReturnTheSameNumberOfForecasts()
        {
            var actual = await _weatherForecastService.GetAsync(mockDaysNewForecastTest, mockCancellationToken).ToListAsync(mockCancellationToken);
            var expected = GetWeatherForecastList(true);

            actual.Should().HaveCount(6);
            actual.Should().BeEquivalentTo(expected);
        }

        /// <summary>
        /// Creates a test forecast dictionary to mock the dbset dictionary return.
        /// </summary>
        /// <returns></returns>
        public Dictionary<DateTime,Forecast> GetTestForecastsDictionary()
        {
            return new Dictionary<DateTime, Forecast>
            {
                {
                    DateTime.Today,
                    new Forecast{
                        Id = DateTime.Today,
                        Celsius = 40,
                        SummaryId = "Scorching",
                        Summary = new Summary
                        {
                            Id = "Scorching",
                            CelsiusLow = 40,
                            CelsiusHigh = null
                        }
                    }
                },
                {
                    DateTime.Today.AddDays(1),
                    new Forecast{
                        Id = DateTime.Today.AddDays(1),
                        Celsius = 36,
                        SummaryId = "Sweltering",
                        Summary = new Summary
                        {
                            Id = "Sweltering",
                            CelsiusLow = 35,
                            CelsiusHigh = 40
                        }
                    }
                },
                {
                    DateTime.Today.AddDays(2),
                    new Forecast{
                        Id = DateTime.Today.AddDays(2),
                        Celsius = 40,
                        SummaryId = "Scorching",
                        Summary = new Summary
                        {
                            Id = "Scorching",
                            CelsiusLow = 40,
                            CelsiusHigh = null
                        }
                    }
                },
                {
                    DateTime.Today.AddDays(3),
                    new Forecast{
                        Id = DateTime.Today.AddDays(3),
                        Celsius = 10,
                        SummaryId = "Cool",
                        Summary = new Summary
                        {
                            Id = "Cool",
                            CelsiusLow = 10,
                            CelsiusHigh = 15
                        }
                    }
                },
                {
                    DateTime.Today.AddDays(4),
                    new Forecast{
                        Id = DateTime.Today.AddDays(4),
                        Celsius = 25,
                        SummaryId = "Balmy",
                        Summary = new Summary
                        {
                            Id = "Balmy",
                            CelsiusLow = 25,
                            CelsiusHigh = 30
                        }
                    }
                }
            };
        }

        /// <summary>
        /// Creates a list of summaries to mock the dbset list return.
        /// </summary>
        /// <returns></returns>
        public List<Summary> GetTestSummaryList()
        {
            return new List<Summary>
            {
                new Summary
                {
                    Id = "Scorching",
                    CelsiusLow = 40,
                    CelsiusHigh = null
                },
                new Summary
                {
                    Id = "Sweltering",
                    CelsiusLow = 35,
                    CelsiusHigh = 40
                },
                new Summary
                {
                    Id = "Scorching",
                    CelsiusLow = 40,
                    CelsiusHigh = null
                },
                new Summary
                {
                    Id = "Cool",
                    CelsiusLow = 10,
                    CelsiusHigh = 15
                },
                new Summary
                {
                    Id = "Balmy",
                    CelsiusLow = 25,
                    CelsiusHigh = 30
                }
            };
        }

        /// <summary>
        /// Creates the expected weather forecasts. 
        /// This works with both the normal and added forecast test.
        /// </summary>
        /// <param name="addedForecast"></param>
        /// <returns></returns>
        public List<WeatherForecast> GetWeatherForecastList(bool addedForecast)
        {
            var forecastList = new List<WeatherForecast>
            {
                new WeatherForecast
                {
                    Date = DateTime.Today,
                    Summary = "Scorching",
                    TemperatureC = 40
                },
                new WeatherForecast
                {
                    Date = DateTime.Today.AddDays(1),
                    Summary = "Sweltering",
                    TemperatureC = 36
                },
                new WeatherForecast
                {
                    Date = DateTime.Today.AddDays(2),
                    Summary = "Scorching",
                    TemperatureC = 40
                },
                new WeatherForecast
                {
                    Date = DateTime.Today.AddDays(3),
                    Summary = "Cool",
                    TemperatureC = 10
                },
                new WeatherForecast
                {
                    Date = DateTime.Today.AddDays(4),
                    Summary = "Balmy",
                    TemperatureC = 25
                }
            };

            if(addedForecast)
            {
                forecastList.Add(new WeatherForecast
                {
                    Date = DateTime.Today.AddDays(5),
                    Summary = "Balmy",
                    TemperatureC = 25
                });
            }

            return forecastList; 
        }
    }
}
