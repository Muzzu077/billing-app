import React, { useEffect, useState } from 'react';

const Save = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('session_saved_bills');
      const arr = raw ? JSON.parse(raw) : [];
      setBills(arr);
    } catch (e) {
      setError('Failed to read saved bills from session');
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist to session anytime we change the list
  const persist = (next) => {
    setBills(next);
    try { sessionStorage.setItem('session_saved_bills', JSON.stringify(next)); } catch {}
  };

  const togglePaid = async (bill) => {
    try {
      const res = await fetch(`/api/quotations/${bill._id}/paid`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paid: !bill.paid })
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || 'Failed');
      const next = bills.map(b => (b._id === bill._id ? updated : b));
      persist(next);
    } catch (e) {
      alert('Failed to update paid status: ' + e.message);
    }
  };

  const editInForm = (bill) => {
    try {
      localStorage.setItem('edit_quotation', JSON.stringify(bill));
      window.location.hash = '#/';
    } catch (e) {
      alert('Failed to send bill to form: ' + e.message);
    }
  };

  const removeBill = async (bill) => {
    if (!confirm('Delete this saved bill?')) return;
    try {
      const res = await fetch(`/api/quotations/${bill._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || 'Failed');
      }
      const next = bills.filter(b => b._id !== bill._id);
      persist(next);
    } catch (e) {
      alert('Failed to delete bill: ' + e.message);
    }
  };

  if (loading) return <div className="p-6">Loading saved bills...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Saved Bills (this session)</h2>
        <a href="#/" className="btn btn-outline">Back to Billing</a>
      </div>

      {bills.length === 0 ? (
        <div className="text-gray-600">No bills saved in this session yet.</div>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => (
            <div key={bill._id} className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{bill.customerName} - {bill.brand}</div>
                <span className={`text-xs px-2 py-0.5 rounded ${bill.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{bill.paid ? 'Paid' : 'Unpaid'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 rounded border" onClick={() => togglePaid(bill)}>
                  {bill.paid ? 'Mark Unpaid' : 'Mark Paid'}
                </button>
                <button className="px-3 py-1 rounded border" onClick={() => editInForm(bill)}>
                  Edit in Form
                </button>
                <button className="px-3 py-1 rounded border border-red-300 text-red-700" onClick={() => removeBill(bill)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500">Note: Only bills marked Paid appear in History.</div>
        </div>
      )}
    </div>
  );
};

export default Save;
