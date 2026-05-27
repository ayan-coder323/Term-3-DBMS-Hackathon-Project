import { memo } from 'react'
import Icon from './Icon'
import { LEVEL_META, stockPct } from '../utils/helpers'

/* ── Badge ─────────────────────────────────────────────────── */
export const Badge = memo(({ level }) => {
  const m = LEVEL_META[level]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      background: m.dim, color: m.color,
      fontSize: 11, fontWeight: 600, letterSpacing: '.3px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: m.hex, flexShrink: 0,
        ...(level === 'critical' ? { animation: 'pulse-dot 1.4s ease-in-out infinite' } : {}),
      }} />
      {m.label}
    </span>
  )
})

/* ── StockBar ───────────────────────────────────────────────── */
export const StockBar = memo(({ item, height = 6, showLabel = false }) => {
  const pct = stockPct(item)
  const gradients = {
    critical: 'linear-gradient(90deg, #f05252, #ff7b7b)',
    low:      'linear-gradient(90deg, #f5a623, #ffc95c)',
    medium:   'linear-gradient(90deg, #555d72, #8a91ab)',
    healthy:  'linear-gradient(90deg, #22d68f, #60edb8)',
  }
  const level = item.stock <= item.threshold ? 'critical'
    : item.stock / item.maxStock < .35 ? 'low'
    : item.stock / item.maxStock < .65 ? 'medium' : 'healthy'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1, height, background: 'var(--bg-float)',
        borderRadius: 'var(--radius-full)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: gradients[level],
          borderRadius: 'var(--radius-full)',
          transition: 'width .5s var(--ease)',
        }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 32, textAlign: 'right' }}>
          {pct}%
        </span>
      )}
    </div>
  )
})

/* ── Spinner ────────────────────────────────────────────────── */
export const Spinner = ({ size = 20, color = 'var(--accent)' }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid var(--bg-float)`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin .75s linear infinite',
    flexShrink: 0,
  }} />
)

/* ── Toast ──────────────────────────────────────────────────── */
export const Toast = memo(({ message, variant }) => {
  const cfg = {
    success: { color: 'var(--success)', bg: 'var(--success-dim)', icon: 'check' },
    error:   { color: 'var(--danger)',  bg: 'var(--danger-dim)',  icon: 'x' },
    info:    { color: 'var(--accent)',  bg: 'var(--accent-dim)',  icon: 'info' },
  }
  const c = cfg[variant] || cfg.success

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 18px',
      background: 'var(--bg-float)',
      border: `1px solid ${c.color}44`,
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 8px 32px rgba(0,0,0,.5)',
      animation: 'toast-in .3s var(--ease)',
      fontSize: 13, fontWeight: 500,
      minWidth: 220,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        background: c.bg, color: c.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={c.icon} size={12} strokeWidth={2.5} />
      </span>
      {message}
    </div>
  )
})

/* ── MetricCard ─────────────────────────────────────────────── */
export const MetricCard = memo(({ icon, label, value, trend, color = 'var(--accent)', delay = 0 }) => (
  <div className="animate-fade-up" style={{
    animationDelay: `${delay}s`,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 22px',
    display: 'flex', flexDirection: 'column', gap: 14,
    transition: 'border-color var(--duration) var(--ease)',
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-md)',
        background: `${color}1a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, flexShrink: 0,
      }}>
        <Icon name={icon} size={18} />
      </div>
      {trend && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '4px 8px', borderRadius: 'var(--radius-full)',
          background: trend.up ? 'var(--success-dim)' : 'var(--danger-dim)',
          color: trend.up ? 'var(--success)' : 'var(--danger)',
          fontSize: 11, fontWeight: 600,
        }}>
          <Icon name={trend.up ? 'trend_up' : 'trend_dn'} size={11} strokeWidth={2.5} />
          {trend.label}
        </span>
      )}
    </div>
    <div>
      <div style={{
        fontSize: 28, fontWeight: 700,
        fontFamily: 'var(--font-display)',
        letterSpacing: '-1px', lineHeight: 1,
        marginBottom: 5,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 400 }}>
        {label}
      </div>
    </div>
  </div>
))

/* ── Pill button ────────────────────────────────────────────── */
export const Pill = memo(({ label, active, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: '5px 13px',
      borderRadius: 'var(--radius-full)',
      border: `1px solid ${active ? (color || 'var(--accent)') : 'var(--border-default)'}`,
      background: active ? `${color || 'var(--accent)'}1a` : 'transparent',
      color: active ? (color || 'var(--accent)') : 'var(--text-secondary)',
      fontSize: 12, fontWeight: 500,
      cursor: 'pointer',
      transition: 'all var(--duration) var(--ease)',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </button>
))

/* ── Card wrapper ───────────────────────────────────────────── */
export const Card = ({ children, style = {}, className = '' }) => (
  <div
    className={className}
    style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      ...style,
    }}
  >
    {children}
  </div>
)

/* ── Section header ─────────────────────────────────────────── */
export const SectionTitle = ({ children, sub, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
    <div>
      <h2 style={{
        fontSize: 15, fontWeight: 600,
        fontFamily: 'var(--font-display)',
        letterSpacing: '-.3px',
      }}>
        {children}
      </h2>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3 }}>{sub}</p>}
    </div>
    {action}
  </div>
)
