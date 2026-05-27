import { memo, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import { Badge, StockBar, Spinner, Card, SectionTitle } from '../components/UI'
import { stockLevel, stockPct, fmtCurrency, fmtRelative } from '../utils/helpers'

/* ── Alert Card ─────────────────────────────────────────────── */
const AlertCard = memo(({ item, onUpdate, isAdmin }) => {
  const level    = stockLevel(item)
  const pct      = stockPct(item)
  const isCrit   = level === 'critical'
  const borderC  = isCrit ? 'rgba(240,82,82,.22)' : 'rgba(245,166,35,.2)'
  const bgC      = isCrit ? 'rgba(240,82,82,.05)'  : 'rgba(245,166,35,.04)'
  const accentC  = isCrit ? 'var(--danger)' : 'var(--warning)'

  return (
    <div style={{
      background: bgC,
      border: `1px solid ${borderC}`,
      borderRadius: 'var(--radius-lg)',
      padding: '16px 18px',
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        {/* Left info */}
        <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: accentC,
              ...(isCrit ? { animation: 'pulse-dot 1.2s ease-in-out infinite' } : {}),
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
            <Badge level={level} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>
            {item.category} · <code style={{ fontSize: 10 }}>{item.sku}</code> · {item.supplier}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
            Updated {fmtRelative(item.updatedAt)}
          </div>
        </div>

        {/* Right stats */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: accentC, letterSpacing: '-1px', lineHeight: 1 }}>
            {item.stock}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
            of {item.maxStock} · thresh {item.threshold}
          </div>
        </div>
      </div>

      {/* Stock bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Fill level</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: accentC }}>{pct}%</span>
        </div>
        <StockBar item={item} height={7} />
      </div>

      {/* Actions */}
      {isAdmin ? (
        <div style={{ display: 'flex', gap: 7 }}>
          {[
            { delta: 10,  label: '+10',       style: 'ghost' },
            { delta: 25,  label: '+25',       style: 'ghost' },
            { delta: 50,  label: '+50',       style: 'ghost' },
            { delta: 100, label: '🔁 Reorder ×100', style: 'filled' },
          ].map(({ delta, label, style: s }) => (
            <button
              key={delta}
              onClick={() => onUpdate(item.id, delta)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 11, fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration) var(--ease)',
                ...(s === 'filled'
                  ? {
                    background: 'linear-gradient(135deg, var(--accent), var(--info))',
                    border: 'none', color: '#fff', marginLeft: 'auto',
                  }
                  : {
                    background: 'transparent',
                    border: `1px solid ${accentC}44`,
                    color: accentC,
                  }),
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{
          fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic',
          display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0'
        }}>
          <Icon name="lock" size={12} /> Refilling stock requires manager privileges.
        </div>
      )}
    </div>
  )
})

/* ── Summary Banner ─────────────────────────────────────────── */
const SummaryBanner = ({ critical, low, total }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12, marginBottom: 24,
  }}>
    {[
      { label: 'Critical',   value: critical, color: 'var(--danger)',  dim: 'var(--danger-dim)',  desc: 'Below threshold' },
      { label: 'Low Stock',  value: low,      color: 'var(--warning)', dim: 'var(--warning-dim)', desc: 'Running low' },
      { label: 'Total Items',value: total,    color: 'var(--accent)',  dim: 'var(--accent-dim)',  desc: 'In inventory' },
    ].map(({ label, value, color, dim, desc }) => (
      <div key={label} style={{
        background: dim, border: `1px solid ${color}33`,
        borderRadius: 'var(--radius-lg)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
          color, letterSpacing: '-2px', lineHeight: 1,
        }}>
          {value}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{desc}</div>
        </div>
      </div>
    ))}
  </div>
)

/* ── Main ──────────────────────────────────────────────────────── */
export default memo(function AlertsPage() {
  const { inventory, loading, updateStock, addToast, user } = useApp()
  const isAdmin = user?.role === 'Inventory Manager'
  const [filter, setFilter] = useState('all')

  const handleUpdate = (id, delta) => {
    updateStock(id, delta)
    addToast(`Added ${delta} units to stock`, 'success')
  }

  const { critical, low } = useMemo(() => ({
    critical: inventory
      .filter(i => stockLevel(i) === 'critical')
      .sort((a, b) => stockPct(a) - stockPct(b)),
    low: inventory
      .filter(i => stockLevel(i) === 'low')
      .sort((a, b) => stockPct(a) - stockPct(b)),
  }), [inventory])

  const shown = filter === 'critical' ? critical : filter === 'low' ? low : [...critical, ...low]

  if (loading && !inventory.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 14 }}>
        <Spinner size={28} />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Checking alerts…</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1140 }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-.7px', marginBottom: 4 }}>
              Stock Alerts
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              {critical.length} critical · {low.length} low stock · action required
            </p>
          </div>
          {(critical.length > 0 || low.length > 0) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 'var(--radius-md)',
              background: 'var(--danger-dim)', border: '1px solid rgba(240,82,82,.3)',
              fontSize: 12, fontWeight: 600, color: 'var(--danger)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--danger)', animation: 'pulse-dot 1.2s ease-in-out infinite' }} />
              Live monitoring active
            </div>
          )}
        </div>
      </div>

      {/* All clear state */}
      {critical.length === 0 && low.length === 0 ? (
        <div className="animate-scale-in" style={{
          textAlign: 'center', padding: '80px 20px',
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--success-dim)', color: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Icon name="check" size={28} strokeWidth={2.5} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--success)' }}>
            All systems green
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto' }}>
            No critical or low stock items right now. All {inventory.length} SKUs are within healthy levels.
          </div>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="animate-fade-up delay-1">
            <SummaryBanner critical={critical.length} low={low.length} total={inventory.length} />
          </div>

          {/* Filters */}
          <div className="animate-fade-up delay-2" style={{ display: 'flex', gap: 7, marginBottom: 20 }}>
            {[
              { id: 'all',      label: `All alerts (${critical.length + low.length})` },
              { id: 'critical', label: `Critical (${critical.length})` },
              { id: 'low',      label: `Low stock (${low.length})` },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer', transition: 'all var(--duration) var(--ease)',
                background: filter === id ? 'var(--accent)' : 'var(--bg-raised)',
                border: `1px solid ${filter === id ? 'var(--accent)' : 'var(--border-default)'}`,
                color: filter === id ? '#fff' : 'var(--text-secondary)',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Critical column */}
            {(filter === 'all' || filter === 'critical') && (
              <div className="animate-fade-up delay-2">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 14,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--danger)',
                    animation: 'pulse-dot 1.2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--danger)',
                    textTransform: 'uppercase', letterSpacing: '.8px',
                  }}>
                    Critical — {critical.length} items
                  </span>
                </div>
                {critical.length === 0 ? (
                  <div style={{
                    padding: '24px', textAlign: 'center',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)', fontSize: 13, color: 'var(--text-tertiary)',
                  }}>
                    No critical items
                  </div>
                ) : critical.map(item => (
                  <AlertCard key={item.id} item={item} onUpdate={handleUpdate} isAdmin={isAdmin} />
                ))}
              </div>
            )}

            {/* Low stock column */}
            {(filter === 'all' || filter === 'low') && (
              <div className="animate-fade-up delay-3">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 14,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--warning)',
                    textTransform: 'uppercase', letterSpacing: '.8px',
                  }}>
                    Low Stock — {low.length} items
                  </span>
                </div>
                {low.length === 0 ? (
                  <div style={{
                    padding: '24px', textAlign: 'center',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)', fontSize: 13, color: 'var(--text-tertiary)',
                  }}>
                    No low stock items
                  </div>
                ) : low.map(item => (
                  <AlertCard key={item.id} item={item} onUpdate={handleUpdate} isAdmin={isAdmin} />
                ))}
              </div>
            )}

            {/* Single-column when filtered */}
            {filter === 'critical' && filter !== 'all' && low.length > 0 && (
              <div style={{
                padding: '20px', background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 6, color: 'var(--text-tertiary)',
              }}>
                <Icon name="bell" size={24} strokeWidth={1.5} />
                <div style={{ fontSize: 12 }}>{low.length} low stock items hidden</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
})
