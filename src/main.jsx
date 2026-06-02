import React from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';
// Self-hosted Rubik (bundled) — NEVER the Google Fonts CDN (blocked on slice's
// corporate network; Medium-500 silently falls back to system). Matches skill proto.
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/500.css';
import '@fontsource/rubik/600.css';
import '@fontsource/rubik/700.css';
import './index.css';   // linked skill base CSS (DLS tokens + theme + @tailwind) — propagates live
import './explore.css'; // explore-pod-local styles (debug panel, carousels, keyframes)
import App from './App.jsx';

function Root() {
  // The Expo WebView wrapper (explore-expo) loads Explore with `?expo=1` — skip
  // Agentation there. It's a feedback tool for the browser/PWA; on the native
  // on-device app it just sits over the nav and isn't wanted. (user, 2026-06-02)
  // Detect the Expo / React Native WebView robustly: react-native-webview injects
  // `window.ReactNativeWebView` into every page it loads (present in the Expo app,
  // absent in a normal browser/PWA). That's the reliable signal — the `?expo` param
  // is just a manual override for testing in a browser. Either one hides Agentation.
  const isExpo = typeof window !== 'undefined'
    && (window.ReactNativeWebView != null
        || new URLSearchParams(window.location.search).has('expo'));
  return (
    <>
      <App />
      {/* Agentation toolbar — desktop AND mobile browser/PWA (not the Expo app).
          Fixed bottom-right; on mobile it sits over the phone-shell bottom nav. */}
      {!isExpo && (
        <Agentation
          onAnnotationAdd={(a) => {
            // eslint-disable-next-line no-console
            console.log('[agentation] annotation added', a);
          }}
          onSubmit={(output, annotations) => {
            // eslint-disable-next-line no-console
            console.log('[agentation] submitted', { output, annotations });
          }}
        />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
