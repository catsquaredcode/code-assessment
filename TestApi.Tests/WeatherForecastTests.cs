using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TestAPI;
using TestAPI.Database;
using TestAPI.Services;
using Xunit;

namespace TestApi.Tests
{
    public class WeatherForecastTests : IAsyncLifetime
    {
        private IWeatherForecastService _weatherForecastService;
        private IWeatherDatabase _weatherDatabase;
        private HttpClient _client;

        public WeatherForecastTests()
        {
        }

        [Fact]
        public async void Forecasts_ShouldBe_AsMany_AsRequired()
        {
            var requiredForecasts = 1_000;
            var source = new CancellationTokenSource();
            var result = await _weatherForecastService.GetAsync(requiredForecasts, source.Token).ToListAsync(source.Token);
            Assert.Equal(requiredForecasts, result.Count);
        }

        [Fact]
        public async void Forecasts_ShouldBe_Saved()
        {
            var requiredForecasts = 10;
            var source = new CancellationTokenSource();
            var _ = await _weatherForecastService.GetAsync(requiredForecasts, source.Token).ToListAsync(source.Token);
            var forecastsCount = _weatherDatabase.Forecasts.Count();
            Assert.Equal(requiredForecasts, forecastsCount);
        }

        [Theory]
        [InlineData(int.MinValue)]
        [MemberData(nameof(GetData))]
        [InlineData(int.MaxValue)]
        public void Every_Celsius_Value_Should_Return_Only_One_Summary(int celsius)
        {
            var summaries = _weatherDatabase.Summaries.ToList();
            var exception = Record.Exception(() => _weatherForecastService.CalculateSummary(summaries, celsius));
            Assert.Null(exception);
        }

        [Fact]
        public async void StatusCode_ShouldBe_Unauthorized_With_Unauthenticated_User()
        {
            var result = await _client.GetAsync("weatherforecast");
            Assert.True(result.StatusCode == HttpStatusCode.Unauthorized);

        }

        [Fact]
        public async void StatusCode_ShouldBe_Ok_With_Authenticated_User()
        {
            var token = BuildToken(DateTime.UtcNow.AddHours(1));
            _client.DefaultRequestHeaders.Add("Authorization", $"{JwtBearerDefaults.AuthenticationScheme} {token}");
            var result = await _client.GetAsync("weatherforecast");
            Assert.True(result.StatusCode == HttpStatusCode.OK);

        }

        [Fact]
        public async void StatusCode_ShouldBe_Unauthorized_With_Expired_Token()
        {
            var token = BuildToken(DateTime.UtcNow.AddMinutes(-1));
            _client.DefaultRequestHeaders.Add("Authorization", $"{JwtBearerDefaults.AuthenticationScheme} {token}");
            var result = await _client.GetAsync("weatherforecast");
            Assert.True(result.StatusCode == HttpStatusCode.Unauthorized);

        }

        [Fact]
        public async void StatusCode_ShouldBe_Ok_With_Unauthenticated_User()
        {
            var result = await _client.GetAsync("WeatherForecast/unauthenticated");
            Assert.True(result.IsSuccessStatusCode);

        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(int.MinValue)]
        public async void Exception_ShouldBe_Throw_With_ZeroOrNegativeDays(int days)
        {
            var source = new CancellationTokenSource();
            await Assert.ThrowsAsync<ArgumentOutOfRangeException>(async () => await _weatherForecastService.GetAsync(days, source.Token).ToListAsync(source.Token));
        }

        private string BuildToken(DateTime expirationDate)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Strong@SecurityKey!"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claimsForToken = new List<Claim> { new Claim("sub", "11") };

            var jwtToken = new JwtSecurityToken(
                "Cat2",
                "NotChecked",
                claimsForToken,
                null,
                expirationDate,
                credentials);

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        public static IEnumerable<object[]> GetData()
        {
            for (int i = -20; i <= 55; i++)
            {
                yield return new object[] { i };
            }

        }

        public Task InitializeAsync()
        {
            var waf = new WebApplicationFactory<Startup>()
                .WithWebHostBuilder(builder =>
                {

                    builder.ConfigureTestServices(services =>
                    {
                        services.RemoveAll<DbContextOptions<WeatherDatabase>>();

                        var inMemorySqlite = new SqliteConnection("Data Source=:memory:");

                        services.AddDbContext<WeatherDatabase>(x => x.UseSqlite(inMemorySqlite));

                        inMemorySqlite.Open();

                        var sp = services.BuildServiceProvider();
                        using var scope = sp.CreateScope();
                        var scopedServices = scope.ServiceProvider;
                        var db = scopedServices.GetRequiredService<IWeatherDatabase>();
                        db.Migrate();
                    });
                });

            var scope = waf.Services.CreateScope();
            _weatherForecastService = scope.ServiceProvider.GetRequiredService<IWeatherForecastService>();
            _weatherDatabase = scope.ServiceProvider.GetService<IWeatherDatabase>();
            _client = waf.CreateClient();
            return Task.CompletedTask;
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }
    }
}
