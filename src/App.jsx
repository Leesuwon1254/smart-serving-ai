import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VersionUpdateModal from './components/ui/VersionUpdateModal'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tables from './pages/Tables'
import Alerts from './pages/Alerts'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import CctvMonitor from './pages/CctvMonitor'
import BehaviorAnalysis from './pages/BehaviorAnalysis'
import MobileTabBar from './components/layout/MobileTabBar'

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
            <Route path="/cctv"      element={<CctvMonitor />} />
            <Route path="/behavior"  element={<BehaviorAnalysis />} />
          </Routes>
        </div>
      </div>
        <MobileTabBar />
    </BrowserRouter>
    </>
  )
}
