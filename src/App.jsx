import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'
import LabsPage from './pages/LabsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'

function AppRoutes() {
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation
  const showProjectOverlay = Boolean(backgroundLocation && location.pathname.startsWith('/projects/'))

  return (
    <>
      <ScrollToTop />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/labs" element={<LabsPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/labs.html" element={<Navigate to="/labs" replace />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {showProjectOverlay ? (
        <Routes>
          <Route path="/projects/:slug" element={<ProjectPage overlayOnBackground />} />
        </Routes>
      ) : null}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
