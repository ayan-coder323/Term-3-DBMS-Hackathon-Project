import { memo, useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, RadialBarChart, RadialBar, Legend,
  AreaChart, Area,
} from 'recharts'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import { Badge, Card, SectionTitle, StockBar, Spinner } from '../components/UI'
import { CATEGORIES, CATEGORY_HEX } from '../data/mockData'
import { stockLevel, stockPct, fmtCurrency, LEVEL_META } from '../utils/helpers'

/* ── Custom tooltip ─────────────────────────────────────────── */
const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-float)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)', padding: '8px 13px', fontSize: 12,
    }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill, fontWeight: 600 }}>
          {typeof p.value === 'number'
            ? p.value > 1000 ? fmtCurrency(p.value) : p.value
            : p.value}
        </div>
      ))}
    </div>
  )
}

/* ── Stat Row ─────────────────────────────────────────────────── */
const StatRow = ({ label, value, bar, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 11 }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700 }}>{value}</span>
      </div>
      {bar !== undefined && (
        <div style={{ height: 5, background: 'var(--bg-float)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${bar}%`, background: color || 'var(--accent)',
            borderRadius: 99, transition: 'width .6s var(--ease)',
          }} />
        </div>
      )}
    </div>
  </div>
)

/* ── Top item row ─────────────────────────────────────────────── */
const TopRow = ({ item, rank, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 0',
    borderBottom: '1px solid var(--border-subtle)',
  }}>
    <span style={{
      fontSize: 11, fontWeight: 800, color: rank <= 3 ? 'var(--accent)' : 'var(--text-tertiary)',
      width: 18, flexShrink: 0, textAlign: 'center',
    }}>
      #{rank}
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.name}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{item.category}</div>
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--info)', flexShrink: 0 }}>
      {fmtCurrency(value)}
    </span>
  </div>
)

