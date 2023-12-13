using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using Moq.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Database;
using TestAPI.Exceptions;
using TestAPI.Models;
using TestAPI.Services;
using Xunit;

namespace TestAPI_UnitTest
{
    public class WeatherForecastService_Tests
    {
        /// <summary>
        /// Check GetAsync Service Method Using In Memory Databse In Case of Negative Number
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_NegativeAsync()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                //Create service using context
                WeatherForecastService weatherService = new WeatherForecastService(context);

                // Act
                List<WeatherForecast> result = await weatherService.GetAsync(-1, CancellationToken.None).ToListAsync();

                // Assert
                Assert.Empty(context.Forecasts);
                Assert.Empty(result);
            }
        }

        /// <summary>
        /// Check GetAsync Service Method Using In Memory Databse In Case of Zero Number
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_ZeroAsync()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                //Create service using context
                WeatherForecastService weatherService = new WeatherForecastService(context);

                // Act
                List<WeatherForecast> result = await weatherService.GetAsync(0, CancellationToken.None).ToListAsync();

                // Assert
                Assert.Empty(context.Forecasts);
                Assert.Empty(result);
            }
        }

        /// <summary>
        /// Check GetAsync Service Method Using In Memory Databse In Case of Positive Number
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_PositiveAsync()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                //Create service using context
                WeatherForecastService weatherService = new WeatherForecastService(context);

                // Act
                List<WeatherForecast> result = await weatherService.GetAsync(5, CancellationToken.None).ToListAsync();

                // Assert
                Assert.Equal(5, context.Forecasts.Count());
                Assert.Equal(5, result.Count());
            }
        }

        /// <summary>
        /// Check GetAsync Service Method Using In Memory Databse In Case of NotPopulatedDatabaseContext
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task Check_Get_Positive_WithNotPopulatedDatabaseAsync()
        {
            using (WeatherDatabase context = TestDataHelper.GetNotPopulatedDatabaseContext())
            {
                //Create service using context
                WeatherForecastService weatherService = new WeatherForecastService(context);

                // Act
                await Assert.ThrowsAsync<SummariesNotFoundException>(async () => await weatherService.GetAsync(5, CancellationToken.None).ToListAsync());
            }
        }
    }
}
