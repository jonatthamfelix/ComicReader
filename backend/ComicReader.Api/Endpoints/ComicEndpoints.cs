using ComicReader.Api.Data;
using ComicReader.Api.Domain;
using ComicReader.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace ComicReader.Api.Endpoints;

public record ComicInput(string FilePath, string? Title);

public static class ComicEndpoints
{
    public static IEndpointRouteBuilder MapComicEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/comics", async (ComicReaderDbContext db) =>
            Results.Ok(await db.Comics.Include(c => c.Pages).ToListAsync()));

        app.MapPost("/api/comics", async (ComicInput input, ComicReaderDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(input.FilePath))
                return Results.BadRequest(new { error = "FilePath é obrigatório." });

            if (!File.Exists(input.FilePath))
                return Results.BadRequest(new { error = $"Arquivo não encontrado: {input.FilePath}" });

            var comic = new Comic
            {
                Title = string.IsNullOrWhiteSpace(input.Title)
                    ? Path.GetFileNameWithoutExtension(input.FilePath)
                    : input.Title.Trim(),
                FilePath = input.FilePath,
                Pages = CbzImporter.ReadPages(input.FilePath)
            };

            db.Comics.Add(comic);
            await db.SaveChangesAsync();

            return Results.Created($"/api/comics/{comic.Id}", comic);
        });

        return app;
    }
}