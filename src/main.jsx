import React from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';
import './index.css';
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
  const isDesktop = useIsDesktop();
  return (
    <>
      <App />
      {/* Agentation toolbar — desktop only. Click → activate → click
          any element to annotate. Structured markdown is produced for
          paste-into-Claude handoff. */}
      {isDesktop && (
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
