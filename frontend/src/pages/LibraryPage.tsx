import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { apiGet, apiPost } from '../api/client'
import type { Comic, ComicInput } from '../types/comic'

export function LibraryPage() {
  const [comics, setComics] = useState<Comic[]>([])
  const [filePath, setFilePath] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<Comic[]>('/comics')
      .then(setComics)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleImport(event: FormEvent) {
    event.preventDefault()
    setError('')
    try {
      const input: ComicInput = { filePath }
      const comic = await apiPost<Comic>('/comics', input)
      setComics((current) => [...current, comic])
      setFilePath('')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <main>
      <h1>ComicReader</h1>

      <form onSubmit={handleImport} className="import">
        <input
          value={filePath}
          onChange={(event) => setFilePath(event.target.value)}
          placeholder="C:\Users\voce\Downloads\quadrinho.cbz ou .cbr"
          aria-label="Caminho do arquivo .cbz"
        />
        <button type="submit" disabled={!filePath.trim()}>
          Importar
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Carregando...</p>}
      {!loading && comics.length === 0 && <p>Nenhum quadrinho ainda.</p>}

      <ul className="library">
        {comics.map((comic) => (
          <li key={comic.id}>
            <Link to={`/comics/${comic.id}/pages/1`}>
              <strong>{comic.title}</strong>
              <span>{comic.pages.length} páginas</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}