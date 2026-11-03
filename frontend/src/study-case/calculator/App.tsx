/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import type { PeriodDays, FlowLevel } from './engine/types';
import { getRequirements, getBestPack } from './engine/calculator';
import { type Language, translations } from './i18n/translations';
import { Header } from './components/Header';
import { PeriodSliders } from './components/PeriodSliders';
import { PackRecommendationCard } from './components/PackRecommendationCard';
import { CycleScheduleTimeline } from './components/CycleScheduleTimeline';
import { TestSuiteDrawer } from './components/TestSuiteDrawer';
import { Footer } from './components/Footer';
import { Heart } from 'lucide-react';

export default function App() {
  // Calculator inputs (default: 4 days, medium flow)
  const [days, setDays] = useState<PeriodDays>(4);
  const [flow, setFlow] = useState<FlowLevel>(2);
  // Default language is English (en) as requested; toggleable to ES, PT, DE
  const [language, setLanguage] = useState<Language>('en');
  const [isTestsOpen, setIsTestsOpen] = useState<boolean>(false);

  const t = translations[language];

  // Pure, instant synchronous calculation following Excel logic
  const requirements = useMemo(() => getRequirements(days, flow), [days, flow]);

  const recommendation = useMemo(() => getBestPack(requirements), [requirements]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#382314] font-sans selection:bg-[#F0DFCF] selection:text-[#382314] w-full max-w-full overflow-x-hidden">
      {/* Header with language selector and no Test Suite button */}
      <Header
        currentLanguage={language}
        onLanguageChange={setLanguage}
        totalUnderwearNeeded={recommendation.totalUnderwearNeeded}
        totalPadsNeeded={recommendation.totalPadsNeeded}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 space-y-8 sm:space-y-12 w-full max-w-full overflow-hidden">
        {/* Ecowoman Days Hero Section with Reusable Product Photography */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-5 sm:p-10 lg:p-12 shadow-2xs relative overflow-hidden w-full max-w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C4A26] bg-[#FAF5EE] border border-[#EAE0D4] px-3.5 py-1 rounded-full max-w-full">
                <Heart className="w-3.5 h-3.5 fill-[#8C4A26] shrink-0" />
                <span className="truncate">{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#382314] leading-[1.08]">
                {t.hero.title}
              </h1>

              <p className="text-sm sm:text-lg text-[#5C4A3E] font-medium leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Friendly Note Callout */}
              <div className="pt-2">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs sm:text-sm text-[#6B5A4D] flex items-start gap-3">
                  <span className="text-base leading-none shrink-0">🌸</span>
                  <div className="leading-relaxed">
                    <strong className="text-[#382314]">{t.hero.friendlyNoteTitle} </strong>
                    {t.hero.friendlyNoteBody}
                  </div>
                </div>
              </div>
            </div>

            {/* Reusable products photo replacing 3x2 circular badge */}
            <div className="shrink-0 flex items-center justify-center self-center lg:self-auto py-2">
              <div className="relative group max-w-full">
                <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-3xl overflow-hidden border-2 border-[#E8E2D9] shadow-md bg-[#FAF8F5]">
                  <img
                    src="/assets/aistudio/image_16ca007d.png"
                    alt="Ecowoman reusable period panties, menstrual boxers, and menstrual pad"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white/95 backdrop-blur-xs border border-[#E8E2D9] text-[#8C4A26] text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 max-w-[90%]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A26] shrink-0"></span>
                  <span className="truncate">{t.hero.imagePill}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: User Inputs (Buttons only, no sliders) */}
        <section>
          <PeriodSliders
            days={days}
            flow={flow}
            language={language}
            onDaysChange={setDays}
            onFlowChange={setFlow}
          />
        </section>

        {/* Section 2: Recommended Pack Results Card (No prices, Underwear vs Pads separated) */}
        <section>
          <PackRecommendationCard recommendation={recommendation} language={language} />
        </section>

        {/* Section 3: Washing Timeline & Routine */}
        <section>
          <CycleScheduleTimeline
            days={days}
            flow={flow}
            inventory={recommendation.requirements}
            language={language}
          />
        </section>
      </main>

      {/* Footer (with developer test suite launcher preserved at the bottom) */}
      <Footer language={language} onOpenTests={() => setIsTestsOpen(true)} />

      {/* Test Suite Drawer */}
      <TestSuiteDrawer isOpen={isTestsOpen} onClose={() => setIsTestsOpen(false)} />
    </div>
  );
}
