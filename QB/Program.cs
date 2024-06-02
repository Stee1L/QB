using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using QB.Data;

namespace QB;

public class Program
{
    public static Task Main(string[] args) => 
        WebApplication
            .CreateBuilder(args)
            .SetupBuilder()
            .Build()
            .SetupApplication()
            .InitializeMigrations()
            .RunAsync();
}