import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './utils/axios';
import './firebase';
import { registerSW } from 'virtual:pwa-register';

// Register service worker — auto-reloads page when new version is available
if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // New version available — reload immediately for instant updates
      window.location.reload();
    },
    onOfflineReady() {
      console.log('App ready for offline use');
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
