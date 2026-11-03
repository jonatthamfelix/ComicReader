using ComicReader.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace ComicReader.Api.Data;

public class ComicReaderDbContext(DbContextOptions<ComicReaderDbContext> options) : DbContext(options)
{
    public DbSet<Comic> Comics => Set<Comic>();
    public DbSet<Page> Pages => Set<Page>();
}