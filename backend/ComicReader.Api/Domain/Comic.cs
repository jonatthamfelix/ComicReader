namespace ComicReader.Api.Domain;

public class Comic
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string FilePath { get; set; } = string.Empty;
    public List<Page> Pages { get; set; } = [];
}