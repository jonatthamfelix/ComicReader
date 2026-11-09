using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
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
    Console.Title = "ComicReader — feche esta janela para sair";

    var url = app.Urls.FirstOrDefault() ?? "http://localhost:5039";
    var port = new Uri(url).Port;

    // já existe uma instância rodando: só traz o navegador de volta e sai
    if (IsListening(port))
    {
        OpenBrowser(url);
        return;
    }

    app.Lifetime.ApplicationStarted.Register(() => OpenBrowser(url));
}

app.Run();

static bool IsListening(int port)
{
    try
    {
        using var client = new TcpClient();
        client.Connect(IPAddress.Loopback, port);
        return true;
    }
    catch (SocketException)
    {
        return false;
    }
}

static void OpenBrowser(string url) =>
    Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });