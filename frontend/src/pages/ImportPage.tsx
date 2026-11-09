import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { apiPost } from '../api/client'
import type { Comic, ComicInput } from '../types/comic'

export function ImportPage() {
  const navigate = useNavigate()
  const [filePath, setFilePath] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const input: ComicInput = { filePath }
      if (title.trim()) input.title = title.trim()
      const comic = await apiPost<Comic>('/comics', input)
      navigate(`/comics/${comic.id}/pages/1`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main>
      <h1>Importar quadrinho</h1>
      <p className="hint">
        Cole o caminho completo do arquivo <code>.cbz</code> ou <code>.cbr</code>.
        No Explorer: <kbd>Shift</kbd> + botão direito → <em>Copiar como caminho</em>.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Caminho do arquivo
          <input
            value={filePath}
            onChange={(event) => setFilePath(event.target.value)}
            placeholder="C:\Users\voce\Downloads\quadrinho.cbr"
            required
            autoFocus
          />
        </label>

        <label>
          Título (opcional)
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="deixe vazio para usar o nome do arquivo"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={busy || !filePath.trim()}>
          {busy ? 'Importando...' : 'Importar'}
        </button>
      </form>
    </main>
  )
}
