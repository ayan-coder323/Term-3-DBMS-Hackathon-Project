/** Stock percentage 0–100 */
export const stockPct = (item) =>
  Math.round((item.stock / item.maxStock) * 100)

/** Stock level classification */
export const stockLevel = (item) => {
  if (item.stock <= item.threshold) return 'critical'
  const r = item.stock / item.maxStock
  if (r < 0.35) return 'low'
  if (r < 0.65) return 'medium'
  return 'healthy'
}

export const LEVEL_META = {
  critical: { label: 'Critical', color: 'var(--danger)',  dim: 'var(--danger-dim)',  hex: '#f05252' },
  low:      { label: 'Low',      color: 'var(--warning)', dim: 'var(--warning-dim)', hex: '#f5a623' },
  medium:   { label: 'Medium',   color: '#6b7280',        dim: 'rgba(107,114,128,.12)', hex: '#6b7280' },
  healthy:  { label: 'Healthy',  color: 'var(--success)', dim: 'var(--success-dim)', hex: '#22d68f' },
}

/** Currency formatter */
export const fmtCurrency = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

/** Short date */
export const fmtDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Relative time */
export const fmtRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime()
  const h    = Math.floor(diff / 3_600_000)
  const m    = Math.floor(diff / 60_000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

/** Clamp number */
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
