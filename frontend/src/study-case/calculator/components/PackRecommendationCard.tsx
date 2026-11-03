import React from 'react';
import type { PackRecommendation } from '../engine/types';
import { type Language, translations, formatPackCombination } from '../i18n/translations';
import { Sparkles, Heart, PackageCheck } from 'lucide-react';

interface PackRecommendationCardProps {
  recommendation: PackRecommendation;
  language: Language;
}

export const PackRecommendationCard: React.FC<PackRecommendationCardProps> = ({
  recommendation,
  language,
}) => {
  const {
    requirements,
    totalUnderwearNeeded,
    totalPadsNeeded,
    totalUnitsNeeded,
    underwearPack,
    padsPack,
  } = recommendation;

  const t = translations[language].packs;

  const underwearComboText = formatPackCombination(underwearPack.packCombination, language);
  const padsComboText = formatPackCombination(padsPack.packCombination, language);

  return (
    <div
      id="pack-recommendation"
      className="bg-white rounded-3xl border border-[#E8E2D9] overflow-hidden shadow-xs space-y-0"
    >
      {/* Friendly Top Header */}
      <div className="bg-[#382314] text-[#FAF8F5] px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-4 h-4 text-[#E6C280] shrink-0" />
          <span className="text-xs uppercase tracking-wider sm:tracking-widest font-bold text-[#E6C280]">
            {t.headerTitle}
          </span>
          <span className="text-[#8C7A6D] hidden xs:inline">·</span>
          <span className="text-xs text-[#EAE4DC] font-medium hidden sm:inline">
            {t.headerSoldIn}
          </span>
        </div>

        <div className="text-xs text-[#FAF8F5] flex items-center gap-1.5 font-medium">
          <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F] shrink-0" />
          <span className="text-[11px] sm:text-xs">{t.headerApprox}</span>
        </div>
      </div>

      <div className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
        {/* Total Summary Strip displaying the two distinct totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Box 1: Total Period Panties & Menstrual Boxers */}
          <div className="p-5 sm:p-7 rounded-2xl bg-[#FAF8F5] border-2 border-[#382314] flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-[#8C4A26] uppercase tracking-wider block">
                  {t.pack1Eyebrow}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#382314] mt-0.5">
                  {t.pack1Title}
                </h3>
                <p className="text-xs text-[#6B5A4D] mt-1">{t.pack1Subtitle}</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E0D8CD] flex flex-col items-center justify-center shrink-0 shadow-2xs">
                <span className="text-xl font-black text-[#382314] leading-none">
                  {totalUnderwearNeeded}
                </span>
                <span className="text-[9px] font-bold text-[#8C4A26] uppercase mt-0.5">
                  {t.pack1TotalLabel}
                </span>
              </div>
            </div>

            {/* Recommended Underwear Pack Combo */}
            <div className="p-4 rounded-xl bg-white border border-[#E0D8CD] space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8C4A26] uppercase tracking-wider block">
                {t.pack1BestLabel}
              </span>
              <div className="text-base sm:text-xl font-black text-[#382314]">
                {underwearComboText}
              </div>
              <p className="text-xs text-[#6B5A4D]">
                {t.pack1BufferText(totalUnderwearNeeded, underwearPack.packCombination.excessUnits)}
              </p>
            </div>

            {/* Individual Item Breakdown inside Underwear Pack */}
            <div className="pt-2 border-t border-[#EAE4DB] grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#EAE4DB]">
                <span className="text-[11px] text-[#6B5A4D] block truncate">
                  {t.pack1PantiesLabel}
                </span>
                <span className="text-xl font-black text-[#382314]">{requirements.panty}</span>
                <span className="text-[11px] text-[#8C7A6D] block">{t.unitsSuffix}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#EAE4DB]">
                <span className="text-[11px] text-[#6B5A4D] block truncate">
                  {t.pack1BoxersLabel}
                </span>
                <span className="text-xl font-black text-[#382314]">{requirements.boxer}</span>
                <span className="text-[11px] text-[#8C7A6D] block">{t.unitsSuffix}</span>
              </div>
            </div>
          </div>

          {/* Box 2: Total Menstrual Pads */}
          <div className="p-5 sm:p-7 rounded-2xl bg-[#FAF8F5] border-2 border-[#8C4A26] flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-[#8C4A26] uppercase tracking-wider block">
                  {t.pack2Eyebrow}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#382314] mt-0.5">
                  {t.pack2Title}
                </h3>
                <p className="text-xs text-[#6B5A4D] mt-1">{t.pack2Subtitle}</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E0D8CD] flex flex-col items-center justify-center shrink-0 shadow-2xs">
                <span className="text-xl font-black text-[#382314] leading-none">
                  {totalPadsNeeded}
                </span>
                <span className="text-[9px] font-bold text-[#8C4A26] uppercase mt-0.5">
                  {t.pack2TotalLabel}
                </span>
              </div>
            </div>

            {/* Recommended Pads Pack Combo */}
            <div className="p-4 rounded-xl bg-white border border-[#E0D8CD] space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8C4A26] uppercase tracking-wider block">
                {t.pack2BestLabel}
              </span>
              <div className="text-base sm:text-xl font-black text-[#382314]">{padsComboText}</div>
              <p className="text-xs text-[#6B5A4D]">
                {t.pack2BufferText(totalPadsNeeded, padsPack.packCombination.excessUnits)}
              </p>
            </div>

            {/* Individual Item Breakdown inside Pads Pack */}
            <div className="pt-2 border-t border-[#EAE4DB] text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#EAE4DB]">
                <span className="text-[11px] text-[#6B5A4D] block truncate">
                  {t.pack2PadsLabel}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-[#382314]">{requirements.pad}</span>
                  <span className="text-[11px] text-[#8C7A6D]">{t.padsRecommendedSuffix}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Overall Peace of Mind Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F3EE] border border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs text-[#6B5A4D]">
          <div className="flex items-start sm:items-center gap-3">
            <PackageCheck className="w-5 h-5 text-[#8C4A26] shrink-0 mt-0.5 sm:mt-0" />
            <div className="leading-relaxed">
              <strong className="text-[#382314]">{t.investmentTitle} </strong>
              {t.investmentBody(totalUnderwearNeeded, totalPadsNeeded, totalUnitsNeeded)}
            </div>
          </div>
          <span className="font-bold text-[#382314] shrink-0 bg-white px-3 py-1.5 rounded-lg border border-[#E0D8CD] self-start sm:self-auto text-[11px] sm:text-xs">
            {t.zeroWastePill}
          </span>
        </div>
      </div>
    </div>
  );
};
