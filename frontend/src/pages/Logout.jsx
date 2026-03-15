import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const { setToken, setAdmin } = useAuth();

  useEffect(() => {
    setToken('');
    setAdmin(null);
  }, [setToken, setAdmin]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="glass-card p-8 sm:p-10 w-full max-w-sm text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-sm">
          <LogOut className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Logged Out</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">You have been successfully logged out.</p>
        <a href="#/" className="btn btn-primary inline-flex">Back to Login</a>
      </div>
    </div>
  );
};

export default Logout;
