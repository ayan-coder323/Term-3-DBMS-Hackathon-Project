import { memo, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import Icon from './Icon'
import { stockLevel } from '../utils/helpers'

const NAV_ITEMS = [
  { id: 'overview',   icon: 'grid',    label: 'Overview'   },
  { id: 'inventory',  icon: 'box',     label: 'Inventory'  },
  { id: 'analytics',  icon: 'bar',     label: 'Analytics'  },
  { id: 'alerts',     icon: 'bell',    label: 'Alerts'     },
  { id: 'profile',    icon: 'user',    label: 'Profile'    },
]

export default memo(function Sidebar() {
  const { user, inventory, route, setRoute, logout } = useApp()

  const criticalCount = useMemo(
    () => inventory.filter(i => stockLevel(i) === 'critical').length,
    [inventory]
  )

  return (
    <aside style={{
      width: 224, flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 18px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent), var(--info))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name="warehouse" size={15} style={{ color: '#fff' }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15, fontWeight: 700, letterSpacing: '-.4px',
            lineHeight: 1.1,
          }}>
            <span style={{ color: 'var(--accent)' }}>Inv</span>Track
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '.8px', fontWeight: 500, textTransform: 'uppercase' }}>
            Pro
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{
          fontSize: 9, color: 'var(--text-tertiary)',
          letterSpacing: '1px', fontWeight: 600, textTransform: 'uppercase',
          padding: '0 8px', marginBottom: 6, marginTop: 4,
        }}>
          Navigation
        </div>

        {NAV_ITEMS.map(({ id, icon, label }) => {
          const active  = route === id
          const hasBadge = id === 'alerts' && criticalCount > 0

          return (
            <button
              key={id}
              onClick={() => setRoute(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 10px', borderRadius: 'var(--radius-md)',
                background: active ? 'rgba(91,138,248,.12)' : 'transparent',
                border: `1px solid ${active ? 'rgba(91,138,248,.28)' : 'transparent'}`,
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all var(--duration) var(--ease)',
                marginBottom: 2, textAlign: 'left',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
            >
              <Icon name={icon} size={16} strokeWidth={active ? 2 : 1.7} />
              {label}
              {hasBadge && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--danger)', color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 10, fontWeight: 700,
                  minWidth: 18, height: 18, padding: '0 5px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {criticalCount > 99 ? '99+' : criticalCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setRoute('profile')}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 10px', borderRadius: 'var(--radius-md)',
            background: route === 'profile' ? 'rgba(91,138,248,.08)' : 'var(--bg-raised)',
            border: `1px solid ${route === 'profile' ? 'var(--accent)' : 'var(--border-default)'}`,
            marginBottom: 6,
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--text-primary)',
            transition: 'all var(--duration) var(--ease)',
          }}
          onMouseEnter={e => { if (route !== 'profile') e.currentTarget.style.borderColor = 'var(--border-default)' }}
          onMouseLeave={e => { if (route !== 'profile') e.currentTarget.style.borderColor = 'var(--border-default)' }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--info))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            {user?.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
              {user?.role}
            </div>
          </div>
        </button>

        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 'var(--radius-md)',
            background: 'transparent', border: 'none',
            color: 'var(--text-tertiary)', fontSize: 12,
            cursor: 'pointer',
            transition: 'color var(--duration) var(--ease)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          <Icon name="logout" size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
})
