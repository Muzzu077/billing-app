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
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <form onSubmit={onSubmit} className="glass-card p-6 sm:p-8 w-full max-w-sm space-y-5" aria-labelledby="loginTitle">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg shadow-sky-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h1 id="loginTitle" className="section-title text-2xl font-bold text-center mb-2">Admin Login</h1>
        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-2 rounded-lg" role="alert">{error}</div>}

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


