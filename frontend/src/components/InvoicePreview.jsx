import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { BRANDS } from '../constants/brands';

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

  // Get brand logo path based on company name
  const getBrandLogo = (brandName) => {
    const logoMap = {
      'APAR': '/apar-logo.png',
      'FINOLEX': '/finolex-logo.png',
      'GM': '/gm-logo.png',
      'GOLDMEDAL': '/goldmedal-logo.png',
      'HAVELLS': '/havells-logo.png',
      'HAVELS': '/havells-logo.png', // Handle typo in brand name
      'POLYCAB': '/polycab-logo.png',
      'V-GUARD': '/vguard-logo.png',
    };
    return logoMap[brandName.toUpperCase()] || '';
  };

  const brandLogo = getBrandLogo(companyName);

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
        // Make sure all edit buttons are hidden in the cloned document
        const clonedBtns = clonedDoc.querySelectorAll('.edit-btn, .edit-signature-btn');
        clonedBtns.forEach((btn) => { btn.style.display = 'none'; });
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
    <div className="p-8 bg-white max-w-3xl mx-auto border border-gray-300 shadow-lg">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <a href="#/history" className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100">
          History
        </a>
        <button
          onClick={() => {
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
                gst: tax,
                total: grandTotal,
              };
              fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              }).then(() => { window.location.hash = '#/history'; });
            } catch (e) {
              console.error('Error saving bill:', e);
            }
          }}
          className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
        >
          Save Bill
        </button>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
        >
          Export to PDF
        </button>
      </div>

      {/* Invoice Content */}
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center" style={{ height: '80px' }}>
            {brandLogo && (
              <img
                src={brandLogo}
                alt=""
                className="h-full w-auto object-contain"
                style={{
                  maxWidth: '250px',
                  maxHeight: '80px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
          <div className="text-gray-700 font-medium">
            Date of Offer {formatDate(invoiceDate)}
          </div>
        </div>


        <p className="mb-4 text-gray-800">Dear Sir,</p>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
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
                <tr key={index} className="border-t border-gray-300">
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
              <tr className="bg-yellow-200 font-bold border-t-2 border-gray-600">
                <td colSpan="4" className="p-2 text-right">TOTAL</td>
                <td className="p-2 text-right">₹{formatNumber(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms & Conditions + Regards (aligned together) */}
        <div className="mt-6 border border-gray-400 p-4 text-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold">TERMS & CONDITIONS</p>
          </div>

          {/* Terms content */}
          {isEditingTerms ? (
            <div className="space-y-2">
              {terms.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-right select-none">{idx + 1}.</span>
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
                    title="Remove line"
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
            (() => {
              const lineHeight = 24; // px baseline for vertical spacing
              const topOffset = 20; // first line baseline
              const height = topOffset + lineHeight * terms.length + 2;
              return (
                <svg
                  width="100%"
                  height={height}
                  viewBox={`0 0 800 ${height}`}
                  preserveAspectRatio="xMinYMin meet"
                  style={{ display: 'block' }}
                >
                  {terms.map((t, idx) => (
                    <text
                      key={idx}
                      x="16"
                      y={topOffset + idx * lineHeight}
                      fontFamily="Arial, Helvetica, sans-serif"
                      fontSize="15"
                      fontWeight="400"
                      fill="#111827"
                      textRendering="geometricPrecision"
                    >
                      {`${idx + 1}. ${t}`}
                    </text>
                  ))}
                </svg>
              );
            })()
          )}

          {/* Terms edit/save controls under the terms block */}
          <div className="mt-2 flex justify-end">
            <button
              className="edit-btn text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              onClick={(e) => {
                e.preventDefault();
                setIsEditingTerms(!isEditingTerms);
              }}
            >
              {isEditingTerms ? 'Save Terms' : 'Edit Terms'}
            </button>
          </div>

          {/* Regards and Signature controls directly under Terms */}
          <div className="mt-4">
            <div className="flex items-center">
              <p className="mr-2">Regards,</p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(!isEditing);
                }}
                className="edit-signature-btn edit-btn text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="mt-2 border p-3 rounded bg-white">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Name:</label>
                  <input
                    type="text"
                    value={signature.name}
                    onChange={(e) => setSignature({...signature, name: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone:</label>
                  <input
                    type="tel"
                    value={signature.phone}
                    onChange={(e) => setSignature({...signature, phone: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-1">
                {/* SVG-based signature to avoid text raster artifacts */}
                <svg
                  width="100%"
                  height="54"
                  viewBox="0 0 600 54"
                  preserveAspectRatio="xMinYMin meet"
                  style={{ display: 'block' }}
                >
                  <text
                    x="0"
                    y="20"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontSize="18"
                    fontWeight="700"
                    fill="#1f2937"
                    textRendering="geometricPrecision"
                  >
                    {signature.name}
                  </text>
                  <text
                    x="0"
                    y="42"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontSize="16"
                    fontWeight="400"
                    fill="#374151"
                    textRendering="geometricPrecision"
                  >
                    {signature.phone}
                  </text>
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