/* ── Main ──────────────────────────────────────────────────────── */
export default memo(function AnalyticsPage() {
  const { inventory, loading } = useApp()
  const [activeTab, setActiveTab] = useState('value')

  /* Category aggregates */
  const catData = useMemo(() =>
    CATEGORIES.map(cat => {
      const items = inventory.filter(i => i.category === cat)
      const val   = items.reduce((s, i) => s + i.stock * i.price, 0)
      const avg   = items.length ? Math.round(items.reduce((s, i) => s + stockPct(i), 0) / items.length) : 0
      const crit  = items.filter(i => stockLevel(i) === 'critical').length
      const low   = items.filter(i => stockLevel(i) === 'low').length
      const hlth  = items.filter(i => stockLevel(i) === 'healthy').length
      return { cat, items: items.length, val, avg, crit, low, hlth, color: CATEGORY_HEX[cat] }
    }),
    [inventory]
  )

  /* Level distribution */
  const levelDist = useMemo(() => {
    const counts = { critical: 0, low: 0, medium: 0, healthy: 0 }
    inventory.forEach(i => counts[stockLevel(i)]++)
    return Object.entries(counts).map(([k, v]) => ({
      name: LEVEL_META[k].label, value: v, fill: LEVEL_META[k].hex,
    }))
  }, [inventory])

  /* Top value items */
  const topItems = useMemo(() =>
    [...inventory]
      .sort((a, b) => (b.stock * b.price) - (a.stock * a.price))
      .slice(0, 8),
    [inventory]
  )

  /* Worst stock items */
  const worstItems = useMemo(() =>
    [...inventory]
      .filter(i => stockLevel(i) === 'critical')
      .sort((a, b) => stockPct(a) - stockPct(b))
      .slice(0, 8),
    [inventory]
  )

  /* Supplier breakdown */
  const supplierData = useMemo(() => {
    const map = {}
    inventory.forEach(i => {
      map[i.supplier] = (map[i.supplier] || 0) + i.stock * i.price
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, val]) => ({ name, val }))
  }, [inventory])

  const maxSupplierVal = supplierData[0]?.val || 1

  /* Weekly mock trend */
  const trendData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const base = inventory.reduce((s, i) => s + i.stock * i.price, 0)
    let v = base * .9
    return days.map(day => {
      v = v * (0.97 + Math.random() * .065)
      return { day, value: Math.round(v) }
    })
  }, [inventory])

  /* Stock fill rate */
  const fillRate = useMemo(() => {
    if (!inventory.length) return 0
    return Math.round(inventory.reduce((s, i) => s + stockPct(i), 0) / inventory.length)
  }, [inventory])

  if (loading && !inventory.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 14 }}>
        <Spinner size={28} />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading analytics…</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1140 }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-.7px', marginBottom: 4 }}>
          Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Deep performance insights across your entire inventory
        </p>
      </div>

      {/* ── KPI strip ───────────────────────────────────────────── */}
      <div className="animate-fade-up delay-1" style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12, marginBottom: 24,
      }}>
        {[
          { label: 'Total Portfolio', value: fmtCurrency(inventory.reduce((s, i) => s + i.stock * i.price, 0)), color: 'var(--accent)' },
          { label: 'Avg Fill Rate',   value: `${fillRate}%`, color: 'var(--info)' },
          { label: 'Critical Items',  value: inventory.filter(i => stockLevel(i) === 'critical').length, color: 'var(--danger)' },
          { label: 'Total Units',     value: inventory.reduce((s, i) => s + i.stock, 0).toLocaleString(), color: 'var(--success)' },
          { label: 'Avg Item Price',  value: `$${inventory.length ? (inventory.reduce((s, i) => s + i.price, 0) / inventory.length).toFixed(0) : 0}`, color: 'var(--warning)' },
        ].map(({ label, value, color }, idx) => (
          <div key={label} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)', padding: '16px 18px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, fontWeight: 500 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color, letterSpacing: '-1px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Row 1 ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Category value breakdown */}
        <Card className="animate-fade-up delay-2" style={{ padding: 22 }}>
          <SectionTitle sub="total stock value per category">
            Category Value Breakdown
          </SectionTitle>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {[['value', 'By Value'], ['fill', 'Fill Rate'], ['count', 'Item Count']].map(([k, l]) => (
              <button key={k} onClick={() => setActiveTab(k)} style={{
                padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500,
                cursor: 'pointer', transition: 'all var(--duration) var(--ease)',
                background: activeTab === k ? 'var(--accent)' : 'var(--bg-raised)',
                border: `1px solid ${activeTab === k ? 'var(--accent)' : 'var(--border-default)'}`,
                color: activeTab === k ? '#fff' : 'var(--text-secondary)',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[...catData]
              .sort((a, b) =>
                activeTab === 'value' ? b.val - a.val :
                activeTab === 'fill'  ? b.avg - a.avg :
                b.items - a.items
              )
              .map(({ cat, val, avg, items, crit, color }) => {
                const displayVal  = activeTab === 'value' ? fmtCurrency(val) : activeTab === 'fill' ? `${avg}%` : items
                const maxForBar   = activeTab === 'value' ? Math.max(...catData.map(c => c.val))
                  : activeTab === 'fill' ? 100
                  : Math.max(...catData.map(c => c.items))
                const barPct = activeTab === 'value' ? (val / maxForBar) * 100
                  : activeTab === 'fill' ? avg
                  : (items / maxForBar) * 100

                return (
                  <div key={cat} style={{ marginBottom: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{cat}</span>
                        {crit > 0 && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99, background: 'var(--danger-dim)', color: 'var(--danger)' }}>
                            {crit} crit
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{displayVal}</span>
                    </div>
                    <div style={{ height: 7, background: 'var(--bg-float)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${barPct}%`,
                        background: color, opacity: .82,
                        borderRadius: 99, transition: 'width .65s var(--ease)',
                      }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </Card>

        {/* Level distribution pie */}
        <Card className="animate-fade-up delay-3" style={{ padding: 22 }}>
          <SectionTitle sub="stock health distribution">
            Stock Health
          </SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={levelDist} cx="50%" cy="50%"
                innerRadius={48} outerRadius={76}
                paddingAngle={3} dataKey="value"
              >
                {levelDist.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', justifyContent: 'center' }}>
            {levelDist.map(({ name, value, fill }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: fill, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{name}</span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 2 ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Top value items */}
        <Card className="animate-fade-up delay-3" style={{ padding: 22 }}>
          <SectionTitle sub="ranked by stock × unit price">
            Top Value Items
          </SectionTitle>
          {topItems.map((item, i) => (
            <TopRow key={item.id} item={item} rank={i + 1} value={item.stock * item.price} />
          ))}
        </Card>

        {/* Worst stock items */}
        <Card className="animate-fade-up delay-4" style={{ padding: 22 }}>
          <SectionTitle sub="lowest fill rate — action needed">
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--danger)', display: 'inline-block', animation: 'pulse-dot 1.4s ease-in-out infinite' }} />
              Critical Stock Items
            </span>
          </SectionTitle>
          {worstItems.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--success)' }}>
              <Icon name="check" size={28} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>All clear — no critical items!</div>
            </div>
          ) : worstItems.map((item, i) => (
            <div key={item.id} style={{
              padding: '9px 0',
              borderBottom: i < worstItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 1 }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{item.category} · {item.sku}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)' }}>
                    {item.stock}/{item.maxStock}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>thresh {item.threshold}</div>
                </div>
              </div>
              <StockBar item={item} height={5} showLabel />
            </div>
          ))}
        </Card>
      </div>

      {/* ── Row 3 ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Supplier value breakdown */}
        <Card className="animate-fade-up delay-4" style={{ padding: 22 }}>
          <SectionTitle sub="portfolio value by supplier">
            Supplier Breakdown
          </SectionTitle>
          {supplierData.map(({ name, val }) => (
            <StatRow
              key={name} label={name} value={fmtCurrency(val)}
              bar={Math.round((val / maxSupplierVal) * 100)}
              color="var(--info)"
            />
          ))}
        </Card>

        {/* 7-day value trend */}
        <Card className="animate-fade-up delay-5" style={{ padding: 22 }}>
          <SectionTitle sub="portfolio value over 7 days">
            Weekly Trend
          </SectionTitle>
          <ResponsiveContainer width="100%" height={195}>
            <AreaChart data={trendData} margin={{ top: 5, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="wkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#38c7e8" stopOpacity={.22} />
                  <stop offset="95%" stopColor="#38c7e8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                axisLine={false} tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<Tip />} />
              <Area
                type="monotone" dataKey="value"
                stroke="var(--info)" strokeWidth={2}
                fill="url(#wkGrad)" dot={false}
                activeDot={{ r: 4, fill: 'var(--info)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
})
