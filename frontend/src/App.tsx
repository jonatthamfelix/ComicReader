import './App.css'
import { Route, Routes } from 'react-router'
import { LibraryPage } from './pages/LibraryPage'
import { ReaderPage } from './pages/ReaderPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LibraryPage />} />
      <Route path="/comics/:id/pages/:number" element={<ReaderPage />} />
    </Routes>
  )
}

export default App