using System;

namespace TestAPI.Models
{
  public class Forecast
  {
    #region Properties

    public int Celsius { get; set; }

    public DateTime Id { get; set; }

    public virtual Summary Summary { get; set; }

    public string SummaryId { get; set; }

    #endregion
  }
}
