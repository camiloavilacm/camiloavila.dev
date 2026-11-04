/**
 * App.tsx — Application Router
 *
 * Serves:
 *   /                   — Main Portfolio (Camilo Avila — AI Resume Portfolio)
 *   /use-case/0293828   — Standalone Case Study Demonstration
 *   *                   — Fallback redirect to /
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortfolioHome from './components/PortfolioHome';

// Lazy load non-home routes so zero extra JS is loaded on the main portfolio
const StudyCaseApp = lazy(() => import('./study-case/StudyCaseApp'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main portfolio home */}
        <Route path="/" element={<PortfolioHome />} />

        {/* Legal & Policy routes */}
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#0a192f]" />}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />

        <Route
          path="/terms"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#0a192f]" />}>
              <TermsOfService />
            </Suspense>
          }
        />
        <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />

        {/* Standalone demonstration route */}
        <Route
          path="/use-case/0293828"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-[#ccd6f6] font-mono text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64ffda] animate-pulse" />
                    <span>Loading Demonstration...</span>
                  </div>
                </div>
              }
            >
              <StudyCaseApp />
            </Suspense>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
