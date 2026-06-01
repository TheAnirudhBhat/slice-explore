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
  return (
    <>
      <App />
      {/* Agentation toolbar — desktop AND mobile (user wants annotation on mobile
          too). Fixed bottom-right; on mobile it sits over the phone-shell bottom
          nav, accepted per user direction. */}
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
    </>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
