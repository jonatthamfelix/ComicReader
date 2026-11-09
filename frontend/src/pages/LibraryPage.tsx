import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../api/client'
import { ComicCard } from '../components/ComicCard'
import type { Comic } from '../types/comic'

export function LibraryPage() {
  const [comics, setComics] = useState<Comic[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<Comic[]>('/comics')
      .then(setComics)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const { recent, rest } = useMemo(() => {
    const withProgress = comics
      .filter((comic) => comic.lastReadAt)
      .sort((a, b) => (b.lastReadAt ?? '').localeCompare(a.lastReadAt ?? ''))
    const recentSlice = withProgress.slice(0, 6)
    return {
      recent: recentSlice,
      rest: comics.filter((comic) => !recentSlice.includes(comic)),
    }
  }, [comics])

  if (error) return <main><p className="error">{error}</p></main>
  if (loading) return <main><p>Carregando...</p></main>

  return (
    <main>
      <h1>Biblioteca</h1>

      {comics.length === 0 && (
        <p className="empty">
          Nenhum quadrinho ainda. Vá em <strong>Importar</strong> no menu.
        </p>
      )}

      {recent.length > 0 && (
        <section>
          <h2>Continue lendo</h2>
          <div className="grid">
            {recent.map((comic) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                progress={comic.lastPageNumber ? comic.lastPageNumber / comic.pages.length : 0}
              />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2>{recent.length > 0 ? 'Todos' : 'Quadrinhos'}</h2>
          <div className="grid">
            {rest.map((comic) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                progress={comic.lastPageNumber ? comic.lastPageNumber / comic.pages.length : 0}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}