using System.Collections.Generic;
using System.Linq;
namespace TestAPI.Models
{
    public class SummaryList : List<Summary>
    {
        public Summary GetSummaries(int celsius)
        {
            return this.Single(s => (!s.CelsiusLow.HasValue || celsius >= s.CelsiusLow.Value) && (!s.CelsiusHigh.HasValue || celsius < s.CelsiusHigh.Value));
        }
    }
}
