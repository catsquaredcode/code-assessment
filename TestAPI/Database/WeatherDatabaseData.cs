using System.Collections.Generic;
using TestAPI.Models;

namespace TestAPI.Database
{
    public class WeatherDatabaseData
    {
        //I moved here default data, in this way they are sharable with the unit test
        public static IEnumerable<Summary> GetDefaultSummaries()
        {
            return new List<Summary>() {new Summary
              {
                Id = "Freezing",
                CelsiusLow = null,
                CelsiusHigh = 5
              }, new Summary
              {
                Id = "Chilly",
                CelsiusLow = 5,
                CelsiusHigh = 10
              }, new Summary
              {
                Id = "Cool",
                CelsiusLow = 10,
                CelsiusHigh = 15
              }, new Summary
              {
                Id = "Mild",
                CelsiusLow = 15,
                CelsiusHigh = 20
              }, new Summary
              {
                Id = "Warm",
                CelsiusLow = 20,
                CelsiusHigh = 25
              }, new Summary
              {
                Id = "Balmy",
                CelsiusLow = 25,
                CelsiusHigh = 30
              }, new Summary
              {
                Id = "Hot",
                CelsiusLow = 30,
                CelsiusHigh = 35
              }, new Summary
              {
                Id = "Sweltering",
                CelsiusLow = 35,
                CelsiusHigh = 40
              }, new Summary
              {
                Id = "Scorching",
                CelsiusLow = 40,
                CelsiusHigh = null
              } };
        }
    }
}

