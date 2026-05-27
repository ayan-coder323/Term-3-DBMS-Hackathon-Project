export const CATEGORIES = [
  'Electronics', 'Apparel', 'Food & Bev', 'Industrial', 'Pharma', 'Office',
]

export const CATEGORY_COLORS = {
  Electronics: 'var(--cat-electronics)',
  Apparel:     'var(--cat-apparel)',
  'Food & Bev':'var(--cat-food)',
  Industrial:  'var(--cat-industrial)',
  Pharma:      'var(--cat-pharma)',
  Office:      'var(--cat-office)',
}

export const CATEGORY_HEX = {
  Electronics: '#5b8af8',
  Apparel:     '#b06ef5',
  'Food & Bev':'#22d68f',
  Industrial:  '#f5a623',
  Pharma:      '#38c7e8',
  Office:      '#f0547a',
}

const SUPPLIERS = [
  'NovaTech Supply', 'GlobalStock Co', 'PrimeSource Ltd',
  'FastShip Inc', 'AllGoods Depot', 'ProMerchant LLC',
]

const PRODUCTS = {
  Electronics: [
    'RTX 5090 GPU', 'M4 MacBook Pro', 'Sony WH-1000XM6',
    'iPad Pro 13"', 'Samsung 4K OLED 55"', 'Logitech G Pro X2',
    'Dell XPS 15 Laptop', 'DJI Mini 4 Pro', 'Sonos Arc Ultra',
  ],
  Apparel: [
    'Premium Denim Jacket', 'Merino Wool Pullover', 'Trail Running Shorts',
    'Leather Sneakers', 'Silk Button-Up Blouse', 'Thermal Zip Hoodie',
    'Linen Trousers', 'Down Puffer Vest', 'Cotton Crew-Neck Tee',
  ],
  'Food & Bev': [
    'Organic Cold Brew 12-Pack', 'Matcha Premium Tin 100g', 'Whey Protein 5lb',
    'EVOO Artisan 750ml', 'Raw Manuka Honey 500g', 'Specialty Coffee 1kg',
    'Collagen Peptides 400g', 'Sparkling Water Variety 24pk', 'Freeze-Dried Berries 200g',
  ],
  Industrial: [
    'Safety Harness XL', 'Brushless Impact Drill 20V', 'Composite Toe Boots Size 11',
    'Auto-Dark Welding Helmet', 'Laser Level 360°', 'Digital Torque Wrench',
    'Industrial Ear Protection', 'Chemical-Resistant Gloves L', 'Scaffolding Plank Kit',
  ],
  Pharma: [
    'Vitamin D3 10,000 IU', 'Ultra Omega-3 Fish Oil', 'Elderberry Zinc Lozenges',
    'Spore-Based Probiotics', 'Magnesium Bisglycinate', 'Methyl B-Complex',
    'Ashwagandha KSM-66', 'NAC 600mg', 'CoQ10 Ubiquinol 200mg',
  ],
  Office: [
    'Ergonomic Mesh Chair', 'Anti-Fatigue Standing Mat', 'Tactile Mech Keyboard TKL',
    'Tempered Glass Whiteboard', 'Lateral File Cabinet Steel', 'Dual Monitor Arm',
    'Ring Light 18"', 'Sit-Stand Desk Frame', 'Noise-Cancelling Headset',
  ],
}

let _nextId = 1

export function generateInventory() {
  _nextId = 1
  const items = []
  CATEGORIES.forEach(cat => {
    PRODUCTS[cat].forEach(name => {
      const maxStock  = Math.floor(Math.random() * 480) + 60
      const stock     = Math.floor(Math.random() * maxStock)
      const threshold = Math.floor(maxStock * 0.2)
      items.push({
        id:         _nextId++,
        name,
        category:   cat,
        sku:        'SKU-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        stock,
        maxStock,
        threshold,
        price:      parseFloat((Math.random() * 295 + 8.99).toFixed(2)),
        supplier:   SUPPLIERS[Math.floor(Math.random() * SUPPLIERS.length)],
        updatedAt:  new Date(Date.now() - Math.random() * 7 * 86_400_000).toISOString(),
        trending:   Math.random() > .5 ? 'up' : 'down',
        trendPct:   parseFloat((Math.random() * 18 + 1).toFixed(1)),
      })
    })
  })
  return items
}

export const DEMO_USER = {
  id: 1,
  name:     'Ayan',
  email:    'ayan38540@gmail.com',
  role:     'Inventory Manager',
  initials: 'AY',
  avatar:   null,
}
