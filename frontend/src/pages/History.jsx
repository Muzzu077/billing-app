import React, { useEffect, useState } from 'react';

const History = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/quotations');
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

  if (loading) return <div className="p-6">Loading history...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bills History</h2>
      <div className="overflow-auto border rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Brand</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <tr key={q._id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                <td className="p-2">{q.customerName}</td>
                <td className="p-2">{q.brand}</td>
                <td className="p-2">${q.total?.toFixed?.(2) || q.total}</td>
                <td className="p-2">{new Date(q.createdAt || q.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;


