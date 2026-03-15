import React from 'react';
import { BRANDS } from '../constants/brands.js';
import { Plus, X } from 'lucide-react';

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...invoiceData.items];
    if (name === 'quantity' || name === 'listPrice' || name === 'coilPrice') {
      items[index] = { ...items[index], [name]: value === '' ? '' : Number(value) };
    } else {
      items[index] = { ...items[index], [name]: value };
    }
    setInvoiceData({ ...invoiceData, items });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, listPrice: 0, coilPrice: 0 }],
    });
  };

  const removeItem = (index) => {
    if (invoiceData.items.length <= 1) return;
    setInvoiceData({ ...invoiceData, items: invoiceData.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="glass-card p-4 sm:p-6 animate-fade-in animate-stagger-1">
      <h2 className="section-title mb-5">Invoice Details</h2>

      {/* Brand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-5 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Brand</label>
          <select
            className="input-field w-full"
            value={invoiceData.brandKey || ''}
            onChange={(e) => {
              const selected = BRANDS.find(b => b.key === e.target.value);
              if (selected) {
                setInvoiceData({ ...invoiceData, brandKey: selected.key, companyName: selected.name, brandLogo: selected.logo, companyLogo: selected.logo });
              }
            }}
          >
            {BRANDS.map(b => <option key={b.key} value={b.key}>{b.name}</option>)}
          </select>
        </div>
        {invoiceData.companyLogo && (
          <div className="flex justify-start md:justify-end">
            <img src={invoiceData.companyLogo} alt="brand" className="h-10 object-contain rounded-lg bg-slate-100 dark:bg-slate-800 p-1.5" />
          </div>
        )}
      </div>

      {/* Client */}
      <label className="block text-xs font-medium mb-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client Details</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <input type="text" name="clientName" value={invoiceData.clientName} onChange={handleInputChange} placeholder="Client Name" className="input-field" />
        <input type="text" name="clientAddress" value={invoiceData.clientAddress} onChange={handleInputChange} placeholder="Client Address" className="input-field" />
        <input type="text" name="clientPhone" value={invoiceData.clientPhone} onChange={handleInputChange} placeholder="Client Phone" className="input-field" />
        <input type="date" name="invoiceDate" value={invoiceData.invoiceDate} onChange={handleInputChange} className="input-field" />
        <input type="text" name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleInputChange} placeholder="Invoice Number" className="input-field md:col-span-2" />
      </div>

      {/* Items */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Line Items</label>
          <button onClick={addItem} className="btn btn-outline text-xs py-1.5 px-3">
            <Plus className="h-3.5 w-3.5" /> Add Item
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-medium">Description</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-medium w-16">Qty</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-medium w-24">List Price</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-medium w-24">Coil Price</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-800 group">
                  <td className="py-1.5 px-2">
                    <input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} placeholder="Item description" className="input-field py-2 text-xs" />
                  </td>
                  <td className="py-1.5 px-2">
                    <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="input-field py-2 text-xs w-16" min="1" />
                  </td>
                  <td className="py-1.5 px-2">
                    <input type="number" name="listPrice" value={item.listPrice} onChange={(e) => handleItemChange(index, e)} className="input-field py-2 text-xs w-24" min="0" />
                  </td>
                  <td className="py-1.5 px-2">
                    <input type="number" name="coilPrice" value={item.coilPrice} onChange={(e) => handleItemChange(index, e)} className="input-field py-2 text-xs w-24" min="0" />
                  </td>
                  <td className="py-1.5 px-1">
                    <button onClick={() => removeItem(index)} className="btn-icon opacity-40 group-hover:opacity-100" title="Remove" disabled={invoiceData.items.length <= 1}>
                      <X className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
