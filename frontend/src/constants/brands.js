// Brand configurations used across the app
// How to add a new brand (future-proof):
// 1) Add an entry below with a unique `key`, display `name`, and the `logo` path.
// 2) Put the logo image file in `public/logos/` and reference it like `/logos/<file>.png`.
// 3) The new brand will automatically appear in the brand selector in `components/InvoiceForm.jsx`.
// 4) The selected brand's logo will automatically show in `components/InvoicePreview.jsx`.
export const BRANDS = [
  { key: 'apar', name: 'APAR', logo: '/apar-logo.png' },
  { key: 'finolex', name: 'FINOLEX', logo: '/finolex-logo.png' },
  { key: 'gm', name: 'GM', logo: '/gm-logo.png' },
  { key: 'goldmedal', name: 'GOLDMEDAL', logo: '/goldmedal-logo.png' },
  { key: 'havels', name: 'HAVELS', logo: '/havells-logo.png' },
  { key: 'polycab', name: 'POLYCAB', logo: '/polycab-logo.png' },
  { key: 'vguard', name: 'V-GUARD', logo: '/vguard-logo.png' },
];
