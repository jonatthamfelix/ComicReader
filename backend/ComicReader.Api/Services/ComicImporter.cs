using System.Text.RegularExpressions;
using ComicReader.Api.Domain;
using SharpCompress.Archives;

namespace ComicReader.Api.Services;

public static class ComicImporter
{
    private static readonly string[] ImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"];

    public static List<Page> ReadPages(string filePath)
    {
        using var archive = ArchiveFactory.OpenArchive(filePath);

        var names = archive.Entries
            .Where(entry => !entry.IsDirectory)
            .Select(entry => entry.Key ?? string.Empty)
            .Where(name => ImageExtensions.Contains(Path.GetExtension(name).ToLowerInvariant()))
            .OrderBy(name => Regex.Replace(name, @"\d+", m => m.Value.PadLeft(10, '0')))
            .ToList();

        return names
            .Select((name, index) => new Page { Number = index + 1, EntryName = name })
            .ToList();
    }

    public static byte[]? ReadPageBytes(string filePath, string entryName)
    {
        using var archive = ArchiveFactory.OpenArchive(filePath);

        var entry = archive.Entries.FirstOrDefault(e => e.Key == entryName);
        if (entry is null) return null;

        using var entryStream = entry.OpenEntryStream();
        using var memory = new MemoryStream();
        entryStream.CopyTo(memory);
        return memory.ToArray();
    }
}
