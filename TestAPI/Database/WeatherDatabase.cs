using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TestAPI.Models;

namespace TestAPI.Database
{
    public class WeatherDatabase : DbContext, IWeatherDatabase
    {
        public WeatherDatabase(DbContextOptions<WeatherDatabase> options) : base(options)
        {
        }

        //I changed to private both Summaries and Forecasts, in order to forse the repository pattern, that allow the IWeatherDatabase mocking in unit tests
        private DbSet<Summary> Summaries { get; set; }

        private DbSet<Forecast> Forecasts { get; set; }

        void IWeatherDatabase.Migrate()
        {
            Database.Migrate();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Summary>().HasData(WeatherDatabaseData.GetDefaultSummaries());

            base.OnModelCreating(modelBuilder);
        }

        #region Added methods for unit test mocking

        public async Task<IDictionary<DateTime, Forecast>> GetForecastsAsync(DateTime startDate, DateTime endDate, CancellationToken token)
        {
            return await Forecasts.Include(x => x.Summary).Where(x => x.Id >= startDate && x.Id < endDate).ToDictionaryAsync(x => x.Id, token);
        }

        public void AddForecast(Forecast forecast)
        {
            Forecasts.Add(forecast);
        }

        public async Task<IEnumerable<Summary>> GetSummariesAsync(CancellationToken token)
        {
            return await Summaries.AsQueryable().ToListAsync(token);
        }
        #endregion
    }
}