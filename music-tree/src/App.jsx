import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/store.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Sky from './pages/Sky.jsx'
import Practice from './pages/Practice.jsx'
import Songbook from './pages/Songbook.jsx'
import NodeDetail from './pages/NodeDetail.jsx'
import Reading from './pages/Reading.jsx'
import PracticeRoom from './pages/PracticeRoom.jsx'
import Evaluation from './pages/Evaluation.jsx'
import Ignition from './pages/Ignition.jsx'
import Summary from './pages/Summary.jsx'
import Review from './pages/Review.jsx'
import SongView from './pages/SongView.jsx'

function Guard({ children }) {
  const { state } = useStore()
  const location = useLocation()
  if (!state.onboarded) {
    return <Navigate to="/onboarding" replace state={{ from: location }} />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Guard><Sky /></Guard>} />
      <Route path="/practice" element={<Guard><Practice /></Guard>} />
      <Route path="/songs" element={<Guard><Songbook /></Guard>} />
      <Route path="/star/:id" element={<Guard><NodeDetail /></Guard>} />
      <Route path="/star/:id/read/:resIdx" element={<Guard><Reading /></Guard>} />
      <Route path="/star/:id/drill" element={<Guard><PracticeRoom /></Guard>} />
      <Route path="/star/:id/evaluate" element={<Guard><Evaluation /></Guard>} />
      <Route path="/star/:id/review" element={<Guard><Review /></Guard>} />
      <Route path="/ignited/:id" element={<Guard><Ignition /></Guard>} />
      <Route path="/song/:id" element={<Guard><SongView /></Guard>} />
      <Route path="/summary" element={<Guard><Summary /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
