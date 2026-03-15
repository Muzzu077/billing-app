import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { Clock, ArrowLeft, IndianRupee } from 'lucide-react';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const History = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/quotations?paid=true');
        setRows(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatCurrency = (num) => Number(num || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const formatDate = (dateStr) => {
    try { return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return '-'; }
  };

  if (loading) return (
    <div className="glass-card p-8 animate-fade-in">
      <div className="flex items-center justify-center gap-3 text-slate-400"><Spinner /> Loading history...</div>
    </div>
  );

  if (error) return (
    <div className="glass-card p-8 animate-fade-in text-center">
      <p className="text-red-600 dark:text-red-400 font-medium">Failed to load history</p>
      <p className="text-sm text-slate-500 mt-1">{error}</p>
    </div>
  );

  return (
    <div className="glass-card p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10">
            <Clock className="h-5 w-5 text-violet-500 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="section-title">Paid Bills History</h2>
            <p className="text-xs text-slate-400">{rows.length} record{rows.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <a href="#/" className="btn btn-outline text-xs"><ArrowLeft className="h-3.5 w-3.5" /> Back</a>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No paid bills yet</p>
          <p className="text-sm mt-1">Bills marked as paid will appear here.</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="block sm:hidden space-y-3">
            {rows.map((q) => (
              <div key={q._id || q.id} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{q.customerName || 'Unknown'}</p>
                    <p className="text-xs text-slate-400">{q.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      <IndianRupee className="h-3.5 w-3.5" />{formatCurrency(q.total)}
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 font-medium mt-1">Paid</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">{formatDate(q.createdAt || q.date)}</p>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-medium">Brand</th>
                  <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-medium">Date</th>
                  <th className="text-center py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((q) => (
                  <tr key={q._id || q.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-200 font-medium">{q.customerName || 'Unknown'}</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{q.brand}</td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-600 dark:text-amber-400">
                      <span className="flex items-center justify-end gap-0.5"><IndianRupee className="h-3.5 w-3.5" />{formatCurrency(q.total)}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{formatDate(q.createdAt || q.date)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 text-[10px] rounded-full bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 font-medium">Paid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
