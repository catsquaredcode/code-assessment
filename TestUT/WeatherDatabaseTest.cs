using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestAPI.Database;

namespace TestUT
{
    internal class WeatherDatabaseTest : IDisposable
    {
        private readonly DbConnection _connection;
        private readonly DbContextOptions<WeatherDatabase> _contextOptions;

        public WeatherDatabaseTest()
        {
            _connection = new SqliteConnection("Filename=:memory:");
            _connection.Open();

            _contextOptions = new DbContextOptionsBuilder<WeatherDatabase>()
                .UseSqlite(_connection).Options;
        }

        public WeatherDatabase CreateContext()
        {
            var context = new WeatherDatabase(_contextOptions);
            context.Database.EnsureCreated();
            return context;
        }

        public void Dispose() => _connection.Dispose();
    }
}
