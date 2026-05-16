import React from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <App />
    {/* Agentation toolbar — bottom-right corner. Click to activate,
        then click any element on the page to annotate. Annotations
        produce structured markdown with selector + bounding box + CSS
        classes that you can paste into a fresh Claude session. */}
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
