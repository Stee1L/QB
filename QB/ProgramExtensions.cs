using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using QB.Data;
using QB.Models;
namespace QB;

public static class ProgramExtensions
{
    public static WebApplicationBuilder SetupBuilder(this WebApplicationBuilder builder)
    {
        builder.Services.SetupServices(builder.Configuration);
        return builder;
    }
    
    public static WebApplication InitializeMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
        return app;
    }
    
    public static WebApplication SetupApplication(this WebApplication app)
    {
        app.UseCors("Any");

        app.UseSwagger();
        app.UseSwaggerUI(c => { c.SwaggerEndpoint("v1/swagger.json", "Items WebApi v1"); });

        app.UseStaticFiles();

        app.UseRouting();
        //
        app.UseAuthentication();
        app.UseAuthorization();
        //
        app.MapControllers();
        return app;
    }
    
    private static IServiceCollection SetupServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options => options.AddPolicy("Any", policyBuilder =>
        {
            policyBuilder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }));

        services.AddDbContext<AppDbContext>(options =>
        {
            var dbType = configuration["CurrentDatabaseConnectionString"];
            switch (dbType)
            {
                case "PostgreSQL":
                {
                    options.UseNpgsql(configuration.GetConnectionString(dbType));
                    break;
                }
                case "SQLServer":
                {
                    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
                    break;
                }
            }
        });
        
        services.AddIdentity<UserModel, UserIdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? throw new ArgumentNullException(configuration["Jwt:Key"])))
            };
        });

        services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "API QB",
                Version = "v1",
                Description = "Web API QB"
            });
        });
        return services;
    }
}