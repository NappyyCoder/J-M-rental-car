import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FleetProvider } from './context/FleetContext'
import { isComingSoon } from './lib/config'
import { AboutPage } from './pages/AboutPage'
import { AdminPage } from './pages/AdminPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { VehiclesPage } from './pages/VehiclesPage'

export default function App() {
  if (isComingSoon) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <FleetProvider>
                <AdminPage />
              </FleetProvider>
            }
          />
          <Route path="*" element={<ComingSoonPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <FleetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FleetProvider>
  )
}
