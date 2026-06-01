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

/* Hide the Agentation toolbar on mobile — its fixed bottom-right
   position overlaps the phone-shell UI and the proto's own bottom-nav.
   Matches the same 768px breakpoint the rest of the app uses. */
const useIsDesktop = () => {
  const query = '(min-width: 769px)';
  const [isDesktop, setIsDesktop] = React.useState(
    typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener('change', handler)
        : mq.removeListener(handler);
    };
  }, []);
  return isDesktop;
};

function Root() {
  // TEMP: agentation enabled on mobile too (user wants to highlight mobile
  // issues). To restore desktop-only, gate the <Agentation/> below on isDesktop.
  const isDesktop = useIsDesktop();
  void isDesktop;
  return (
    <>
      <App />
      {/* Agentation toolbar. Click → activate → click any element to
          annotate. Structured markdown is produced for paste-into-Claude. */}
      {true && (
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
