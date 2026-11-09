import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { apiGet } from '../api/client'
import type { Comic } from '../types/comic'

export function ReaderPage() {
  const { id, number } = useParams()
  const navigate = useNavigate()
  const [comic, setComic] = useState<Comic | null>(null)
  const [error, setError] = useState('')

  const pageNumber = Number(number)

  useEffect(() => {
    apiGet<Comic>(`/comics/${id}`)
      .then(setComic)
      .catch((e: Error) => setError(e.message))
  }, [id])

  const go = useCallback(
    (target: number) => {
      if (!comic) return
      if (target < 1 || target > comic.pages.length) return
      navigate(`/comics/${comic.id}/pages/${target}`)
    },
    [comic, navigate],
  )

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') go(pageNumber + 1)
      if (event.key === 'ArrowLeft') go(pageNumber - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, pageNumber])

  if (error) return <main><p className="error">{error}</p></main>
  if (!comic) return <main><p>Carregando...</p></main>

  return (
    <div className="reader">
      <header className="reader-header">
        <Link to="/">← Biblioteca</Link>
        <strong className="reader-title">{comic.title}</strong>
        <span className="reader-counter">
          {pageNumber} / {comic.pages.length}
        </span>
      </header>

      <img
        className="reader-image"
        src={`/api/comics/${comic.id}/pages/${pageNumber}`}
        alt={`Página ${pageNumber} de ${comic.title}`}
      />

      <nav className="reader-nav">
        <button onClick={() => go(pageNumber - 1)} disabled={pageNumber <= 1}>
          Anterior
        </button>
        <button onClick={() => go(pageNumber + 1)} disabled={pageNumber >= comic.pages.length}>
          Próxima
        </button>
      </nav>
    </div>
  )
}