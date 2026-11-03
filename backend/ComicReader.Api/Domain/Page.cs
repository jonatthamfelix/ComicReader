namespace ComicReader.Api.Domain;

public class Page
{
    public int Id { get; set; }
    public int ComicId { get; set; }
    public int Number { get; set; }
    public string EntryName { get; set; } = string.Empty;
}