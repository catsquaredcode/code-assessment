using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TestAPI.Database;
using TestAPI.Repositories;
using TestAPI.Services;

namespace TestAPI
{
  public class Startup
  {
    #region Public Constructors

    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    #endregion

    #region Properties

    public IConfiguration Configuration { get; }

    #endregion

    #region Public Methods

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TestAPI v1"));

        app.UseCors(options =>
            options.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
        );
      }

      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<WeatherDatabase>(options => options.UseSqlServer("Data Source=(localdb)\\mssqllocaldb;Initial Catalog=Weather;Integrated Security=True;"));
      services.AddScoped<IWeatherDatabase>(sp => sp.GetRequiredService<WeatherDatabase>());

      services.AddControllers();
      services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "TestAPI", Version = "v1" }); });

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
      {
        options.TokenValidationParameters ??= new TokenValidationParameters();
        options.TokenValidationParameters.ValidIssuer = Configuration["JWT:Issuer"];
        options.TokenValidationParameters.ValidateAudience = false;
      });

      services.AddTransient<IWeatherRepository, WeatherRepository>();
      services.AddTransient<IWeatherForecastService, WeatherForecastService>();
    }

    #endregion
  }
}
