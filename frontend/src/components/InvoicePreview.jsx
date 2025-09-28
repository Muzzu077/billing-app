import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

const InvoicePreview = ({ invoiceData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [terms, setTerms] = useState([
    'Prices are inclusive of all taxes',
    'Validity only 2 days.',
    'Material Supply 4-5 working Days.',
  ]);
  const [signature, setSignature] = useState({
    name: 'Gadwala Kalimulla',
    phone: '+919885327992'
  });
  const [lastSaved, setLastSaved] = useState(null); // kept for potential future use

  const {
    companyName = 'HAVELLS',
    clientName = 'Customer Name',
    clientAddress = 'Customer Address',
    clientPhone = 'Phone Number',
    invoiceDate = new Date().toISOString().split('T')[0],
    invoiceNumber = 'INV-' + Math.floor(Math.random() * 10000),
    items = [
      { description: '1.0 Sqmm 90 Mtrs', quantity: 1, listPrice: 2230, coilPrice: 1468 },
      { description: '1.5 Sqmm 90 Mtrs', quantity: 1, listPrice: 3265, coilPrice: 2150 },
      { description: '2.5 Sqmm 90 Mtrs', quantity: 1, listPrice: 5210, coilPrice: 3430 },
      { description: '4.0 Sqmm 90 Mtrs', quantity: 1, listPrice: 7625, coilPrice: 5021 },
    ],
    taxRate = 18,
  } = invoiceData || {};

  // Calculate total (no GST)
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * (item.coilPrice || 0)), 0);
  const grandTotal = subtotal; // No GST added

  // Format date as "DD/MMM" (e.g., "23/AUG")
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
      return `${day}/${month}`;
    } catch (e) {
      return '23/AUG'; // Fallback date
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      useGrouping: true
    });
  };

  // Prefer the configured logo from invoice data (picked from constants/brands.js)
  const brandLogo = invoiceData?.brandLogo || invoiceData?.companyLogo || '';

  const handleExport = () => {
    const element = document.getElementById('invoice-content');
    const editButtons = document.querySelectorAll('.edit-btn, .edit-signature-btn');
    
    // Hide edit buttons before exporting
    editButtons.forEach((btn) => { btn.style.display = 'none'; });
    
    const opt = {
      margin: [10, 10, 15, 10],
      filename: `invoice-${invoiceNumber}.pdf`,
      image: { type: 'png', quality: 1.0 },
      html2canvas: { 
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff',
        letterRendering: false,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      onclone: function(clonedDoc) {
        // Hide edit buttons in cloned document
        const clonedBtns = clonedDoc.querySelectorAll('.edit-btn, .edit-signature-btn');
        clonedBtns.forEach((btn) => { btn.style.display = 'none'; });

        // Inject print-targeted styles to stabilize list and signature spacing
        const style = clonedDoc.createElement('style');
        style.textContent = `
          #invoice-content .terms-list { list-style-position: outside; margin-left: 0; padding-left: 20px; }
          #invoice-content .terms-list li { line-height: 1.55; margin: 3px 0; display: list-item; }
          #invoice-content .signature-svg { text-rendering: geometricPrecision; }
          #invoice-content .terms-section { margin-top: 14px !important; }
          #invoice-content .signature-section { margin-top: 16px !important; padding-top: 10px !important; border-top: 1px solid #e5e7eb !important; }
          #invoice-content .terms-section, #invoice-content .signature-section { break-inside: avoid; page-break-inside: avoid; }
          /* Table used only for print conversion */
          #invoice-content table.terms-table { width: 100%; border-collapse: collapse; margin: 0; padding: 0; }
          #invoice-content table.terms-table td { font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #1f2937; line-height: 1.55; }
          #invoice-content table.terms-table td.num { width: 22px; color: #111827; vertical-align: top; padding: 2px 10px 2px 0; }
          #invoice-content table.terms-table td.txt { padding: 2px 0; }
        `;
        clonedDoc.head.appendChild(style);

        // Convert ordered list into a fixed-layout table for PDF to avoid misalignment
        const ol = clonedDoc.querySelector('#invoice-content .terms-list');
        if (ol) {
          const items = Array.from(ol.querySelectorAll('li')).map((li, idx) => ({
            n: idx + 1,
            text: li.textContent || ''
          }));
          const table = clonedDoc.createElement('table');
          table.className = 'terms-table';
          items.forEach((it) => {
            const tr = clonedDoc.createElement('tr');
            const tdNum = clonedDoc.createElement('td');
            const tdText = clonedDoc.createElement('td');
            tdNum.textContent = it.n + '.';
            tdNum.className = 'num';
            tdText.textContent = it.text;
            tdText.className = 'txt';
            tr.appendChild(tdNum);
            tr.appendChild(tdText);
            table.appendChild(tr);
          });
          ol.replaceWith(table);
        }

        // Add a small spacer at bottom to avoid clipping
        const root = clonedDoc.getElementById('invoice-content');
        if (root) {
          const spacer = clonedDoc.createElement('div');
          spacer.style.height = '24px';
          root.appendChild(spacer);
        }
      }
    };
    
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Show edit buttons again after export
        editButtons.forEach((btn) => { btn.style.display = 'inline-block'; });
      });
  };

  return (
    <div className="card max-w-3xl mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <a href="#/history" className="btn btn-outline">
          History
        </a>
        <a href="#/save" className="btn btn-outline">Saved Bills</a>
        <button
          onClick={async () => {
            try {
              const payload = {
                brand: companyName,
                customerName: clientName,
                date: invoiceDate,
                products: items.map((it) => ({
                  description: it.description,
                  qty: it.quantity,
                  listPrice: Number(it.listPrice || 0),
                  coilPrice: Number(it.coilPrice || it.unitPrice || 0),
                  total: Number(it.quantity) * Number(it.coilPrice || it.unitPrice || 0),
                })),
                subtotal: subtotal,
                gst: 0,
                total: grandTotal,
              };
              const res = await fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              const created = await res.json();
              if (!res.ok) throw new Error(created.message || 'Failed to save');
              setLastSaved(created);
              try {
                const raw = sessionStorage.getItem('session_saved_bills');
                const arr = raw ? JSON.parse(raw) : [];
                arr.unshift(created);
                sessionStorage.setItem('session_saved_bills', JSON.stringify(arr));
              } catch (e) {
                console.warn('Failed to cache saved bills in sessionStorage:', e);
              }
              toast.success('Bill saved! Check it in Saved Bills page.');
            } catch (e) {
              console.error('Error saving bill:', e);
              alert('Failed to save bill: ' + e.message);
            }
          }}
          className="btn btn-outline"
        >
          Save Bill
        </button>
        <button
          onClick={handleExport}
          className="btn btn-primary"
        >
          Export to PDF
        </button>
      </div>

      {/* Saved bills session panel moved to separate page (#/save) */}

        <div
          id="invoice-content"
          style={{
            fontFamily: 'Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            fontVariantLigatures: 'none',
            fontKerning: 'none',
            fontFeatureSettings: '"liga" 0, "clig" 0',
            textRendering: 'geometricPrecision',
          }}
        >

        {/* Header: Brand logo (top) + Date (bottom) */}
        <div className="mb-6">
          <div className="flex items-center" style={{ height: '100px' }}>
            {brandLogo && (
              <img
                src={brandLogo}
                alt="brand"
                className="h-full w-auto object-contain"
                style={{ maxWidth: '360px', maxHeight: '100px', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
          </div>
          <div className="text-gray-700 font-medium mt-2 text-right" style={{ fontSize: '14px' }}>
            Date of Offer {formatDate(invoiceDate)}
          </div>
        </div>

        <p className="mb-4 text-gray-800">Dear Sir,</p>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm dark:border-gray-700">
            <thead>
              <tr>
                <th className="bg-red-600 text-white p-2 text-left font-bold text-base" colSpan="5">
                  {companyName} (FR)
                </th>
              </tr>
              <tr className="bg-blue-900 text-white text-left">
                <th className="p-2 border-r">Description</th>
                <th className="p-2 border-r w-16 text-center">Qty</th>
                <th className="p-2 border-r w-24 text-right">List Price</th>
                <th className="p-2 border-r w-24 text-right">COIL PRICE</th>
                <th className="p-2 w-32 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-right">₹{formatNumber(item.listPrice)}</td>
                  <td className="p-2 text-right">₹{formatNumber(item.coilPrice || item.unitPrice)}</td>
                  <td className="p-2 text-right">
                    ₹{formatNumber(item.quantity * (item.coilPrice || item.unitPrice || 0))}
                  </td>
                </tr>
              ))}
              {/* Total */}
              <tr className="bg-yellow-200 font-bold border-t-2 border-gray-600 dark:bg-yellow-300/30 dark:border-gray-700">
                <td colSpan="4" className="p-2 text-right">TOTAL</td>
                <td className="p-2 text-right">₹{formatNumber(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
          </div>

          {/* Terms & Conditions */}
          <div className="terms-section mt-8 border border-gray-400 p-4 text-sm dark:border-gray-700" style={{ pageBreakInside: 'avoid' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold tracking-wide">TERMS & CONDITIONS</p>
              <button
                className="edit-btn text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                onClick={(e) => { e.preventDefault(); setIsEditingTerms(!isEditingTerms); }}
              >
                {isEditingTerms ? 'Save Terms' : 'Edit Terms'}
              </button>
            </div>

            {isEditingTerms ? (
              <div className="space-y-2">
                {terms.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-right select-none text-gray-700">{idx + 1}.</span>
                    <input
                      type="text"
                      value={t}
                      onChange={(e) => {
                        const next = [...terms];
                        next[idx] = e.target.value;
                        setTerms(next);
                      }}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      className="text-red-600 text-xs"
                      onClick={() => {
                        const next = terms.filter((_, i) => i !== idx);
                        setTerms(next.length ? next : ['']);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="mt-2 text-xs bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
                  onClick={() => setTerms([...terms, ''])}
                >
                  Add Line
                </button>
              </div>
            ) : (
              <div>
                {terms.map((t, idx) => (
                  <div key={idx} className="flex items-start leading-relaxed" style={{ marginBottom: '6px' }}>
                    <span style={{ width: '20px', textAlign: 'right', paddingRight: '8px' }}>{idx + 1}.</span>
                    <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', flex: 1 }}>{t}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Regards directly under Terms */}
            <div className="mt-4 text-sm" style={{ pageBreakInside: 'avoid' }}>
              <div className="flex items-center">
                <p className="mr-2 font-bold" style={{ fontSize: '16px' }}>Regards,</p>
                <button 
                  onClick={(e) => { e.preventDefault(); setIsEditing(!isEditing); }}
                  className="edit-signature-btn edit-btn text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <div className="mt-3 border p-3 rounded bg-white">
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Name:</label>
                    <input
                      type="text"
                      value={signature.name}
                      onChange={(e) => setSignature({ ...signature, name: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone:</label>
                    <input
                      type="tel"
                      value={signature.phone}
                      onChange={(e) => setSignature({ ...signature, phone: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <svg className="signature-svg" width="100%" height="48" viewBox="0 0 600 48" preserveAspectRatio="xMinYMin meet" style={{ display: 'block' }}>
                    <text x="0" y="18" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="400" fill="#111827" textRendering="geometricPrecision">{signature.name}</text>
                    <text x="0" y="36" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="400" fill="#111827" textRendering="geometricPrecision">{signature.phone}</text>
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
