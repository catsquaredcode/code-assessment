using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestAPI.Database;
using TestAPI.Models;
using Xunit;

namespace TestAPI_UnitTest
{
    public class WeatherDatabase_Tests
    {
        /// <summary>
        /// Check If In Memory Database Is Populated Correctly
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task CheckTestDatabaseDataPopulation()
        {
            using (WeatherDatabase context = TestDataHelper.GetDatabaseContext())
            {
                // Check if Summary Count is correct
                Assert.Equal(TestDataHelper.GetFakeSummariesList().Count(), context.Summaries.Count());

                // Check if all Summaries was added to Test Database
                foreach (Summary summary in TestDataHelper.GetFakeSummariesList())
                {
                    Assert.Contains(summary, context.Summaries);
                }
            }

            await Task.CompletedTask;
        }
    }
}
