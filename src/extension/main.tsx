import React from 'react';
import ReactDOM from 'react-dom/client';
// Fonts are bundled so the extension never contacts Google Fonts and works offline.
// Latin + Latin Extended subsets only, matching what the website pulls from Google Fonts.
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-ext-400.css';
import '@fontsource/manrope/latin-ext-500.css';
import '@fontsource/manrope/latin-ext-600.css';
import '@fontsource/manrope/latin-ext-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-ext-400.css';
import '@fontsource/jetbrains-mono/latin-ext-500.css';
import App from '../App';
import { loadPendingImage } from './pending';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App variant="extension" loadInitial={loadPendingImage} />
  </React.StrictMode>
);
