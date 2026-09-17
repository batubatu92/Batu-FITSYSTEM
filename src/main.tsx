import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

if ('serviceWorker' in navigator) {
  registerSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      // The installed app can sit open/backgrounded for days without a
      // natural navigation, which is normally what makes the browser check
      // for a new service worker — so check explicitly, on an interval and
      // whenever the app comes back to the foreground. registerType:
      // 'autoUpdate' then activates and reloads automatically once found.
      const check = () => void registration.update();
      setInterval(check, 60 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
    onRegisterError(error) {
      console.error('SW registration failed', error);
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
