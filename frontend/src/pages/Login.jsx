import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { setToken, setAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setToken(data.token);
      setAdmin(data.admin);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-sm rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-semibold">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;


