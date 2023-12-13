using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Controllers;
using TestAPI.Database;
using TestAPI.Models;
using TestAPI.Services;
using Xunit;

namespace TestAPI_Test
{
    public class WeatherForecastControllerTests
    {
        [Fact]
        public async Task GetUnauthenticatedAsync_ReturnsWeatherForecasts_WithoutAuthorization()
        {
            
        }
    }
}