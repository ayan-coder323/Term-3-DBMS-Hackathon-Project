import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import LoginPage    from './pages/LoginPage'
import OverviewPage  from './pages/OverviewPage'
import InventoryPage from './pages/InventoryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AlertsPage    from './pages/AlertsPage'
import ProfilePage   from './pages/ProfilePage'
import Sidebar       from './components/Sidebar'
import ToastContainer from './components/ToastContainer'

/* ── Inner shell (has access to context) ─────────────────────── */
function Shell() {
  const { user, route, inventory, loadInventory } = useApp()

  /* Load inventory once after login */
  useEffect(() => {
    if (user && !inventory.length) {
      loadInventory()
    }
  }, [user])

  /* Not logged in → login page */
  if (!user) return <LoginPage />

  const Page = {
    overview:  OverviewPage,
    inventory: InventoryPage,
    analytics: AnalyticsPage,
    alerts:    AlertsPage,
    profile:   ProfilePage,
  }[route] ?? OverviewPage

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar />

      {/* Main scroll area */}
      <main style={{
        flex: 1, overflowY: 'auto', minHeight: '100vh',
        background: 'var(--bg-base)',
      }}>
        <Page key={route} />
      </main>

      <ToastContainer />
    </div>
  )
}

/* ── Root export ────────────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
