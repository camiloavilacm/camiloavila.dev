import React, { useState } from 'react';
import { ChevronRight, Layers, Sparkles, ChevronsDown, ChevronsUp } from 'lucide-react';
import { AuditoriaAutonomaView } from './modules/AuditoriaAutonomaView';
import { DashboardModuleView } from './modules/DashboardModuleView';
import { ServerSideReportApp } from './serverside/ServerSideReportApp';
import { CalculatorModuleView } from './modules/CalculatorModuleView';
import { MediaView } from './modules/MediaView';
import './styles/ecowoman.css';

interface SectionConfig {
  id: string;
  title: string;
  emoji: string;
  badge: string;
  description: string;
  component: React.ReactNode;
}

export const StudyCaseApp: React.FC = () => {
  // Store open sections as a Set for multi-expand Notion toggle behavior
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['auditoria-autonoma']) // First section open by default as preview
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenSections(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setOpenSections(new Set());
  };

  const sections: SectionConfig[] = [
    {
      id: 'auditoria-autonoma',
      title: 'Auditoria Autonoma',
      emoji: '📑',
      badge: 'Static Report · 2,900+ Lines',
      description:
        'Comprehensive autonomous e-commerce diagnostic for EcoWoman covering UX, CRO, and technology stack.',
      component: <AuditoriaAutonomaView />,
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      emoji: '📊',
      badge: 'Fastify v5 + PostgreSQL + ECharts',
      description:
        'Live performance ledger tracking Shopify multi-channel revenue, Meta/Google attribution, cohorts, and AI visibility.',
      component: <DashboardModuleView />,
    },
    {
      id: 'server-side-analysis',
      title: 'Analisis server side',
      emoji: '⚡',
      badge: 'CAPI & GTM Tracking Checker',
      description:
        'Attribution loss calculation, detected client/server tags, competitor tracking benchmarks, and remediation roadmap.',
      component: <ServerSideReportApp />,
    },
    {
      id: 'calculator',
      title: 'Calculator',
      emoji: '🧮',
      badge: 'Cycle & Pack Engine · Multi-Language',
      description:
        'Synchronous underwear & pad requirement simulator with Excel rule matrix and dynamic pack optimization.',
      component: <CalculatorModuleView />,
    },
    {
      id: 'media',
      title: 'Media',
      emoji: '🎬',
      badge: '2 Video Walkthroughs',
      description:
        'Technical deep-dives and recorded demonstrations detailing the architecture, implementation, and ROI.',
      component: <MediaView />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#462B14] font-ecowoman selection:bg-[#F0DFCF] selection:text-[#462B14]">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E8DCCA] px-4 sm:px-8 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#7A5C4B]">
          <a
            href="/"
            className="hover:text-[#462B14] transition-colors flex items-center gap-1.5 font-medium text-[11px]"
          >
            <span>‹</span>
            <span>SOLUTIONS // STUDIO</span>
          </a>
          <span className="text-[#DCD0BD]">/</span>
          <span className="text-[#462B14] font-semibold">Study Case · EcoWoman</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F5F1EA] hover:bg-[#EFE8DD] text-[#462B14] transition-colors text-[11px] font-medium border border-[#E8DCCA]"
            title="Expand all toggles"
          >
            <ChevronsDown className="w-3.5 h-3.5 text-[#8C4A26]" />
            <span className="hidden sm:inline">Expand All</span>
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F5F1EA] hover:bg-[#EFE8DD] text-[#462B14] transition-colors text-[11px] font-medium border border-[#E8DCCA]"
            title="Collapse all toggles"
          >
            <ChevronsUp className="w-3.5 h-3.5 text-[#8C4A26]" />
            <span className="hidden sm:inline">Collapse All</span>
          </button>
        </div>
      </header>

      {/* Notion Page Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-10">
        {/* Notion Page Cover / Hero Header */}
        <div className="space-y-4 pb-6 border-b border-[#E8DCCA]">
          <div className="inline-flex items-center justify-center text-4xl p-2.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DCCA] shadow-xs select-none">
            📑
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#462B14]">
              Study Case: EcoWoman
            </h1>
            <p className="text-sm sm:text-base text-[#7A5C4B] max-w-3xl leading-relaxed">
              Explore the complete deliverables unified in a single interactive canvas. Click on any
              section below to toggle and inspect its live implementation.
            </p>
          </div>

          {/* Quick Metrics & Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FFFFFF] border border-[#E8DCCA] text-[#462B14] shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#108474]" />5 Core Modules
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FFFFFF] border border-[#E8DCCA] text-[#462B14] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#8C4A26]" />
              Notion Interactive Toggles
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FFFFFF] border border-[#E8DCCA] text-[#462B14] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#108474]" />
              EcoWoman Theme & Fonts
            </span>
          </div>
        </div>

        {/* Notion Toggle List */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isOpen = openSections.has(section.id);

            return (
              <div
                key={section.id}
                id={section.id}
                className="group border border-[#E8DCCA] rounded-2xl bg-[#FFFFFF] hover:border-[#DCD0BD] hover:shadow-xs transition-all duration-200 overflow-hidden"
              >
                {/* Notion Toggle Header Row */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left select-none gap-4 focus:outline-hidden hover:bg-[#FAF7F2]/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rotating Triangle Chevron */}
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-md bg-[#F5F1EA] text-[#7A5C4B] group-hover:bg-[#EFE8DD] group-hover:text-[#462B14] transition-all duration-200 shrink-0 ${
                        isOpen
                          ? 'rotate-90 bg-[#462B14] text-white group-hover:bg-[#462B14] group-hover:text-white'
                          : ''
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </div>

                    {/* Emoji */}
                    <span className="text-xl shrink-0">{section.emoji}</span>

                    {/* Title & Description */}
                    <div className="truncate">
                      <div className="text-base sm:text-lg font-bold text-[#462B14] tracking-tight flex items-center gap-2">
                        <span>{section.title}</span>
                      </div>
                      <div className="text-xs text-[#7A5C4B] font-normal truncate mt-0.5">
                        {section.description}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="shrink-0 hidden md:flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF2EA] text-[#462B14] border border-[#E8DCCA]">
                      {section.badge}
                    </span>
                  </div>
                </button>

                {/* Collapsible Content Area */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-6 pt-1 border-t border-[#E8DCCA] animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Left Indent Line (Classic Notion Nested Style) */}
                    <div className="pt-3">{section.component}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#E8DCCA] py-8 text-center text-xs text-[#8C7769] font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>EcoWoman · Menstrual Swimwear & Underwear Omnichannel Platform</span>
          <span>Solutions Studio · Digital Craft with Mathematical Precision</span>
        </div>
      </footer>
    </div>
  );
};

export default StudyCaseApp;
