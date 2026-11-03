import React from 'react';
import type { PeriodDays, FlowLevel } from '../engine/types';
import { type Language, translations } from '../i18n/translations';
import { Calendar, Droplets, Heart } from 'lucide-react';

interface PeriodSlidersProps {
  days: PeriodDays;
  flow: FlowLevel;
  language: Language;
  onDaysChange: (days: PeriodDays) => void;
  onFlowChange: (flow: FlowLevel) => void;
}

export const PeriodSliders: React.FC<PeriodSlidersProps> = ({
  days,
  flow,
  language,
  onDaysChange,
  onFlowChange,
}) => {
  const t = translations[language].cycleProfile;

  return (
    <div
      id="cycle-profile"
      className="bg-white rounded-3xl border border-[#E8E2D9] p-5 sm:p-8 lg:p-10 shadow-xs space-y-6 sm:space-y-8"
    >
      {/* Friendly Section Header */}
      <div className="pb-5 sm:pb-6 border-b border-[#EFECE6]">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C4A26] uppercase tracking-wider mb-1">
          <Heart className="w-3.5 h-3.5 fill-[#8C4A26]" />
          <span>{t.step}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#382314] tracking-tight">{t.title}</h2>
        <p className="text-xs sm:text-sm text-[#6B5A4D] mt-1 max-w-xl leading-relaxed">
          {t.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Input 1: Period Duration */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#382314] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8C4A26] shrink-0" />
              <span>{t.durationLabel}</span>
            </label>
            <span className="text-xs font-bold text-[#8C4A26] bg-[#F7F1EB] px-2.5 py-1 rounded-full shrink-0">
              {t.durationDaysBadge(days)}
            </span>
          </div>

          {/* Clean Tactile Duration Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDaysChange(d as PeriodDays)}
                className={`py-3.5 sm:py-4 px-2 sm:px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  days === d
                    ? 'border-[#382314] bg-[#382314] text-[#FAF8F5] shadow-sm font-bold'
                    : 'border-[#E5DFD5] bg-[#FAF8F5] text-[#382314] hover:bg-[#F3EFE9] hover:border-[#D5CCC0]'
                }`}
              >
                <span className="block text-lg sm:text-xl font-black leading-none">{d}</span>
                <span className="block text-[11px] sm:text-xs mt-1 opacity-90">{t.daysUnit}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-[#6B5A4D] leading-relaxed">{t.durationNotes[days]}</p>
        </div>

        {/* Input 2: Flow Level */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#382314] flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#8C4A26] shrink-0" />
              <span>{t.flowLabel}</span>
            </label>
            <span className="text-xs font-bold text-[#8C4A26] bg-[#F7F1EB] px-2.5 py-1 rounded-full shrink-0">
              {t.flows[flow].name}
            </span>
          </div>

          {/* Clean Tactile Flow Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {([1, 2, 3] as FlowLevel[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onFlowChange(f)}
                className={`py-3.5 sm:py-4 px-1.5 sm:px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  flow === f
                    ? 'border-[#382314] bg-[#382314] text-[#FAF8F5] shadow-sm font-bold'
                    : 'border-[#E5DFD5] bg-[#FAF8F5] text-[#382314] hover:bg-[#F3EFE9] hover:border-[#D5CCC0]'
                }`}
              >
                <span className="block text-xs sm:text-sm font-bold truncate">
                  {t.flows[f].name}
                </span>
                <span className="block text-[10px] sm:text-[11px] opacity-75 mt-0.5 font-normal truncate">
                  {t.flows[f].tag}
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs text-[#6B5A4D] leading-relaxed">{t.flows[flow].desc}</p>
        </div>
      </div>
    </div>
  );
};
