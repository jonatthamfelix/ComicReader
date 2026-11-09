export type Page = {
  id: number
  comicId: number
  number: number
  entryName: string
}

export type Comic = {
  id: number
  title: string
  filePath: string
  pages: Page[]
  lastPageNumber: number | null
  lastReadAt: string | null
}

export type ComicInput = {
  filePath: string
  title?: string
}
