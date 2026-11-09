using System.Diagnostics;
using ComicReader.Api.Data;
using ComicReader.Api.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ComicReaderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ComicReader")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapHealthEndpoints();
app.MapComicEndpoints();

app.MapFallbackToFile("index.html");

// publicado (sem launchSettings) abre o navegador sozinho; em dev quem abre é o Vite
if (app.Environment.IsProduction())
{
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var url = app.Urls.FirstOrDefault() ?? "http://localhost:5039";
        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    });
}

app.Run();