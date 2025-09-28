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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-5" aria-labelledby="loginTitle">
        <h1 id="loginTitle" className="text-2xl font-bold text-center">Admin Login</h1>
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        <div>
          <label htmlFor="username" className="block text-sm mb-1">Username</label>
          <input id="username" value={username} onChange={(e)=>setUsername(e.target.value)} className="input-field" autoComplete="username" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="input-field" autoComplete="current-password" />
        </div>
        <button disabled={loading} className="btn btn-primary w-full disabled:opacity-70">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;


