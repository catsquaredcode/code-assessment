using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TestAPI.Models;

namespace TestAPI.Database
{
    public interface IWeatherDatabase
    {
        DbSet<Forecast> Forecasts { get; set; }
        DbSet<Summary> Summaries { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        void Migrate();
    }
}