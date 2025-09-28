
import React from 'react';
import { BRANDS } from '../constants/brands.js';

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...invoiceData.items];
    items[index][name] = value;
    setInvoiceData({ ...invoiceData, items });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, listPrice: 0, coilPrice: 0 }],
    });
  };

  const removeItem = (index) => {
    const items = [...invoiceData.items];
    items.splice(index, 1);
    setInvoiceData({ ...invoiceData, items });
  };

  return (
    <div className="card">
      <h2 className="section-title mb-6">Invoice Details</h2>

      {/* Brand Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select
            className="input-field w-full"
            value={invoiceData.brandKey || ''}
            onChange={(e) => {
              const key = e.target.value;
              const selected = BRANDS.find(b => b.key === key);
              if (selected) {
                setInvoiceData({
                  ...invoiceData,
                  brandKey: selected.key,
                  companyName: selected.name,
                  brandLogo: selected.logo,
                  companyLogo: selected.logo,
                });
              }
            }}
          >
            {BRANDS.map(b => (
              <option key={b.key} value={b.key}>{b.name}</option>
            ))}
          </select>
        </div>
        {invoiceData.companyLogo && (
          <div className="flex justify-start md:justify-end">
            {/* Preview of selected brand logo */}
            <img src={invoiceData.companyLogo} alt="brand" className="h-12 object-contain drop-shadow-sm" />
          </div>
        )}
      </div>

      {/* Client Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <input
          type="text"
          name="clientName"
          value={invoiceData.clientName}
          onChange={handleInputChange}
          placeholder="Client Name"
          className="input-field"
        />
        <input
          type="text"
          name="clientAddress"
          value={invoiceData.clientAddress}
          onChange={handleInputChange}
          placeholder="Client Address"
          className="input-field"
        />
        <input
          type="text"
          name="clientPhone"
          value={invoiceData.clientPhone}
          onChange={handleInputChange}
          placeholder="Client Phone"
          className="input-field"
        />
        <input
          type="date"
          name="invoiceDate"
          value={invoiceData.invoiceDate}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="invoiceNumber"
          value={invoiceData.invoiceNumber}
          onChange={handleInputChange}
          placeholder="Invoice Number"
          className="input-field"
        />
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <h3 className="section-title mb-4">Invoice Items</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Description</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">List Price</th>
              <th className="text-left">Coil Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Item description"
                    className="input-field w-full"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="input-field w-24"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="listPrice"
                    value={item.listPrice}
                    onChange={(e) => handleItemChange(index, e)}
                    className="input-field w-32"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="coilPrice"
                    value={item.coilPrice}
                    onChange={(e) => handleItemChange(index, e)}
                    className="input-field w-32"
                  />
                </td>
                <td>
                  <button
                    onClick={() => removeItem(index)}
                    className="btn btn-outline text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addItem}
          className="mt-4 btn btn-primary"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
