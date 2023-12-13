using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Controllers;
using TestAPI.Database;
using TestAPI.Exceptions;
using TestAPI.Models;
using TestAPI.Services;
using Xunit;

namespace TestAPI_UnitTest
{
    public class WeatherForecastController_Tests
    {
        private readonly Mock<ILogger<WeatherForecastController>> logger = new();
        private readonly Mock<IWeatherForecastService> weatherForecastServiceMock = new();
        private WeatherForecastController weatherForecastController;

        /// <summary>
        /// Check GetUnauthenticatedAsync Controller Method Using Mocked Service In Case of No WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_GetUnauthenticated_WithNoWeatherForecast_Async()
        {
            weatherForecastController = new WeatherForecastController(logger.Object, weatherForecastServiceMock.Object);

            weatherForecastServiceMock
                .Setup(mock => mock.GetAsync(0, CancellationToken.None))
                .Returns(Enumerable.Empty<WeatherForecast>().ToAsyncEnumerable());

            IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetUnauthenticatedAsync(0);

            weatherForecastServiceMock
                .Verify(mock => mock.GetAsync(0, CancellationToken.None), Times.Once());

            Assert.Empty(weatherForecasts);
        }

        /// <summary>
        /// Check GetUnauthenticatedAsync Controller Method Using Mocked Service In Case of 5 WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_GetUnauthenticated_WithWeatherForecast_Async()
        {
            weatherForecastController = new WeatherForecastController(logger.Object, weatherForecastServiceMock.Object);

            weatherForecastServiceMock
                .Setup(mock => mock.GetAsync(5, CancellationToken.None))
                .Returns(TestDataHelper.GetFakeWeatherForecastsList().ToAsyncEnumerable());

            IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetUnauthenticatedAsync(5);

            weatherForecastServiceMock
                .Verify(mock => mock.GetAsync(5, CancellationToken.None), Times.Once());

            Assert.Equal(5, weatherForecasts.Count());

            foreach (WeatherForecast weatherForecast in TestDataHelper.GetFakeWeatherForecastsList().ToList())
            {
                Assert.Contains(weatherForecast, weatherForecasts);
            }
        }

        /// <summary>
        /// Check GetAsync Controller Method Using Mocked Service In Case of No WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_WithNoWeatherForecast_Async()
        {
            weatherForecastController = new WeatherForecastController(logger.Object, weatherForecastServiceMock.Object);

            weatherForecastServiceMock
                .Setup(mock => mock.GetAsync(0, CancellationToken.None))
                .Returns(Enumerable.Empty<WeatherForecast>().ToAsyncEnumerable());

            IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetAsync(0);

            weatherForecastServiceMock
                .Verify(mock => mock.GetAsync(0, CancellationToken.None), Times.Once());

            Assert.Empty(weatherForecasts);
        }

        /// <summary>
        /// Check GetAsync Controller Method Using Mocked Service In Case of 5 WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_WithWeatherForecast_Async()
        {
            weatherForecastController = new WeatherForecastController(logger.Object, weatherForecastServiceMock.Object);

            weatherForecastServiceMock
                .Setup(mock => mock.GetAsync(5, CancellationToken.None))
                .Returns(TestDataHelper.GetFakeWeatherForecastsList().ToAsyncEnumerable());

            IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetAsync(5);

            weatherForecastServiceMock
                .Verify(mock => mock.GetAsync(5, CancellationToken.None), Times.Once());

            Assert.Equal(5, weatherForecasts.Count());

            foreach (WeatherForecast weatherForecast in TestDataHelper.GetFakeWeatherForecastsList().ToList())
            {
                Assert.Contains(weatherForecast, weatherForecasts);
            }
        }

        /// <summary>
        /// Check GetUnauthenticatedAsync Controller Method Using Mocked Service In Case of Exception Raised
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_GetUnauthenticated_WithException_Async()
        {
            weatherForecastController = new WeatherForecastController(logger.Object, weatherForecastServiceMock.Object);

            weatherForecastServiceMock
                .Setup(mock => mock.GetAsync(5, CancellationToken.None))
                .Throws(new SummariesNotFoundException("No Summary was found in the Database"));

            await Assert.ThrowsAsync<SummariesNotFoundException>(async () => await weatherForecastController.GetUnauthenticatedAsync(5));

            weatherForecastServiceMock
                .Verify(mock => mock.GetAsync(5, CancellationToken.None), Times.Once());
        }

