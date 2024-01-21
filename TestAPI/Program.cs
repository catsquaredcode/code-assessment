using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TestAPI.Database;

namespace TestAPI
{
  public class Program
  {
    #region Public Methods

    public static IHostBuilder CreateHostBuilder(string[] args)
    {
      return Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }

    public static void Main(string[] args)
    {
      var host = CreateHostBuilder(args).Build();

      using (var scope = host.Services.CreateScope())
      {
        scope.ServiceProvider.GetRequiredService<IWeatherDatabase>().Migrate();
      }

      host.Run();
    }

    #endregion
  }
}
