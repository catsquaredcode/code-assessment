using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestAPI.Models;

namespace TestAPI.Common
{
  public class MockSummaryData
  {
    #region Fields

    private static readonly MockSummaryData _singleton = new MockSummaryData();

    #endregion

    #region Public Methods

    public static MockSummaryData GetSingleton() => _singleton;

    public Summary[] Data()
    {
      return new Summary[]{
        new Summary{Id = "Freezing",CelsiusLow = null,CelsiusHigh = 5},
        new Summary{Id = "Chilly",CelsiusLow = 5,CelsiusHigh = 10},
        new Summary{Id = "Cool",CelsiusLow = 10,CelsiusHigh = 15},
        new Summary{Id = "Mild",CelsiusLow = 15,CelsiusHigh = 20},
        new Summary{Id = "Warm",CelsiusLow = 20,CelsiusHigh = 25},
        new Summary{Id = "Balmy",CelsiusLow = 25,CelsiusHigh = 30},
        new Summary{Id = "Hot",CelsiusLow = 30,CelsiusHigh = 35},
        new Summary{Id = "Sweltering",CelsiusLow = 35,CelsiusHigh = 40},
        new Summary{Id = "Scorching",CelsiusLow = 40,CelsiusHigh = null}
      };
    }

    #endregion
  }
}
