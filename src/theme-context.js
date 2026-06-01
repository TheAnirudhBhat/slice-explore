// Theme context — lets any descendant (e.g. the App Settings "Dark mode" switch)
// read the current theme and trigger the same theme-switch transition the dev
// toggle uses. App.jsx provides { theme, toggleTheme } around the L1Stack subtree.
import { createContext, useContext } from 'react';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);
