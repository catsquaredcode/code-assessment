using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
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

	public virtual DbSet<Summary> Summaries { get; set; }

	public virtual DbSet<Forecast> Forecasts { get; set; }

	void IWeatherDatabase.Migrate()
	{
	  Database.Migrate();
	}

	/// <summary>
	/// Retrieves the forecasts from the dbset by a date range.
	/// </summary>
	/// <param name="startDate"></param>
	/// <param name="endDate"></param>
	/// <param name="token"></param>
	/// <returns></returns>
	public async Task<Dictionary<DateTime,Forecast>> GetForecastsByDate(DateTime startDate, DateTime endDate, CancellationToken token)
	{
		return await this.Forecasts.Include(x => x.Summary).Where(x => x.Id >= startDate && x.Id < endDate).ToDictionaryAsync(x => x.Id, token);
	}

	/// <summary>
	/// Gets the summary dbset in a list format.
	/// </summary>
	/// <param name="token"></param>
	/// <returns></returns>
	public async Task<List<Summary>> GetSummariesAsAList(CancellationToken token)
	{
        return await this.Summaries.AsQueryable().ToListAsync(token);
    }

	/// <summary>
	/// Adds a forecast to the dbset.
	/// </summary>
	/// <param name="forecast"></param>
	public void AddToForecasts(Forecast forecast)
	{
		this.Forecasts.Add(forecast);
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
	  modelBuilder.Entity<Summary>().HasData(new Summary
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
	  });

	  base.OnModelCreating(modelBuilder);
	}
  }
}