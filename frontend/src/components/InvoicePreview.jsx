import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';
import { Download, Save, Clock, FileText } from 'lucide-react';

const InvoicePreview = ({ invoiceData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [terms, setTerms] = useState([
    'Prices are inclusive of all taxes',
    'Validity only 2 days.',
    'Material Supply 4-5 working Days.',
  ]);
  const [signature, setSignature] = useState({
    name: 'Gadwala Kalimulla',
    phone: '+919885327992'
  });

  const {
    companyName = 'HAVELLS',
    clientName = 'Customer Name',
    invoiceDate = new Date().toISOString().split('T')[0],
    invoiceNumber = 'INV-001',
    items = [{ description: '1.0 Sqmm 90 Mtrs', quantity: 1, listPrice: 2230, coilPrice: 1468 }],
  } = invoiceData || {};

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.coilPrice || 0)), 0);
  const grandTotal = subtotal;

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, '0')}/${d.toLocaleString('default', { month: 'short' }).toUpperCase()}`;
    } catch { return '01/JAN'; }
  };

  const formatNumber = (num) => Number(num || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const brandLogo = invoiceData?.brandLogo || invoiceData?.companyLogo || '';

  const getFireRatingSuffix = () => {
    const n = (companyName || '').trim().toUpperCase();
    return (n === 'HAVELLS' || n === 'APAR') ? '(HRFR)' : '(FR)';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        brand: companyName,
        customerName: clientName,
        date: invoiceDate,
        products: items.map((it) => ({
          description: it.description, qty: Number(it.quantity),
          listPrice: Number(it.listPrice || 0), coilPrice: Number(it.coilPrice || 0),
          total: Number(it.quantity) * Number(it.coilPrice || 0),
        })),
        subtotal, gst: 0, total: grandTotal,
      };
      const created = await apiFetch('/quotations', { method: 'POST', body: JSON.stringify(payload) });
      try {
        const arr = JSON.parse(sessionStorage.getItem('session_saved_bills') || '[]');
        arr.unshift(created);
        sessionStorage.setItem('session_saved_bills', JSON.stringify(arr));
      } catch {}
      toast.success('Bill saved!');
    } catch (e) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Lazy-load html2pdf only when needed
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('invoice-content');
      const editButtons = document.querySelectorAll('.edit-btn, .edit-signature-btn');
      editButtons.forEach((btn) => { btn.style.display = 'none'; });

      await html2pdf().set({
        margin: [10, 10, 15, 10],
        filename: `invoice-${invoiceNumber}.pdf`,
        image: { type: 'png', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff', logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        onclone(clonedDoc) {
          clonedDoc.querySelectorAll('.edit-btn, .edit-signature-btn').forEach(b => b.style.display = 'none');
          const style = clonedDoc.createElement('style');
          style.textContent = `
            #invoice-content .terms-section, #invoice-content .signature-section { break-inside: avoid; page-break-inside: avoid; }
            #invoice-content table.terms-table { width: 100%; border-collapse: collapse; }
            #invoice-content table.terms-table td { font-family: Arial, sans-serif; font-size: 14px; color: #1f2937; line-height: 1.55; }
            #invoice-content table.terms-table td.num { width: 22px; vertical-align: top; padding: 2px 10px 2px 0; }
          `;
          clonedDoc.head.appendChild(style);

          const ol = clonedDoc.querySelector('#invoice-content .terms-list');
          if (ol) {
            const tbl = clonedDoc.createElement('table');
            tbl.className = 'terms-table';
            Array.from(ol.querySelectorAll('li')).forEach((li, i) => {
              const tr = clonedDoc.createElement('tr');
              tr.innerHTML = `<td class="num">${i + 1}.</td><td>${li.textContent}</td>`;
              tbl.appendChild(tr);
            });
            ol.replaceWith(tbl);
          }
        }
      }).from(element).save();

      editButtons.forEach((btn) => { btn.style.display = 'inline-block'; });
    } catch (e) {
      toast.error('Export failed: ' + e.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="glass-card max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in animate-stagger-2">
      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-2 mb-5">
        <a href="#/history" className="btn btn-outline text-xs"><Clock className="h-3.5 w-3.5" /> History</a>
        <a href="#/save" className="btn btn-outline text-xs"><FileText className="h-3.5 w-3.5" /> Saved</a>
        <button onClick={handleSave} disabled={saving} className="btn btn-outline text-xs">
          <Save className="h-3.5 w-3.5" /> {saving ? 'Saving...' : 'Save Bill'}
        </button>
        <button onClick={handleExport} disabled={exporting} className="btn btn-primary text-xs">
          <Download className="h-3.5 w-3.5" /> {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      {/* Invoice (always white for print/PDF) */}
      <div
        id="invoice-content"
        className="bg-white text-slate-900 rounded-2xl shadow-sm p-6 md:p-10 border border-slate-200"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif', textRendering: 'geometricPrecision' }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center" style={{ height: '100px' }}>
            {brandLogo && (
              <img src={brandLogo} alt="brand" className="h-full w-auto object-contain"
                style={{ maxWidth: '360px', maxHeight: '100px' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
          </div>
          <div className="text-gray-700 font-medium mt-2 text-right" style={{ fontSize: '14px' }}>
            Date of Offer {formatDate(invoiceDate)}
          </div>
        </div>

        <p className="mb-4 text-gray-800">Dear Sir,</p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <thead>
              <tr><th className="bg-red-600 text-white p-2 text-left font-bold text-base" colSpan="5">{companyName} {getFireRatingSuffix()}</th></tr>
              <tr className="bg-blue-900 text-white text-left">
                <th className="p-2 border-r border-blue-800">Description</th>
                <th className="p-2 border-r border-blue-800 w-16 text-center">Qty</th>
                <th className="p-2 border-r border-blue-800 w-24 text-right">List Price</th>
                <th className="p-2 border-r border-blue-800 w-24 text-right">COIL PRICE</th>
                <th className="p-2 w-32 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t border-gray-300">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-right">{formatNumber(item.listPrice)}</td>
                  <td className="p-2 text-right">{formatNumber(item.coilPrice)}</td>
                  <td className="p-2 text-right">{formatNumber(Number(item.quantity) * Number(item.coilPrice || 0))}</td>
                </tr>
              ))}
              <tr className="bg-yellow-200 font-bold border-t-2 border-gray-600">
                <td colSpan="4" className="p-2 text-right">TOTAL</td>
                <td className="p-2 text-right">{formatNumber(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms */}
        <div className="terms-section mt-8 border border-gray-400 p-4 text-sm" style={{ pageBreakInside: 'avoid' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold tracking-wide">TERMS & CONDITIONS</p>
            <button className="edit-btn text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-gray-700"
              onClick={(e) => { e.preventDefault(); setIsEditingTerms(!isEditingTerms); }}>
              {isEditingTerms ? 'Save Terms' : 'Edit Terms'}
            </button>
          </div>

          {isEditingTerms ? (
            <div className="space-y-2">
              {terms.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-right select-none text-gray-700">{idx + 1}.</span>
                  <input type="text" value={t} onChange={(e) => { const next = [...terms]; next[idx] = e.target.value; setTerms(next); }}
                    className="flex-1 p-2 border rounded text-gray-800" />
                  <button className="text-red-600 text-xs" onClick={() => { const next = terms.filter((_, i) => i !== idx); setTerms(next.length ? next : ['']); }}>Remove</button>
                </div>
              ))}
              <button className="mt-2 text-xs bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-green-800" onClick={() => setTerms([...terms, ''])}>Add Line</button>
            </div>
          ) : (
            <div>
              {terms.map((t, idx) => (
                <div key={idx} className="flex items-start leading-relaxed" style={{ marginBottom: '6px' }}>
                  <span style={{ width: '20px', textAlign: 'right', paddingRight: '8px' }}>{idx + 1}.</span>
                  <span style={{ flex: 1 }}>{t}</span>
                </div>
              ))}
            </div>
          )}

          {/* Regards */}
          <div className="mt-4 text-sm" style={{ pageBreakInside: 'avoid' }}>
            <div className="flex items-center">
              <p className="mr-2 font-bold" style={{ fontSize: '16px' }}>Regards,</p>
              <button onClick={(e) => { e.preventDefault(); setIsEditing(!isEditing); }}
                className="edit-signature-btn edit-btn text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 text-gray-700">
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <div className="mt-3 border p-3 rounded bg-white">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Name:</label>
                  <input type="text" value={signature.name} onChange={(e) => setSignature({ ...signature, name: e.target.value })}
                    className="w-full p-2 border rounded text-gray-800 focus:ring-2 focus:ring-blue-500" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Phone:</label>
                  <input type="tel" value={signature.phone} onChange={(e) => setSignature({ ...signature, phone: e.target.value })}
                    className="w-full p-2 border rounded text-gray-800 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <svg width="100%" height="48" viewBox="0 0 600 48" preserveAspectRatio="xMinYMin meet" style={{ display: 'block' }}>
                  <text x="0" y="18" fontFamily="Arial, sans-serif" fontSize="15" fill="#111827">{signature.name}</text>
                  <text x="0" y="36" fontFamily="Arial, sans-serif" fontSize="15" fill="#111827">{signature.phone}</text>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
