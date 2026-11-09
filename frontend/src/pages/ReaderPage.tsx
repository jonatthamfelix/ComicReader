import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { apiGet } from '../api/client'
import type { Comic } from '../types/comic'

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4]

export function ReaderPage() {
  const { id, number } = useParams()
  const navigate = useNavigate()
  const [comic, setComic] = useState<Comic | null>(null)
  const [error, setError] = useState('')

  const [fitWidth, setFitWidth] = useState(true)
  const [scale, setScale] = useState(1)
  const [natural, setNatural] = useState({ width: 0, height: 0 })
  const [containerWidth, setContainerWidth] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const shellRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const pageNumber = Number(number)

  useEffect(() => {
    apiGet<Comic>(`/comics/${id}`)
      .then(setComic)
      .catch((e: Error) => setError(e.message))
  }, [id])

  // ao trocar de pagina, volta ao topo da imagem
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [pageNumber])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setContainerWidth(el.clientWidth))
    observer.observe(el)
    setContainerWidth(el.clientWidth)
    return () => observer.disconnect()
  }, [comic])

  useEffect(() => {
    function onChange() {
      setIsFullscreen(document.fullscreenElement === shellRef.current)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // imagem em cache nao dispara onLoad, entao lemos as dimensoes depois de montar
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setNatural({ width: img.naturalWidth, height: img.naturalHeight })
    }
  }, [pageNumber, comic])

  const go = useCallback(
    (target: number) => {
      if (!comic) return
      if (target < 1 || target > comic.pages.length) return
      navigate(`/comics/${comic.id}/pages/${target}`)
    },
    [comic, navigate],
  )

  const fit = useCallback(() => setFitWidth(true), [])

  const actual = useCallback(() => {
    setFitWidth(false)
    setScale(1)
  }, [])

  const zoomBy = useCallback(
    (direction: 1 | -1) => {
      const current =
        fitWidth && natural.width > 0 && containerWidth > 0 ? containerWidth / natural.width : scale
      const candidate =
        direction > 0
          ? ZOOM_STEPS.find((step) => step > current + 0.001)
          : [...ZOOM_STEPS].reverse().find((step) => step < current - 0.001)
      if (candidate === undefined) return
      setFitWidth(false)
      setScale(candidate)
    },
    [fitWidth, natural.width, containerWidth, scale],
  )

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void shellRef.current?.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') go(pageNumber + 1)
      else if (event.key === 'ArrowLeft') go(pageNumber - 1)
      else if (event.key === '+' || event.key === '=') zoomBy(1)
      else if (event.key === '-') zoomBy(-1)
      else if (event.key === '0') fit()
      else if (event.key === '1') actual()
      else if (event.key === 'f' || event.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, pageNumber, zoomBy, fit, actual, toggleFullscreen])

  // ctrl+scroll exige listener nao-passivo para cancelar o zoom do navegador
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function onWheel(event: WheelEvent) {
      if (!event.ctrlKey) return
      event.preventDefault()
      zoomBy(event.deltaY < 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomBy, comic])

  if (error) return <main><p className="error">{error}</p></main>
  if (!comic) return <main><p>Carregando...</p></main>

  const percent =
    fitWidth && natural.width > 0 && containerWidth > 0
      ? Math.round((containerWidth / natural.width) * 100)
      : Math.round(scale * 100)

  const imageStyle =
    fitWidth || !natural.width
      ? { width: '100%' as const }
      : { width: `${natural.width * scale}px` }

  return (
    <div className="reader" ref={shellRef}>
      <header className="reader-header">
        <Link to="/">← Biblioteca</Link>
        <strong className="reader-title">{comic.title}</strong>
        <span className="reader-counter">
          {pageNumber} / {comic.pages.length}
        </span>
      </header>

      <div className="reader-scroll" ref={scrollRef}>
        <img
          key={pageNumber}
          ref={imgRef}
          className="reader-image"
          style={imageStyle}
          src={`/api/comics/${comic.id}/pages/${pageNumber}`}
          alt={`Página ${pageNumber} de ${comic.title}`}
          onLoad={(event) => {
            const img = event.currentTarget
            setNatural({ width: img.naturalWidth, height: img.naturalHeight })
          }}
          onDoubleClick={() => (fitWidth ? actual() : fit())}
        />
      </div>

      <div className="reader-toolbar">
        <button onClick={() => go(pageNumber - 1)} disabled={pageNumber <= 1} aria-label="Página anterior">
          ‹
        </button>

        <span className="reader-zoom">
          <button onClick={() => zoomBy(-1)} aria-label="Diminuir zoom">-</button>
          <span className="reader-percent">{percent}%</span>
          <button onClick={() => zoomBy(1)} aria-label="Aumentar zoom">+</button>
        </span>

        <button onClick={fit} className={fitWidth ? 'active' : ''} aria-pressed={fitWidth} title="Ajustar a largura (0)">
          Largura
        </button>
        <button onClick={actual} className={!fitWidth && scale === 1 ? 'active' : ''} title="Tamanho real (1)">
          100%
        </button>

        <button onClick={toggleFullscreen} aria-label="Tela cheia (F)" title="Tela cheia (F)">
          {isFullscreen ? 'Sair' : 'Tela cheia'}
        </button>

        <button onClick={() => go(pageNumber + 1)} disabled={pageNumber >= comic.pages.length} aria-label="Proxima pagina">
          ›
        </button>
      </div>
    </div>
  )
}