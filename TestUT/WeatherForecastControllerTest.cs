using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TestAPI.Database;
using TestAPI.Services;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using System;
using TestAPI.Controllers;
using Microsoft.Extensions.Logging.Abstractions;

namespace TestUT
{
    public class WeatherForecastControllerTest
    {
        private readonly IWeatherDatabase _context = new WeatherDatabaseTest().CreateContext();
        private WeatherForecastController? _controller;
        
        [SetUp]
        public void Setup()
            => _controller = new WeatherForecastController(new NullLogger<WeatherForecastController>(), new WeatherForecastService(_context));

        #region GetAsync

        [Test]
        public async Task GetAsync_cancellation()
        {
            var cts = new CancellationTokenSource();
            cts.CancelAfter(TimeSpan.FromMilliseconds(10));

            try
            {
                await _controller!.GetAsync(1000, cts.Token);
            }
            catch (OperationCanceledException ex)
            {
                Assert.Pass(ex.Message);
            }
        }

        [Test]
        public async Task GetAsync_check_single_result()
        {
            var result = await _controller!.GetAsync(1, default);

            Assert.IsNotNull(result);
            Assert.That(result.Count() == 1);

            Assert.Pass();
        }

        [Test]
        public async Task GetAsync_zero_or_negative_integer()
        {
            var result = await _controller!.GetAsync(0, default);

            Assert.IsNotNull(result);
            Assert.IsEmpty(result);

            result = await _controller.GetAsync(-1, default);

            Assert.IsNotNull(result);
            Assert.IsEmpty(result);

            Assert.Pass();
        }

        #endregion

        #region GetUnauthenticatedAsync

        [Test]
        public async Task GetUnauthenticatedAsync_cancellation()
        {
            var cts = new CancellationTokenSource();
            cts.CancelAfter(TimeSpan.FromMilliseconds(10));

            try
            {
                await _controller!.GetUnauthenticatedAsync(1000, cts.Token);
            }
            catch (OperationCanceledException ex)
            {
                Assert.Pass(ex.Message);
            }
        }

        [Test]
        public async Task GetUnauthenticatedAsync_check_single_result()
        {
            var result = await _controller!.GetUnauthenticatedAsync(1, default);

            Assert.IsNotNull(result);
            Assert.That(result.Count() == 1);

            Assert.Pass();
        }

        [Test]
        public async Task GetUnauthenticatedAsync_zero_or_negative_integer()
        {
            var result = await _controller!.GetUnauthenticatedAsync(0, default);

            Assert.IsNotNull(result);
            Assert.IsEmpty(result);

            result = await _controller.GetUnauthenticatedAsync(-1, default);

            Assert.IsNotNull(result);
            Assert.IsEmpty(result);

            Assert.Pass();
        }

        #endregion
    }
}