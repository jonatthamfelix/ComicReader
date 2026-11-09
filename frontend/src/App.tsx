import './App.css'
import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { ImportPage } from './pages/ImportPage'
import { LibraryPage } from './pages/LibraryPage'
import { ReaderPage } from './pages/ReaderPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/import" element={<ImportPage />} />
      </Route>
      <Route path="/comics/:id/pages/:number" element={<ReaderPage />} />
    </Routes>
  )
}

export default App