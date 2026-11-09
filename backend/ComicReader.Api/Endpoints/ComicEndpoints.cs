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
            Results.Ok(await db.Comics
                .Include(c => c.Pages)
                .OrderByDescending(c => c.LastReadAt ?? DateTime.MinValue)
                .ThenBy(c => c.Title)
                .ToListAsync()));

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
                Pages = ComicImporter.ReadPages(input.FilePath)
            };

            db.Comics.Add(comic);
            await db.SaveChangesAsync();

            return Results.Created($"/api/comics/{comic.Id}", comic);
        });

        app.MapGet("/api/comics/{id:int}", async (int id, ComicReaderDbContext db) =>
        {
            var comic = await db.Comics
                .Include(c => c.Pages.OrderBy(p => p.Number))
                .FirstOrDefaultAsync(c => c.Id == id);

            return comic is null ? Results.NotFound() : Results.Ok(comic);
        });

        app.MapGet("/api/comics/{id:int}/cover", async (int id, HttpContext http, ComicReaderDbContext db) =>
        {
            var comic = await db.Comics
                .Include(c => c.Pages.OrderBy(p => p.Number))
                .FirstOrDefaultAsync(c => c.Id == id);

            var cover = comic?.Pages.FirstOrDefault();
            if (comic is null || cover is null || !File.Exists(comic.FilePath)) return Results.NotFound();

            var bytes = ComicImporter.ReadPageBytes(comic.FilePath, cover.EntryName);
            if (bytes is null) return Results.NotFound();

            http.Response.Headers.CacheControl = "public, max-age=86400";
            return Results.File(bytes, ContentTypeFor(cover.EntryName));
        });

        app.MapGet("/api/comics/{id:int}/pages/{number:int}", async (int id, int number, ComicReaderDbContext db) =>
        {
            var comic = await db.Comics.FindAsync(id);
            if (comic is null) return Results.NotFound();

            var page = await db.Pages.FirstOrDefaultAsync(p => p.ComicId == id && p.Number == number);
            if (page is null) return Results.NotFound();

            if (!File.Exists(comic.FilePath)) return Results.NotFound();

            var bytes = ComicImporter.ReadPageBytes(comic.FilePath, page.EntryName);
            if (bytes is null) return Results.NotFound();

            // throttle: uma escrita por página trocada ou a cada minuto, não a cada request
            if (comic.LastPageNumber != number || comic.LastReadAt is null
                || DateTime.UtcNow - comic.LastReadAt.Value > TimeSpan.FromMinutes(1))
            {
                comic.LastPageNumber = number;
                comic.LastReadAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
            }

            return Results.File(bytes, ContentTypeFor(page.EntryName));
        });

        return app;
    }

    private static string ContentTypeFor(string fileName) => Path.GetExtension(fileName).ToLowerInvariant() switch
    {
        ".png" => "image/png",
        ".webp" => "image/webp",
        ".gif" => "image/gif",
        ".bmp" => "image/bmp",
        _ => "image/jpeg",
    };
}