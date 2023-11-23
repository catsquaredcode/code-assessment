using Moq;
using Newtonsoft.Json;
using System.Globalization;
using TestAPI.Database;
using TestAPI.Models;
using TestAPI.Services;

namespace TestAPI_UnitTest
{
    public class WeatherForecastServiceTest
    {
        private Mock<IWeatherDatabase> GetMockedWeatherDatabase()
        {
            Dictionary<DateTime, Forecast> forecasts = new Dictionary<DateTime, Forecast>();

            var repositoryMock = new Mock<IWeatherDatabase>();
            repositoryMock
                .Setup(r => r.GetSummariesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(WeatherDatabaseData.GetDefaultSummaries());
            repositoryMock
                .Setup(r => r.GetForecastsAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(forecasts);
            repositoryMock
                .Setup(r => r.AddForecast(It.IsAny<Forecast>())).Callback((Forecast f) => forecasts.Add(f.Id, f));

            return repositoryMock;
        }

        [Theory]
        [InlineData(0)]
        [InlineData(1)]
        public void Get_ForecastDays_ReturnsSameRequestedForecastDaysCount(int forecastDays)
        {
            // Arrange
            var repositoryMock = GetMockedWeatherDatabase();
            var weatherForecastService = new WeatherForecastService(repositoryMock.Object);

            // Act
            var forecast = weatherForecastService.GetAsync(forecastDays, CancellationToken.None);
            int actual = forecast.CountAsync().Result;

            // Assert
            Assert.Equal(forecastDays, actual);
        }
        
        [Theory]
        [InlineData(1)]
        public void Get_SameRequests_ReturnsSameForecastData(int forecastDays)
        {
            // Arrange
            var repositoryMock = GetMockedWeatherDatabase();
            var weatherForecastService = new WeatherForecastService(repositoryMock.Object);

            // Act
            var firstforecast = weatherForecastService.GetAsync(forecastDays, CancellationToken.None).FirstOrDefaultAsync().Result;
            var secondforecast = weatherForecastService.GetAsync(forecastDays, CancellationToken.None).FirstOrDefaultAsync().Result;

            bool actual = CompareObjects(firstforecast, secondforecast);

            // Assert
            Assert.True(actual);
        }

        [Theory]
        [InlineData(1, 2)]
        public void Get_DifferentRequests_ReturnsDifferentForecastData(int firstRequestForecastDays, int secondRequestForecastDays)
        {
            // Arrange
            var repositoryMock = GetMockedWeatherDatabase();
            var weatherForecastService = new WeatherForecastService(repositoryMock.Object);

            // Act
            var firstforecast = weatherForecastService.GetAsync(firstRequestForecastDays, CancellationToken.None).ToArrayAsync().Result;
            var secondforecast = weatherForecastService.GetAsync(secondRequestForecastDays, CancellationToken.None).ToArrayAsync().Result;

            bool actual = CompareObjects(firstforecast, secondforecast);

            // Assert
            Assert.False(actual);
        }

        [Theory]
        [InlineData(-5, "Freezing")]
        [InlineData(5, "Cool")]
        [InlineData(20, "Warm")]
        [InlineData(50, "Hot")]
        public void Get_DifferentCelsius_ReturnsRightSummary(int celsius, string resultSummaryId)
        {
            // Arrange
            var repositoryMock = GetMockedWeatherDatabase();
            var weatherForecastService = new WeatherForecastService(repositoryMock.Object);
            var summaries = new Summary[] {
            new Summary
            {
                Id = "Freezing",
                CelsiusLow = null,
                CelsiusHigh = 5
            }, new Summary
            {
                Id = "Cool",
                CelsiusLow = 5,
                CelsiusHigh = 20
            }, new Summary
            {
                Id = "Warm",
                CelsiusLow = 20,
                CelsiusHigh = 30
            }, new Summary
            {
                Id = "Hot",
                CelsiusLow = 30,
                CelsiusHigh = null
            }};

            // Act
            var actual = weatherForecastService.GetSummary(summaries, celsius);


            // Assert
            Assert.True(actual.Id.Equals(resultSummaryId));
        }

        private bool CompareObjects(object? o1, object? o2)
        {
            string o1string = JsonConvert.SerializeObject(o1);
            string o2string = JsonConvert.SerializeObject(o2);

            return o1string.Equals(o2string);
        }
    }
}