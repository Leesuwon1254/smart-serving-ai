import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VersionUpdateModal from './components/ui/VersionUpdateModal'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tables from './pages/Tables'
import Alerts from './pages/Alerts'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export default function App() {
  return (
    <>
      <VersionUpdateModal />
      <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/tables"    element={<Tables />} />
            <Route path="/alerts"    element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings"  element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </>
  )
}
