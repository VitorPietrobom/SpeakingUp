import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Aulas from './pages/Aulas.jsx'
import Treinamento from './pages/Treinamento.jsx'
import Organizacao from './pages/Organizacao.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aulas" element={<Aulas />} />
        <Route path="/treinamento" element={<Treinamento />} />
        <Route path="/organizacao" element={<Organizacao />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
