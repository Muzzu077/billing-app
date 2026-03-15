import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { FileText, ArrowLeft, Trash2, Edit3, CheckCircle, XCircle, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const Save = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('session_saved_bills');
      setBills(raw ? JSON.parse(raw) : []);
    } catch {
      setError('Failed to read saved bills');
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (next) => {
    setBills(next);
    try { sessionStorage.setItem('session_saved_bills', JSON.stringify(next)); } catch {}
  };

  const getBillId = (bill) => bill._id || bill.id;

  const togglePaid = async (bill) => {
    const id = getBillId(bill);
    try {
      const updated = await apiFetch(`/quotations/${id}/paid`, { method: 'PATCH', body: JSON.stringify({ paid: !bill.paid }) });
      persist(bills.map(b => (getBillId(b) === id ? updated : b)));
      toast.success(updated.paid ? 'Marked as paid' : 'Marked as unpaid');
    } catch (e) {
      toast.error('Failed to update: ' + e.message);
    }
  };

  const editInForm = (bill) => {
    localStorage.setItem('edit_quotation', JSON.stringify(bill));
    window.location.hash = '#/';
  };

  const removeBill = async (bill) => {
    if (!confirm('Delete this saved bill?')) return;
    const id = getBillId(bill);
    try {
      await apiFetch(`/quotations/${id}`, { method: 'DELETE' });
      persist(bills.filter(b => getBillId(b) !== id));
      toast.success('Bill deleted');
    } catch (e) {
      toast.error('Failed to delete: ' + e.message);
    }
  };

  const formatCurrency = (num) => Number(num || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  if (loading) return (
    <div className="glass-card p-8 animate-fade-in">
      <div className="flex items-center justify-center gap-3 text-slate-400">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
        Loading...
      </div>
    </div>
  );

  if (error) return <div className="glass-card p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="glass-card p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10">
            <FileText className="h-5 w-5 text-sky-500 dark:text-sky-400" />
          </div>
          <div>
            <h2 className="section-title">Saved Bills</h2>
            <p className="text-xs text-slate-400">{bills.length} bill{bills.length !== 1 ? 's' : ''} in session</p>
          </div>
        </div>
        <a href="#/" className="btn btn-outline text-xs"><ArrowLeft className="h-3.5 w-3.5" /> Back</a>
      </div>

      {bills.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No bills saved yet</p>
          <p className="text-sm mt-1">Create a quotation and click "Save Bill" to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => (
            <div key={getBillId(bill)} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 rounded-xl p-4 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 truncate">{bill.customerName || 'No name'}</h3>
                    <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{bill.brand}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-0.5">
                      <IndianRupee className="h-3.5 w-3.5" />{formatCurrency(bill.total)}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                      bill.paid ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    }`}>{bill.paid ? 'Paid' : 'Unpaid'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => togglePaid(bill)} className="btn-icon" title={bill.paid ? 'Mark Unpaid' : 'Mark Paid'}>
                    {bill.paid ? <XCircle className="h-4 w-4 text-amber-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                  </button>
                  <button onClick={() => editInForm(bill)} className="btn-icon" title="Edit">
                    <Edit3 className="h-4 w-4 text-sky-500" />
                  </button>
                  <button onClick={() => removeBill(bill)} className="btn-icon" title="Delete">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-400 text-center mt-4">Bills marked as Paid will appear in History.</p>
        </div>
      )}
    </div>
  );
};

export default Save;
