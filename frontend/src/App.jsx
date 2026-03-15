import { useEffect, useMemo, useState } from 'react';
import { BRANDS } from './constants/brands.js';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Save from './pages/Save.jsx';
import History from './pages/History.jsx';
import { useThemeMode } from './context/ThemeContext.jsx';
import { Toaster } from 'react-hot-toast';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { Zap, Sun, Moon, LogOut, FileText, Clock, PlusCircle } from 'lucide-react';

const defaultBrand = BRANDS.find(b => b.key === 'havells') || BRANDS[0];

const INITIAL_INVOICE = {
  companyName: defaultBrand?.name || 'HAVELLS',
  companyLogo: defaultBrand?.logo,
  brandLogo: defaultBrand?.logo,
  brandKey: defaultBrand?.key,
  companyAddress: '',
  clientName: '',
  clientAddress: '',
  clientPhone: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
  items: [
    { description: '1.0 Sqmm 90 Mtrs', quantity: 10, listPrice: 2230, coilPrice: 1468 },
    { description: '4.0 Sqmm 90 Mtrs', quantity: 5, listPrice: 7625, coilPrice: 5021 },
  ],
  taxRate: 0,
};

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || '/');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

function App() {
  const { isAuthenticated, admin } = useAuth();
  const { theme, toggle } = useThemeMode();
  const route = useHashRoute();
  const [invoiceData, setInvoiceData] = useState(INITIAL_INVOICE);

  // Load edit_quotation from localStorage when navigating back to home
  useEffect(() => {
    try {
      const raw = localStorage.getItem('edit_quotation');
      if (!raw) return;
      const q = JSON.parse(raw);
      const brandEntry = BRANDS.find(b => (b.name || '').toLowerCase() === (q.brand || '').toLowerCase());
      setInvoiceData({
        companyName: q.brand || INITIAL_INVOICE.companyName,
        brandKey: brandEntry?.key || INITIAL_INVOICE.brandKey,
        companyLogo: brandEntry?.logo || INITIAL_INVOICE.companyLogo,
        brandLogo: brandEntry?.logo || INITIAL_INVOICE.brandLogo,
        companyAddress: INITIAL_INVOICE.companyAddress,
        clientName: q.customerName || '',
        clientAddress: q.customerAddress || '',
        clientPhone: q.customerPhone || '',
        invoiceDate: q.date ? new Date(q.date).toISOString().split('T')[0] : INITIAL_INVOICE.invoiceDate,
        invoiceNumber: q.invoiceNumber || INITIAL_INVOICE.invoiceNumber,
        items: Array.isArray(q.products) ? q.products.map(p => ({
          description: p.description,
          quantity: Number(p.qty || p.quantity || 1),
          listPrice: Number(p.listPrice || 0),
          coilPrice: Number(p.coilPrice || p.unitPrice || 0),
        })) : INITIAL_INVOICE.items,
        taxRate: 0,
      });
    } catch (e) {
      console.warn('Failed to load edit_quotation:', e);
    } finally {
      localStorage.removeItem('edit_quotation');
    }
  }, [route]);

  const effectiveItems = useMemo(() => {
    const multiplier = admin?.priceMultiplier || 1;
    return invoiceData.items.map((it) => ({
      ...it,
      listPrice: Number(it.listPrice ?? 0) * multiplier,
      coilPrice: Number(it.coilPrice ?? 0) * multiplier,
    }));
  }, [invoiceData.items, admin]);

  const navItems = [
    { path: '/', label: 'New Bill', icon: PlusCircle },
    { path: '/save', label: 'Saved', icon: FileText },
    { path: '/history', label: 'History', icon: Clock },
  ];

  const renderPage = () => {
    if (route === '/logout') return <Logout />;
    if (!isAuthenticated) return <Login />;
    if (route === '/save') return <Save />;
    if (route === '/history') return <History />;
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
        <InvoicePreview invoiceData={{ ...invoiceData, items: effectiveItems }} />
      </div>
    );
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Toaster position="top-right" />

        {/* Header */}
        <header className="glass-card mb-6 md:mb-8 p-4 md:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-sm">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                  Ayesha Electricals
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 tracking-wide uppercase">Quotation Generator</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <>
                  {/* Navigation Tabs */}
                  <nav className="flex bg-slate-100 dark:bg-slate-800/60 rounded-xl p-1 mr-2">
                    {navItems.map(({ path, label, icon: Icon }) => (
                      <a
                        key={path}
                        href={`#${path}`}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
                          route === path
                            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{label}</span>
                      </a>
                    ))}
                  </nav>

                  <span className="text-xs text-slate-400 hidden md:inline mr-2">
                    {admin?.displayName || admin?.username}
                  </span>
                  <a href="#/logout" className="btn-icon text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" title="Logout">
                    <LogOut className="h-4 w-4" />
                  </a>
                </>
              )}
              <button onClick={toggle} className="btn-icon" title="Toggle theme">
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
              </button>
            </div>
          </div>
        </header>

        {renderPage()}
      </div>
    </div>
  );
}

export default App;
