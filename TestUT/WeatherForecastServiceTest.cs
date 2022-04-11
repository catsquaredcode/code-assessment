using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TestAPI.Database;
using TestAPI.Services;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using System;

namespace TestUT
{
    public class WeatherForecastServiceTest
    {
        private readonly IWeatherDatabase _context = new WeatherDatabaseTest().CreateContext();
        private WeatherForecastService? _service;

        [SetUp]
        public void Setup()
            => _service = new WeatherForecastService(_context);

        [Test]
        public async Task GetAsync_cancellation()
        {
            var cts = new CancellationTokenSource();
            cts.CancelAfter(TimeSpan.FromMilliseconds(10));

            try
            {
                var result = _service!.GetAsync(1000, cts.Token);
                Assert.IsNotNull(result);
                await result.ToListAsync();
            }
            catch(OperationCanceledException ex)
            {
                Assert.Pass(ex.Message);
            }
        }

        [Test]
        public async Task GetAsync_check_single_result()
        {
            try
            {
                var result = _service!.GetAsync(1, default);

                Assert.IsNotNull(result);
                Assert.That((await result.ToListAsync()).Count == 1);

                Assert.Pass();
            }
            catch(InvalidOperationException)
            {
                Assert.Fail("Test fails when run concurrently with other tests. Try running solo.");
            }
        }

        [Test]
        public async Task GetAsync_zero_or_negative_integer()
        {
            var result = _service!.GetAsync(0, default);

            Assert.IsNotNull(result);
            Assert.IsEmpty(result.ToEnumerable());

            result = _service.GetAsync(-1, default);

            Assert.IsNotNull(result);
            Assert.IsEmpty(await result.ToListAsync());

            Assert.Pass();
        }
    }
}