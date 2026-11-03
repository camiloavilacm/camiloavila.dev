import React from 'react';
import { Sparkles } from 'lucide-react';
import { type Language, translations } from '../i18n/translations';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  totalUnderwearNeeded: number;
  totalPadsNeeded: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  totalUnderwearNeeded,
  totalPadsNeeded,
}) => {
  const t = translations[currentLanguage];
  const combinedTotal = totalUnderwearNeeded + totalPadsNeeded;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand title wordmark */}
        <a href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
          {/* Product thumbnail */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#382314] overflow-hidden p-0.5 bg-white/60 shrink-0">
            <img
              src="/assets/aistudio/image_16ca007d.png"
              alt="Ecowoman"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="truncate">
            <span className="text-lg sm:text-2xl font-black tracking-tight text-[#382314] block leading-none truncate">
              {t.header.title}
            </span>
            <span className="text-[10px] sm:text-[11px] font-normal text-[#6B5A4D] hidden md:block mt-0.5 truncate">
              {t.header.tagline}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#6B5A4D]">
          <a
            href="#cycle-profile"
            className="hover:text-[#382314] transition-colors whitespace-nowrap shrink-0"
          >
            {t.header.navYourCycle}
          </a>
          <a
            href="#pack-recommendation"
            className="hover:text-[#382314] transition-colors whitespace-nowrap shrink-0"
          >
            {t.header.navRecommendedPacks}
          </a>
          <a
            href="#washing-timeline"
            className="hover:text-[#382314] transition-colors whitespace-nowrap shrink-0"
          >
            {t.header.navWashingRoutine}
          </a>
        </nav>

        {/* Zone 3: Actions - Summary Badge + Language Selector (No Test Suite button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {combinedTotal > 0 && (
            <div className="px-2.5 sm:px-3.5 py-1.5 bg-[#382314] text-[#FAF8F5] text-[11px] sm:text-xs font-bold rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-xs whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-[#E6C280] shrink-0" />
              {/* Desktop detailed badge */}
              <span className="hidden sm:inline">
                {t.header.summaryBadge(totalUnderwearNeeded, totalPadsNeeded)}
              </span>
              {/* Mobile compact badge */}
              <span className="sm:hidden">
                {t.header.compactSummaryBadge(totalUnderwearNeeded, totalPadsNeeded)}
              </span>
            </div>
          )}

          {/* Multilingual Selector */}
          <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </header>
  );
};
