/**
 * main.tsx — React Application Entry Point
 *
 * Mounts the root App component into the #root div defined in index.html.
 * React StrictMode is enabled to surface potential issues during development.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
