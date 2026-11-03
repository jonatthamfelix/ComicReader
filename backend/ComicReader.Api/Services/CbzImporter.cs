using System.IO.Compression;
using System.Text.RegularExpressions;
using ComicReader.Api.Domain;

namespace ComicReader.Api.Services;

public static class CbzImporter
{
    private static readonly string[] ImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"];

    public static List<Page> ReadPages(string filePath)
    {
        using var zip = ZipFile.OpenRead(filePath);

        var names = zip.Entries
            .Select(entry => entry.FullName)
            .Where(name => ImageExtensions.Contains(Path.GetExtension(name).ToLowerInvariant()))
            .OrderBy(name => Regex.Replace(name, @"\d+", m => m.Value.PadLeft(10, '0')))
            .ToList();

        return names
            .Select((name, index) => new Page { Number = index + 1, EntryName = name })
            .ToList();
    }
}