import React from 'react';
import { type Language, translations } from '../i18n/translations';
import { Heart, RefreshCw } from 'lucide-react';

interface FooterProps {
  language: Language;
  onOpenTests: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenTests }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#382314] text-[#EAE4DC] mt-16 sm:mt-20 border-t border-[#4A3222] text-xs w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-[#FAF8F5] font-black tracking-tight text-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F] inline-block"></span>
              <span>{t.hero.title}</span>
            </div>
            <p className="text-[#C5B9AE] text-xs max-w-lg leading-relaxed">{t.footer.brandDesc}</p>
          </div>

          {/* Developer / Engine Diagnostic tool kept in footer */}
          <div className="space-y-2">
            <h4 className="text-[#FAF8F5] font-bold uppercase tracking-wider text-[11px]">
              {t.footer.testSuiteLabel}
            </h4>
            <div className="flex flex-col space-y-2">
              <button
                onClick={onOpenTests}
                className="text-[#C5B9AE] hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#A3C999]" />
                <span>Run Automated Test Suite</span>
              </button>
              <span className="text-[#9C8C7E] text-[11px]">
                Deterministic calculation engine verified against spreadsheet rules.
              </span>
            </div>
          </div>
        </div>

        {/* Washing Routine Notice */}
        <div className="pt-6 border-t border-[#4D3627] text-[#B5A79B] text-[11px] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <strong className="text-[#FAF8F5]">{t.routine.gentleRhythmTitle} </strong>
            {t.routine.gentleRhythmBody}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-[#B5A79B]">
            <span>{t.footer.allRights}</span>
            <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
