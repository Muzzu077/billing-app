import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const { setToken, setAdmin } = useAuth();

  useEffect(() => {
    // Clear auth state and storage
    setToken('');
    setAdmin(null);
  }, [setToken, setAdmin]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded shadow p-6 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Logged Out</h1>
        <p className="text-gray-600">You have been successfully logged out.</p>
        <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded py-2 px-4 font-semibold">
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Logout;
