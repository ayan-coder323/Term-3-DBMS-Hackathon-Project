import { useApp } from '../context/AppContext'
import { Toast } from './UI'

export default function ToastContainer() {
  const { toasts } = useApp()

  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} />
      ))}
    </div>
  )
}
