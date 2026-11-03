import { useEffect, useState } from 'react'
import { apiGet } from '../api/client'
import type { Health } from '../types/health'

export function LibraryPage() {
  const [apiStatus, setApiStatus] = useState('conectando...')

  useEffect(() => {
    apiGet<Health>('/health')
      .then((health) => setApiStatus(health.status))
      .catch(() => setApiStatus('offline'))
  }, [])

  return (
    <main>
      <h1>ComicReader</h1>
      <p>Sua biblioteca de quadrinhos.</p>
      <p>API: {apiStatus}</p>
    </main>
  )
}