/**
 * Lightweight inline SVG icon component.
 * All icons are hand-tuned for 20px optical clarity.
 */
const PATHS = {
  grid: [
    'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
  ],
  box: [
    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    'M3.27 6.96 12 12.01l8.73-5.05',
    'M12 22.08V12',
  ],
  bar: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  bell: [
    'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9',
    'M13.73 21a2 2 0 0 1-3.46 0',
  ],
  logout: [
    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
    'M16 17l5-5-5-5',
    'M21 12H9',
  ],
  refresh: [
    'M23 4v6h-6',
    'M1 20v-6h6',
    'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  ],
  search: { circles: [{ cx: 11, cy: 11, r: 8 }], paths: ['M21 21l-4.35-4.35'] },
  user:   { circles: [{ cx: 12, cy: 8, r: 4 }], paths: ['M4 20c0-4 3.58-7 8-7s8 3 8 7'] },
  lock: [
    'M21 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    'M7 11V7a5 5 0 0 1 10 0v4',
  ],
  eye:    { circles: [{ cx: 12, cy: 12, r: 3 }], paths: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'] },
  eyeoff: [
    'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24',
    'M1 1l22 22',
  ],
  check:    ['M20 6 9 17l-5-5'],
  x:        ['M18 6 6 18', 'M6 6l12 12'],
  trend_up: ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
  trend_dn: ['M23 18l-9.5-9.5-5 5L1 6', 'M17 18h6v-6'],
  filter:   ['M22 3H2l8 9.46V19l4 2v-8.54z'],
  chevron_down: ['M6 9l6 6 6-6'],
  arrow_r:  ['M5 12h14', 'M12 5l7 7-7 7'],
  arrow_l:  ['M19 12H5', 'M12 19l-7-7 7-7'],
  plus:     ['M12 5v14', 'M5 12h14'],
  minus:    ['M5 12h14'],
  warehouse:[
    'M2 9.5V20h20V9.5',
    'M1 9l11-7 11 7',
    'M8 20v-8h8v8',
  ],
  tag: [
    'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
  ],
  package2: [
    'M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z',
    'M3 9l2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9',
    'M12 3v6',
  ],
  info: [
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M12 16v-4',
    'M12 8h.01',
  ],
  settings: [
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  ],
  sort: ['M3 6h18', 'M7 12h10', 'M10 18h4'],
  edit2: ['M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'],
  trash2: [
    'M3 6h18',
    'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'M10 11v6',
    'M14 11v6'
  ],
}

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '', style = {} }) {
  const def = PATHS[name]
  if (!def) return null

  const paths   = Array.isArray(def) ? def : (def.paths ?? [])
  const circles = Array.isArray(def) ? [] : (def.circles ?? [])

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {circles.map((c, i) => <circle key={i} {...c} />)}
      {paths.map((d, i)   => <path   key={i} d={d} />)}
    </svg>
  )
}
