import React from 'react';
import ReactDOM from 'react-dom/client';
import '../fonts';
import App from '../App';
import { loadPendingImage } from './pending';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App variant="extension" loadInitial={loadPendingImage} />
  </React.StrictMode>
);
