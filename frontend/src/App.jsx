import { useEffect, useMemo, useState } from 'react';
import { BRANDS } from './constants/brands.js';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Save from './pages/Save.jsx';
import { useThemeMode } from './context/ThemeContext.jsx';
import { Toaster } from 'react-hot-toast';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import './index.css';

function App() {
  const { isAuthenticated, admin } = useAuth();
  const { theme, toggle } = useThemeMode();
  // Default brand key aligned with constants ("havels" currently used in list)
  const defaultBrand = BRANDS.find(b => b.key === 'havels') || BRANDS[0];
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // If a quotation was chosen from History for editing, load it into the form
  useEffect(() => {
    try {
      const raw = localStorage.getItem('edit_quotation');
      if (!raw) return;
      const q = JSON.parse(raw);
      // Attempt to find brand config by name (case-insensitive)
      const brandEntry = BRANDS.find(b => (b.name || '').toLowerCase() === (q.brand || '').toLowerCase());
      const next = {
        companyName: q.brand || invoiceData.companyName,
        brandKey: brandEntry?.key || invoiceData.brandKey,
        companyLogo: brandEntry?.logo || invoiceData.companyLogo,
        brandLogo: brandEntry?.logo || invoiceData.brandLogo,
        companyAddress: invoiceData.companyAddress,
        clientName: q.customerName || '',
        clientAddress: q.customerAddress || '',
        clientPhone: q.customerPhone || '',
        invoiceDate: q.date ? new Date(q.date).toISOString().split('T')[0] : invoiceData.invoiceDate,
        invoiceNumber: q.invoiceNumber || invoiceData.invoiceNumber,
        items: Array.isArray(q.products) ? q.products.map(p => ({
          description: p.description,
          quantity: Number(p.qty || p.quantity || 1),
          listPrice: Number(p.listPrice || 0),
          coilPrice: Number(p.coilPrice || p.unitPrice || 0),
        })) : invoiceData.items,
        taxRate: 0,
      };
      setInvoiceData(next);
    } catch (e) {
      console.warn('Failed to load edit_quotation:', e);
    } finally {
      // Clear so it doesn't override subsequent edits
      localStorage.removeItem('edit_quotation');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);
  const [invoiceData, setInvoiceData] = useState({
    companyName: defaultBrand?.name || "Havells",
    companyLogo: defaultBrand?.logo,
    brandLogo: defaultBrand?.logo,
    brandKey: defaultBrand?.key,
    companyAddress: "123 Industrial Area, Hyderabad",
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceNumber: `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`,
    items: [
      { description: "1.0 Sqmm 90 Mtrs", quantity: 10, listPrice: 2230, coilPrice: 1468 },
      { description: "4.0 Sqmm 90 Mtrs", quantity: 5, listPrice: 7625, coilPrice: 5021 },
    ],
    taxRate: 18,
  });

  // Apply admin-specific pricing (e.g., multiplier) to preview display only
  const effectiveItems = useMemo(() => {
    const multiplier = admin?.priceMultiplier || 1;
    return invoiceData.items.map((it) => ({
      ...it,
      listPrice: Number(it.listPrice ?? 0) * multiplier,
      coilPrice: Number(it.coilPrice ?? it.unitPrice ?? 0) * multiplier,
    }));
  }, [invoiceData.items, admin]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Toaster position="top-right" />
        
        {/* Sleek Glassmorphic Header */}
        <div className="glass-card mb-6 md:mb-8 p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg shadow-sky-500/30">
              {/* Lightning/Electric SVG Icon for Electrical Business */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="section-title text-2xl md:text-3xl font-extrabold tracking-wide">Quotation Core</h1>
              <p className="text-xs text-slate-400">Electrical Business Invoice Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <a href="#/logout" className="btn btn-outline border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 text-xs sm:text-sm">Logout</a>
            )}
            <button onClick={toggle} className="btn btn-outline text-xs sm:text-sm">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {route === '/logout' ? (

          <Logout />
        ) : !isAuthenticated ? (
          <Login />
        ) : route === '/save' ? (
          <Save />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
            <InvoicePreview invoiceData={{ ...invoiceData, items: effectiveItems }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;