        /// <summary>
        /// Check GetAsync Controller Method Using Mocked Service In Case of Exception Raised
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_WithException_Async()
        {
            weatherForecastController = new WeatherForecastController(logger.Object, weatherForecastServiceMock.Object);

            weatherForecastServiceMock
                .Setup(mock => mock.GetAsync(5, CancellationToken.None))
                .Throws(new SummariesNotFoundException("No Summary was found in the Database"));

            await Assert.ThrowsAsync<SummariesNotFoundException>(async () => await weatherForecastController.GetAsync(5));

            weatherForecastServiceMock
                .Verify(mock => mock.GetAsync(5, CancellationToken.None), Times.Once());
        }

        /// <summary>
        /// Check GetAsync Controller Method Using In Memory Databse In Case of 5 WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_WithWeatherForecast_UsingInMemoryDatabase_Async()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                WeatherForecastService weatherService = new WeatherForecastService(context);

                weatherForecastController = new WeatherForecastController(logger.Object, weatherService);

                IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetAsync(5);

                // Assert
                Assert.Equal(5, context.Forecasts.Count());
                Assert.Equal(5, weatherForecasts.Count());
            }

        }

        /// <summary>
        /// Check GetUnauthenticatedAsync Controller Method Using In Memory Databse In Case of 5 WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_GetUnauthenticated_WithWeatherForecast_UsingInMemoryDatabase_Async()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                WeatherForecastService weatherService = new WeatherForecastService(context);

                weatherForecastController = new WeatherForecastController(logger.Object, weatherService);

                IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetUnauthenticatedAsync(5);

                // Assert
                Assert.Equal(5, context.Forecasts.Count());
                Assert.Equal(5, weatherForecasts.Count());
            }
        }

        /// <summary>
        /// Check GetAsync Controller Method Using In Memory Databse In Case of No WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_WithNoWeatherForecast_UsingInMemoryDatabase_Async()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                WeatherForecastService weatherService = new WeatherForecastService(context);

                weatherForecastController = new WeatherForecastController(logger.Object, weatherService);

                IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetAsync(0);

                // Assert
                Assert.Empty(context.Forecasts);
                Assert.Empty(weatherForecasts);
            }

        }

        /// <summary>
        /// Check GetUnauthenticatedAsync Controller Method Using In Memory Databse In Case of No WeatherForecast
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_GetUnauthenticated_WithNoWeatherForecast_UsingInMemoryDatabase_Async()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                WeatherForecastService weatherService = new WeatherForecastService(context);

                weatherForecastController = new WeatherForecastController(logger.Object, weatherService);

                IEnumerable<WeatherForecast> weatherForecasts = await weatherForecastController.GetUnauthenticatedAsync(0);

                // Assert
                Assert.Empty(context.Forecasts);
                Assert.Empty(weatherForecasts);
            }
        }

        /// <summary>
        /// Check GetAsync Controller Method Using In Memory Databse In Case of Exception Raised
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_WithException_UsingInMemoryDatabase_Async()
        {
            using (WeatherDatabase context = TestDataHelper.GetNotPopulatedDatabaseContext())
            {
                WeatherForecastService weatherService = new WeatherForecastService(context);

                weatherForecastController = new WeatherForecastController(logger.Object, weatherService);

                await Assert.ThrowsAsync<SummariesNotFoundException>(async () => await weatherForecastController.GetAsync(5));
            }

        }

        /// <summary>
        /// Check GetUnauthenticatedAsync Controller Method Using In Memory Databse In Case of Exception Raised
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_GetUnauthenticated_WithException_UsingInMemoryDatabase_Async()
        {
            using (WeatherDatabase context = TestDataHelper.GetNotPopulatedDatabaseContext())
            {
                WeatherForecastService weatherService = new WeatherForecastService(context);

                weatherForecastController = new WeatherForecastController(logger.Object, weatherService);

                await Assert.ThrowsAsync<SummariesNotFoundException>(async () => await weatherForecastController.GetUnauthenticatedAsync(5));
            }
        }
    }
}