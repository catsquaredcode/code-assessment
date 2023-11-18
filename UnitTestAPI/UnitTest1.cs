using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using TestAPI.Database;
using TestAPI.Models;
namespace UnitTestAPI
{
        public class DbServices
        {
            private readonly WeatherDatabase _weatherDatabase;
            public DbServices(WeatherDatabase weatherDatabase)
            {
                _weatherDatabase = weatherDatabase;
            }
        }
        public class Tests
        {
            private WeatherDatabase myDb;
            private SummaryList summaries;
            [SetUp]
            public void Setup()
            {
                var optionsBuilder = new DbContextOptionsBuilder<WeatherDatabase>();
                optionsBuilder.UseSqlServer(WeatherDatabase.ConnectionString);

                myDb = new WeatherDatabase(optionsBuilder.Options);

                summaries = new();
                summaries.AddRange(myDb.Summaries.AsQueryable().ToList());
            }

            [Test]
            public void TestConnection()
            {
                try
                {
                    SqlConnection conn = new SqlConnection(TestAPI.Database.WeatherDatabase.ConnectionString);
                    conn.Open();
                    conn.Close();
                }
                catch (Exception Ex)
                {
                    Assert.Fail(Ex.Message);
                }

            }
            [Test]
            public void TestSummary()
            {


                var summary = summaries.GetSummaries(-5);

                Assert.IsTrue(summary.Id.Equals("Freezing"));
                summary = summaries.GetSummaries(15);

                Assert.IsTrue(summary.Id.Equals("Mild"));

                //Etc...
            }
            [Test]
            public void TestInsert()
            {
                DateTime DtTest = new DateTime(1900, 1, 1);


                var forecast = myDb.Forecasts.Find(DtTest);

                if (forecast != null)
                {
                    myDb.Forecasts.Remove(forecast);
                    myDb.SaveChanges();
                }
                Summary summary = summaries.GetSummaries(15);
                forecast = new Forecast
                {
                    Celsius = 15,
                    Id = DtTest,
                    SummaryId = summary.Id,
                    Summary = summary
                };

                myDb.Forecasts.Add(forecast);
                myDb.SaveChanges();

                forecast = myDb.Forecasts.Find(DtTest);
                Assert.IsTrue(forecast != null);

                myDb.Forecasts.Remove(forecast);
                myDb.SaveChanges();

                forecast = myDb.Forecasts.Find(DtTest);
                Assert.IsTrue(forecast == null);


                //Etc...
            }
        }
    }