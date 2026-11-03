using ComicReader.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace ComicReader.Api.Endpoints;

public static class ComicEndpoints
{
    public static IEndpointRouteBuilder MapComicEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/comics", async (ComicReaderDbContext db) =>
            Results.Ok(await db.Comics.ToListAsync()));

        return app;
    }
}