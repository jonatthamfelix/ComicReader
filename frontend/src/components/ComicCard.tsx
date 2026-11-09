import { Link } from 'react-router'
import type { Comic } from '../types/comic'

type Props = {
  comic: Comic
  progress?: number
}

export function ComicCard({ comic, progress }: Props) {
  return (
    <Link to={`/comics/${comic.id}/pages/${comic.lastPageNumber ?? 1}`} className="card">
      <img
        className="card-cover"
        src={`/api/comics/${comic.id}/cover`}
        alt={`Capa de ${comic.title}`}
        loading="lazy"
      />
      <span className="card-title">{comic.title}</span>
      {progress !== undefined && progress > 0 && (
        <span className="card-progress">
          <span style={{ width: `${Math.min(progress * 100, 100)}%` }} />
        </span>
      )}
    </Link>
  )
}
