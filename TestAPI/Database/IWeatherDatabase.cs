using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TestAPI.Models;
namespace TestAPI.Database
{
    public interface IWeatherDatabase
    {
        DbSet<Summary> Summaries { get; set; }
        DbSet<Forecast> Forecasts { get; set; }
        Task<Dictionary<DateTime, Forecast>> GetForecastsByDate(DateTime startDate, DateTime endDate, CancellationToken token);
        Task<List<Summary>> GetSummariesAsAList(CancellationToken token);
        void AddToForecasts(Forecast forecast);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        void Migrate();
    }
}
