import { memo, useMemo, useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import { Badge, StockBar, Pill, Card, Spinner } from '../components/UI'
import { CATEGORIES, CATEGORY_HEX } from '../data/mockData'
import { stockLevel, stockPct, fmtCurrency, fmtRelative, LEVEL_META } from '../utils/helpers'

const PER_PAGE = 12

/* ── Sortable column header ──────────────────────────────────── */
const SortTh = memo(({ label, field, sortKey, sortDir, onSort, width }) => {
  const active = sortKey === field
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: '10px 14px', fontSize: 10, fontWeight: 600,
        color: active ? 'var(--accent)' : 'var(--text-tertiary)',
        letterSpacing: '.5px', textTransform: 'uppercase',
        cursor: 'pointer', userSelect: 'none',
        textAlign: 'left', whiteSpace: 'nowrap',
        width, background: active ? 'rgba(91,138,248,.05)' : 'transparent',
        transition: 'all var(--duration) var(--ease)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}
        <span style={{ opacity: active ? .8 : .3, fontSize: 9 }}>
          {active ? (sortDir === 1 ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  )
})

/* ── Stock controls ──────────────────────────────────────────── */
const StockControls = memo(({ item, onUpdate }) => {
  const [hovered, setHovered] = useState('')
  const btnBase = {
    padding: '4px 9px', borderRadius: 'var(--radius-sm)',
    fontSize: 11, fontWeight: 700, cursor: 'pointer',
    transition: 'all var(--duration) var(--ease)',
    display: 'flex', alignItems: 'center',
  }
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      <button
        onClick={() => onUpdate(item.id, 10)}
        onMouseEnter={() => setHovered('add')}
        onMouseLeave={() => setHovered('')}
        style={{
          ...btnBase,
          background: hovered === 'add' ? 'var(--success-dim)' : 'transparent',
          border: '1px solid rgba(34,214,143,.3)',
          color: 'var(--success)',
        }}
      >
        +10
      </button>
      <button
        onClick={() => onUpdate(item.id, -10)}
        onMouseEnter={() => setHovered('sub')}
        onMouseLeave={() => setHovered('')}
        style={{
          ...btnBase,
          background: hovered === 'sub' ? 'var(--danger-dim)' : 'transparent',
          border: '1px solid rgba(240,82,82,.3)',
          color: 'var(--danger)',
        }}
      >
        −10
      </button>
    </div>
  )
})

/* ── Table row ───────────────────────────────────────────────── */
const InventoryRow = memo(({ item, onUpdate, even, isAdmin }) => {
  const lv   = stockLevel(item)
  const catC = CATEGORY_HEX[item.category]

  return (
    <tr style={{
      background: even ? 'transparent' : 'rgba(255,255,255,.013)',
      transition: 'background var(--duration) var(--ease)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(91,138,248,.05)'}
    onMouseLeave={e => e.currentTarget.style.background = even ? 'transparent' : 'rgba(255,255,255,.013)'}
    >
      {/* Product */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{item.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{item.supplier}</div>
      </td>
      {/* Category */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 9px',
          borderRadius: 'var(--radius-full)',
          background: `${catC}18`, color: catC,
        }}>
          {item.category}
        </span>
      </td>
      {/* SKU */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
        {item.sku}
      </td>
      {/* Stock + bar */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', minWidth: 140 }}>
        <div style={{ fontSize: 12, marginBottom: 5 }}>
          <span style={{ fontWeight: 600 }}>{item.stock}</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}> / {item.maxStock}</span>
        </div>
        <StockBar item={item} showLabel />
      </td>
      {/* Price */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13, fontWeight: 600, color: 'var(--info)' }}>
        ${item.price.toFixed(2)}
      </td>
      {/* Value */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
        {fmtCurrency(item.stock * item.price)}
      </td>
      {/* Status */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <Badge level={lv} />
      </td>
      {/* Updated */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        {fmtRelative(item.updatedAt)}
      </td>
      {/* Actions */}
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        {isAdmin ? (
          <StockControls item={item} onUpdate={onUpdate} />
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="lock" size={12} /> Read-only
          </span>
        )}
      </td>
    </tr>
  )
})

/* ── Main ─────────────────────────────────────────────────────── */
export default memo(function InventoryPage() {
  const { inventory, loading, updateStock, addToast, user } = useApp()
  const isAdmin = user?.role === 'Inventory Manager'

  const [search,      setSearch]      = useState('')
  const [catFilter,   setCatFilter]   = useState('All')
  const [levelFilter, setLevelFilter] = useState('all')
  const [sortKey,     setSortKey]     = useState('name')
  const [sortDir,     setSortDir]     = useState(1)
  const [page,        setPage]        = useState(0)

  const handleUpdate = useCallback((id, delta) => {
    updateStock(id, delta)
    addToast(`${delta > 0 ? `+${delta}` : delta} units updated`, 'success')
  }, [updateStock, addToast])

  const toggleSort = useCallback((field) => {
    setSortKey(prev => {
      if (prev === field) setSortDir(d => -d)
      else { setSortDir(1) }
      return field
    })
    setPage(0)
  }, [])

  const filtered = useMemo(() => {
    let d = [...inventory]
    if (search) {
      const q = search.toLowerCase()
      d = d.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.supplier.toLowerCase().includes(q)
      )
    }
    if (catFilter !== 'All')   d = d.filter(i => i.category === catFilter)
    if (levelFilter !== 'all') d = d.filter(i => stockLevel(i) === levelFilter)

    d.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string') return av.localeCompare(bv) * sortDir
      return (av - bv) * sortDir
    })
    return d
  }, [inventory, search, catFilter, levelFilter, sortKey, sortDir])

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  /* Summary strip */
  const summary = useMemo(() => ({
    critical: filtered.filter(i => stockLevel(i) === 'critical').length,
    low:      filtered.filter(i => stockLevel(i) === 'low').length,
    healthy:  filtered.filter(i => stockLevel(i) === 'healthy').length,
    value:    filtered.reduce((s, i) => s + i.stock * i.price, 0),
  }), [filtered])

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="animate-fade-up" style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-.7px', marginBottom: 4 }}>
          Inventory
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {inventory.length} total items across {CATEGORIES.length} categories
        </p>
      </div>

      {/* ── Summary strip ────────────────────────────────────── */}
      <div className="animate-fade-up delay-1" style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Showing',  val: filtered.length,          color: 'var(--text-primary)' },
          { label: 'Critical', val: summary.critical,         color: 'var(--danger)' },
          { label: 'Low',      val: summary.low,              color: 'var(--warning)' },
          { label: 'Healthy',  val: summary.healthy,          color: 'var(--success)' },
          { label: 'Value',    val: fmtCurrency(summary.value), color: 'var(--info)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            padding: '8px 14px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="animate-fade-up delay-2" style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }}>
            <Icon name="search" size={14} />
          </div>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search name, SKU, category, supplier…"
            style={{
              width: '100%', background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '9px 12px 9px 36px',
              color: 'var(--text-primary)', fontSize: 13,
              outline: 'none',
              transition: 'border-color var(--duration) var(--ease)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES].map(c => (
            <Pill
              key={c} label={c} active={catFilter === c}
              color={c !== 'All' ? CATEGORY_HEX[c] : undefined}
              onClick={() => { setCatFilter(c); setPage(0) }}
            />
          ))}
        </div>

        {/* Level pills */}
        <div style={{ display: 'flex', gap: 5 }}>
          {[['all', 'All Levels'], ...Object.entries(LEVEL_META).map(([k, m]) => [k, m.label])].map(([val, lbl]) => (
            <Pill
              key={val} label={lbl} active={levelFilter === val}
              color={val !== 'all' ? LEVEL_META[val]?.hex : undefined}
              onClick={() => { setLevelFilter(val); setPage(0) }}
            />
          ))}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <Card className="animate-fade-up delay-3" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr>
                <SortTh label="Product"  field="name"     sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="22%" />
                <SortTh label="Category" field="category" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="11%" />
                <SortTh label="SKU"      field="sku"      sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="10%" />
                <SortTh label="Stock"    field="stock"    sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="15%" />
                <SortTh label="Price"    field="price"    sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="8%"  />
                <SortTh label="Value"    field="stock"    sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="8%"  />
                <SortTh label="Status"   field="stock"    sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="9%"  />
                <SortTh label="Updated"  field="updatedAt"sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} width="8%"  />
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '.5px', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '9%' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((item, idx) => (
                <InventoryRow
                  key={item.id} item={item}
                  onUpdate={handleUpdate}
                  even={idx % 2 === 0}
                  isAdmin={isAdmin}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {paged.length === 0 && !loading && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ marginBottom: 12, color: 'var(--text-tertiary)' }}>
              <Icon name="box" size={40} strokeWidth={1} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No items found</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Try adjusting your filters</div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderTop: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  style={{
                    width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                    background: page === i ? 'var(--accent)' : 'var(--bg-raised)',
                    border: `1px solid ${page === i ? 'var(--accent)' : 'var(--border-default)'}`,
                    color: page === i ? '#fff' : 'var(--text-secondary)',
                    fontSize: 12, fontWeight: page === i ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all var(--duration) var(--ease)',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
})
