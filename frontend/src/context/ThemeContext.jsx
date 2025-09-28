import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const getInitial = () => localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(getInitial);

  const applyTheme = (next) => {
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', next);
  };

  // Ensure correct theme applied on mount
  useEffect(() => {
    applyTheme(theme);
    // Also react to changes from other tabs/windows
    const onStorage = (e) => {
      if (e.key === 'theme' && e.newValue) {
        applyTheme(e.newValue);
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Apply whenever theme state changes (in case it changes locally)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      // Apply immediately for instant visual response
      applyTheme(next);
      return next;
    });
  };

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeContext);


