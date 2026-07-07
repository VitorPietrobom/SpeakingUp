import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Aulas from './pages/Aulas.jsx'
import Treinamento from './pages/Treinamento.jsx'
import Organizacao from './pages/Organizacao.jsx'

// BrowserRouter keeps the scroll position across navigations; long pages need a reset.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aulas" element={<Aulas />} />
        <Route path="/treinamento" element={<Treinamento />} />
        <Route path="/organizacao" element={<Organizacao />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
