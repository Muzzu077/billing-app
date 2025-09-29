import React, { useEffect, useState } from 'react';

const History = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/quotations?paid=true');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch');
        setRows(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-3 sm:p-6">Loading history...</div>;
  if (error) return <div className="p-3 sm:p-6 text-red-600">{error}</div>;

  return (
    <div className="p-3 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Paid Bills History</h2>
      
      {/* Mobile Card Layout */}
      <div className="block sm:hidden space-y-4">
        {rows.map((q) => (
          <div key={q._id} className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{q.customerName}</h3>
                <p className="text-sm text-gray-600">{q.brand}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₹{q.total?.toFixed?.(2) || q.total}</p>
                {q.paid ? (
                  <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">Paid</span>
                ) : (
                  <span className="inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800">Unpaid</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">{new Date(q.createdAt || q.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
      
      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-auto border rounded">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Brand</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Created At</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <tr key={q._id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                <td className="p-2">{q.customerName}</td>
                <td className="p-2">{q.brand}</td>
                <td className="p-2">₹{q.total?.toFixed?.(2) || q.total}</td>
                <td className="p-2">{new Date(q.createdAt || q.date).toLocaleString()}</td>
                <td className="p-2">
                  {q.paid ? (
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">Paid</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800">Unpaid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;


