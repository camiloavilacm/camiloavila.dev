import React, { useState } from 'react';
import { DashboardApp } from '../dashboard/components/DashboardApp';
import { ExternalLink, Maximize2, Minimize2, BarChart3 } from 'lucide-react';

export const DashboardModuleView: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`flex flex-col bg-[#18181b] border border-[#E8DCCA] rounded-2xl overflow-hidden transition-all duration-300 shadow-xs ${isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'w-full'}`}
    >
      {/* Top Action & Status Bar - EcoWoman Brand Theme */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF7F2] border-b border-[#E8DCCA] text-[#462B14] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF2EA] border border-[#E8DCCA] text-[#8C4A26]">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-[#462B14] text-xs flex items-center gap-2">
              <span>EcoWoman / Carolina Smith Analytics Engine</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#E8F5F1] text-[#108474] border border-[#BDE3D7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#108474] animate-pulse"></span>
                Fastify v5 + PostgreSQL
              </span>
            </div>
            <div className="text-[11px] text-[#7A5C4B]">
              Shopify Ledger · Meta/Google Attribution · AI Visibility & Competitor Prices
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F5F1EA] text-[#462B14] border border-[#E8DCCA] transition-colors text-xs font-medium"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen View'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-[#8C4A26]" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-[#8C4A26]" />
            )}
            <span className="hidden sm:inline">{isFullscreen ? 'Collapse' : 'Full Screen'}</span>
          </button>

          <a
            href="/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#462B14] hover:bg-[#382314] text-white font-medium transition-colors text-xs shadow-xs"
          >
            <span>Open Standalone</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Dashboard Container */}
      <div
        className={`w-full relative ${isFullscreen ? 'flex-1 h-[calc(100%-52px)]' : 'h-[850px]'}`}
      >
        <DashboardApp />
      </div>
    </div>
  );
};
