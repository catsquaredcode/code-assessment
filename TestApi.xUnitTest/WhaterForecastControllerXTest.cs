using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TestAPI.Models;
using TestAPI;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TestApi.xUnitTest
{
    public class WhaterForecastControllerXTest : IClassFixture<WebApplicationFactory<Startup>>
    {
        // common chhtp client instance
        readonly HttpClient _client;


        public WhaterForecastControllerXTest(WebApplicationFactory<Startup> application)
        {
            // assing httpclient instance
            _client = application.CreateClient();
        }

        // test to check response is OK from Api WebForecast
        [Fact]
        public async Task CheckIfReturnsOk()
        {
            // fetch api WebForecast & get a response
            var response = await _client.GetAsync("http://localhost:5100/WeatherForecast/unauthenticated");

            response.EnsureSuccessStatusCode();
            // do the test
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        }

        // test to check if Api response is Ok and returns n days ahead forecast
        [Theory]
        [InlineData(3)] // parametric test
        public async Task CheckIfWFreturnsnDaysAhead(int days)
        {


            // fetch api WebForecast & get a response
            var response = await _client.GetAsync(string.Format("http://localhost:5100/WeatherForecast/unauthenticated/?days={0}", days));

            response.EnsureSuccessStatusCode();

            //deserialize response to a IEnumerable Wheaterforecast object
            var record = Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<WeatherForecast>>(await response.Content.ReadAsStringAsync());

            // do the test 
            Assert.True(record != null && record.Count() == days);

        }
        // test to check if Api WebForecasts response time is less than a spcific thresold
        [Fact]
        public async Task CheckIfWFApiResponseIsLessThen1mSec()
        {
            // initialze a stopWatch object
            var _stopWatch = new System.Diagnostics.Stopwatch();
            _stopWatch.Start();
            // fetch api WebForecast & get a response
            var response = await _client.GetAsync("http://localhost:5100/WeatherForecast/unauthenticated/?days=1");
            response.EnsureSuccessStatusCode();
            // stop the stop watch
            _stopWatch.Stop();
            // do the test
            Assert.True(_stopWatch.ElapsedMilliseconds < 1000, $"Elapsed time: {_stopWatch.ElapsedMilliseconds} mSecs. ");

        }

        // check if datas returned from Api WheaterForecast are consistent
        [Fact]
        public async Task CheckIfresponseDataRConsistent()
        {

            // fetch api WebForecast & get a response
            var response = await _client.GetAsync("http://localhost:5100/WeatherForecast/unauthenticated/?days=10");
            response.EnsureSuccessStatusCode();

            //deserialize response to a IEnumerable Wheaterforecast object
            var record = Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<WeatherForecast>>(await response.Content.ReadAsStringAsync());


            // do the tests
            Assert.True(record != null, "WS returned a null object");
            Assert.True(record.Where(x => string.IsNullOrEmpty(x.Summary)).Count() < 1, $"Some data in recordset are inconsistent: {record.Where(x => string.IsNullOrEmpty(x.Summary)).Count()} records. ");

        }
    }
}
