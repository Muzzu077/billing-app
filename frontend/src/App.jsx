import { useMemo, useState } from 'react';
import { BRANDS } from './constants/brands.js';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import { useThemeMode } from './context/ThemeContext.jsx';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import './index.css';

function App() {
  const { isAuthenticated, admin } = useAuth();
  const { theme, toggle } = useThemeMode();
  const defaultBrand = BRANDS.find(b => b.key === 'havells') || BRANDS[0];
  const [invoiceData, setInvoiceData] = useState({
    companyName: defaultBrand?.name || "Havells",
    companyLogo: defaultBrand?.logo,
    brandLogo: defaultBrand?.logo,
    brandKey: defaultBrand?.key,
    companyAddress: "123 Industrial Area, Hyderabad",
    clientName: "John Doe",
    clientAddress: "456 Residential St, Bangalore",
    clientPhone: "9876543210",
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
    <div className={"min-h-screen p-8 " + (theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900')}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Invoice Generator</h1>
          <button onClick={toggle} className="px-3 py-2 rounded border">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        {!isAuthenticated ? (
          <Login />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
            <InvoicePreview invoiceData={{ ...invoiceData, items: effectiveItems }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;