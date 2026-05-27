import { memo, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import { MetricCard, Card, SectionTitle, StockBar, Badge, Spinner } from '../components/UI'
import { CATEGORY_COLORS, CATEGORY_HEX } from '../data/mockData'
import { stockLevel, stockPct, fmtCurrency, fmtRelative, LEVEL_META } from '../utils/helpers'

/* ── Sparkline mock data ─────────────────────────────────────── */
function makeSparkData() {
  let v = 60 + Math.random() * 30
  return Array.from({ length: 10 }, (_, i) => {
    v = Math.max(20, Math.min(100, v + (Math.random() - .45) * 12))
    return { i, v: parseFloat(v.toFixed(1)) }
  })
}

/* ── Custom Tooltip ─────────────────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-float)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)', padding: '8px 12px',
      fontSize: 12, color: 'var(--text-primary)',
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontWeight: 600, color: p.color || p.fill }}>
          {typeof p.value === 'number' ? fmtCurrency(p.value) : p.value}
        </div>
      ))}
    </div>
  )
}

/* ── Category row with inline bar ───────────────────────────── */
const CategoryRow = memo(({ cat, items, maxVal }) => {
  const totalVal   = items.reduce((s, i) => s + i.stock * i.price, 0)
  const avgPct     = Math.round(items.reduce((s, i) => s + stockPct(i), 0) / (items.length || 1))
  const critCount  = items.filter(i => stockLevel(i) === 'critical').length
  const color      = CATEGORY_HEX[cat]
  const barWidth   = `${Math.round((totalVal / maxVal) * 100)}%`

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>{cat}</span>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>({items.length})</span>
          {critCount > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--danger-dim)', color: 'var(--danger)',
            }}>
              {critCount} crit
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>avg {avgPct}%</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{fmtCurrency(totalVal)}</span>
        </div>
      </div>
      <div style={{ height: 7, background: 'var(--bg-float)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: barWidth,
          background: color, opacity: .85,
          borderRadius: 'var(--radius-full)',
          transition: 'width .65s var(--ease)',
        }} />
      </div>
    </div>
  )
})

/* ── Recent item row ─────────────────────────────────────────── */
const RecentRow = memo(({ item, index, total }) => {
  const lv = stockLevel(item)
  const m  = LEVEL_META[lv]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      paddingBottom: index < total - 1 ? 12 : 0,
      marginBottom: index < total - 1 ? 12 : 0,
      borderBottom: index < total - 1 ? '1px solid var(--border-subtle)' : 'none',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 'var(--radius-md)',
        background: m.dim, color: m.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.hex }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
          {item.category} · {fmtRelative(item.updatedAt)}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{item.stock}</div>
        <div style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>/{item.maxStock}</div>
      </div>
    </div>
  )
})

/* ── Main ─────────────────────────────────────────────────────── */
export default memo(function OverviewPage() {
  const { inventory, loading, loadInventory } = useApp()

  /* Derived metrics */
  const metrics = useMemo(() => {
    if (!inventory.length) return null
    const totalVal   = inventory.reduce((s, i) => s + i.stock * i.price, 0)
    const critical   = inventory.filter(i => stockLevel(i) === 'critical').length
    const low        = inventory.filter(i => stockLevel(i) === 'low').length
    const healthy    = inventory.filter(i => stockLevel(i) === 'healthy').length
    return { total: inventory.length, totalVal, critical, low, healthy }
  }, [inventory])

  /* Category breakdown */
  const { catGroups, maxCatVal } = useMemo(() => {
    const groups = {}
    inventory.forEach(item => {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    })
    const maxCatVal = Math.max(...Object.values(groups).map(items =>
      items.reduce((s, i) => s + i.stock * i.price, 0)
    ), 1)
    return { catGroups: groups, maxCatVal }
  }, [inventory])

  /* Bar chart data */
  const barData = useMemo(() =>
    Object.entries(catGroups).map(([cat, items]) => ({
      cat: cat.replace('Food & Bev', 'Food'),
      val: items.reduce((s, i) => s + i.stock * i.price, 0),
      fill: CATEGORY_HEX[cat],
    })),
    [catGroups]
  )

  /* Area chart (mock 7-day trend) */
  const trendData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let base = metrics?.totalVal ?? 180000
    return days.map(day => {
      base = base * (0.97 + Math.random() * .06)
      return { day, value: Math.round(base) }
    })
  }, [metrics?.totalVal])

  /* Recent updates */
  const recentItems = useMemo(() =>
    [...inventory]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 7),
    [inventory]
  )

  if (loading && !inventory.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 14 }}>
        <Spinner size={28} />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading inventory…</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1140 }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-.7px', marginBottom: 4 }}>
            Dashboard Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={loadInventory} disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-raised)', border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all var(--duration) var(--ease)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          {loading
            ? <Spinner size={14} />
            : <Icon name="refresh" size={14} strokeWidth={2} style={{ transition: 'transform .4s' }} />
          }
          Refresh Data
        </button>
      </div>

      {/* ── Metric cards ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard
          icon="package2" label="Total SKUs" value={metrics?.total ?? '—'}
          color="var(--accent)"
          trend={{ up: true, label: `${Object.keys(catGroups).length} cats` }}
          delay={.04}
        />
        <MetricCard
          icon="tag" label="Portfolio Value" value={fmtCurrency(metrics?.totalVal ?? 0)}
          color="var(--info)"
          trend={{ up: true, label: '+4.2% wk' }}
          delay={.09}
        />
        <MetricCard
          icon="bell" label="Critical Alerts" value={metrics?.critical ?? 0}
          color="var(--danger)"
          trend={metrics?.critical ? { up: false, label: `${metrics.critical} items` } : undefined}
          delay={.14}
        />
        <MetricCard
          icon="check" label="Healthy Stock" value={metrics?.healthy ?? 0}
          color="var(--success)"
          trend={{ up: true, label: `${metrics ? Math.round(metrics.healthy / metrics.total * 100) : 0}%` }}
          delay={.19}
        />
      </div>

      {/* ── Middle row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Category health */}
        <Card className="animate-fade-up delay-3" style={{ padding: 22 }}>
          <SectionTitle sub={`${Object.keys(catGroups).length} categories`}>
            Category Health
          </SectionTitle>
          {Object.entries(catGroups).map(([cat, items]) => (
            <CategoryRow key={cat} cat={cat} items={items} maxVal={maxCatVal} />
          ))}
        </Card>

        {/* Recent activity */}
        <Card className="animate-fade-up delay-4" style={{ padding: 22 }}>
          <SectionTitle sub="sorted by last update">
            Recent Updates
          </SectionTitle>
          {recentItems.map((item, i) => (
            <RecentRow key={item.id} item={item} index={i} total={recentItems.length} />
          ))}
        </Card>
      </div>

      {/* ── Bottom row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>

        {/* Value trend area chart */}
        <Card className="animate-fade-up delay-4" style={{ padding: 22 }}>
          <SectionTitle sub="7-day portfolio value trend">
            Value Trend
          </SectionTitle>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={trendData} margin={{ top: 5, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={.25} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2}
                fill="url(#areaGrad)" dot={false} activeDot={{ r: 4, fill: 'var(--accent)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category bar chart */}
        <Card className="animate-fade-up delay-5" style={{ padding: 22 }}>
          <SectionTitle sub="total stock value">
            By Category
          </SectionTitle>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={barData} margin={{ top: 5, right: 8, bottom: 0, left: 0 }} barSize={18}>
              <XAxis dataKey="cat" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} opacity={.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
})
