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

// Lazy load the study-case so zero extra JS is loaded on the main portfolio
const StudyCaseApp = lazy(() => import('./study-case/StudyCaseApp'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main portfolio home */}
        <Route path="/" element={<PortfolioHome />} />

        {/* Standalone demonstration route */}
        <Route
          path="/use-case/0293828"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#462B14] font-mono text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#108474] animate-pulse" />
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
