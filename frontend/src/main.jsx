import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import History from './pages/History.jsx';
import Offer from './pages/Offer.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

function Router() {
  const hash = window.location.hash;
  if (hash.startsWith('#/history')) return <History />;
  if (hash.startsWith('#/offer')) return <Offer />;
  return <App />;
}

function Root() {
  const [, force] = React.useReducer((x)=>x+1, 0);
  React.useEffect(() => {
    const onHash = () => force();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);