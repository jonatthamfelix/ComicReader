using ComicReader.Api.Data;
using ComicReader.Api.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ComicReaderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ComicReader")));

var app = builder.Build();

app.MapHealthEndpoints();
app.MapComicEndpoints();

app.Run();