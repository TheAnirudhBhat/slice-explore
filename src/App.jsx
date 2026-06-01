// slice-explore — the slice skill app with ONLY the Explore pod overridden by
// this project's section-system + debug panel. Everything else (phone shell,
// status bar, bottom nav, phone-view, and the Banking / Pay / Credit / Activity
// pods) is INHERITED LIVE from the skill proto via AppBase (a symlink → skill
// src/App.jsx) + the `override-explore-pod` resolver in vite.config.js.
//
// GOVERNANCE: the skill proto is upstream and READ-ONLY. Divergence lives only
// here — we own one pod (Explore) and inherit the rest. When the skill updates
// (e.g. phone-view), it flows in automatically on next reload.
import React from 'react';
import AppBase from './AppBase.jsx'; // symlink → skill proto src/App.jsx

export default function App() {
  // Land on Explore (this project's reason to exist). The other pods are one
  // swipe/tap away, inherited from the skill.
  return <AppBase initialPod="explore" />;
}
