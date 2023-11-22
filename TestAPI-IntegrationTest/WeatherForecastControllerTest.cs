using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using TestAPI;

namespace TestAPI_IntegrationTest
{
    public class WeatherForecastControllerTest : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _webApplicationFactory;
        private IConfiguration _configuration;

        public WeatherForecastControllerTest(WebApplicationFactory<Program> webApplicationFactory)
        {
            _webApplicationFactory = webApplicationFactory;
            _configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();
        }

        [Theory]
        [InlineData("/WeatherForecast/unauthenticated")]
        public async Task Get_EndpointsReturnSuccess(string url)
        {
            // Arrange
            var client = _webApplicationFactory.CreateClient();

            // Act
            var response = await client.GetAsync(url);

            // Assert
            Assert.True(response.IsSuccessStatusCode);
        }

        [Theory]
        [InlineData("/WeatherForecast/")]
        public async Task Get_EndpointsReturnUnauthenticated(string url)
        {
            // Arrange
            var client = _webApplicationFactory.CreateClient();

            // Act
            var response = await client.GetAsync(url);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Theory]
        [InlineData("/WeatherForecast/")]
        public async Task Get_EndpointsReturnAuthenticated(string url)
        {
            // Arrange
            var client = _webApplicationFactory.CreateClient();

            // Act
            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);
            httpRequestMessage.Headers.Add("Authorization", "Bearer " + GetValidToken());
            var response = await client.SendAsync(httpRequestMessage);

            // Assert
            Assert.True(response.IsSuccessStatusCode);
        }

        private string GetValidToken()
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var sectoken = new JwtSecurityToken(_configuration["JWT:Issuer"],
                _configuration["JWT:Issuer"],
                null,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            var token = new JwtSecurityTokenHandler().WriteToken(sectoken);
            return token;
        }
    }
}