import React, { useState } from 'react';
import type { PeriodDays, FlowLevel, ProductRequirements } from '../engine/types';
import { simulateCycleTimeline } from '../engine/calculator';
import { type Language, translations } from '../i18n/translations';
import { Sun, Moon, Sunset, Heart, Sparkles } from 'lucide-react';

interface CycleScheduleTimelineProps {
  days: PeriodDays;
  flow: FlowLevel;
  inventory: ProductRequirements;
  language: Language;
}

export const CycleScheduleTimeline: React.FC<CycleScheduleTimelineProps> = ({
  days,
  flow,
  inventory,
  language,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  const t = translations[language].routine;
  const timeline = simulateCycleTimeline(days, flow, inventory);

  const filteredTimeline =
    selectedDay === 'all' ? timeline : timeline.filter((block) => block.day === selectedDay);

  const blockIcons = {
    morning: <Sun className="w-4 h-4 text-[#D97706] shrink-0" />,
    afternoon: <Sunset className="w-4 h-4 text-[#EA580C] shrink-0" />,
    night: <Moon className="w-4 h-4 text-[#6366F1] shrink-0" />,
  };

  const getBlockName = (block: 'morning' | 'afternoon' | 'night') => {
    switch (block) {
      case 'morning':
        return t.blockMorning;
      case 'afternoon':
        return t.blockAfternoon;
      case 'night':
        return t.blockNight;
    }
  };

  const getFlowText = (flowVal: number) => {
    switch (flowVal) {
      case 1:
        return t.flowLight;
      case 2:
        return t.flowMedium;
      case 3:
        return t.flowHeavy;
      default:
        return t.flowNone;
    }
  };

  return (
    <div
      id="washing-timeline"
      className="bg-white rounded-3xl border border-[#E8E2D9] p-4 sm:p-8 lg:p-10 shadow-xs space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 border-b border-[#EFECE6] gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-[#382314] tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A4D] mt-1 max-w-xl leading-relaxed">
            {t.subtitle(days)}
          </p>
        </div>

        {/* Day Selector with touch scroll on mobile */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F2EB] rounded-2xl text-xs font-medium self-start sm:self-auto border border-[#EAE4DB] max-w-full overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs ${
              selectedDay === 'all'
                ? 'bg-white text-[#382314] shadow-xs font-bold'
                : 'text-[#6B5A4D] hover:text-[#382314]'
            }`}
          >
            {t.allDays(days)}
          </button>
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedDay === d
                  ? 'bg-white text-[#382314] shadow-xs font-bold'
                  : 'text-[#6B5A4D] hover:text-[#382314]'
              }`}
            >
              {t.dayLabel(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Friendly Washing Assumption Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DB] text-[#382314] text-xs sm:text-sm flex items-start gap-3 sm:gap-3.5">
        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C4A26] shrink-0 mt-0.5 fill-[#8C4A26]" />
        <div className="leading-relaxed">
          <strong className="text-[#382314]">{t.gentleRhythmTitle} </strong>
          {t.gentleRhythmBody}
        </div>
      </div>

      {/* Routine Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl border border-[#EAE4DB] bg-[#FAF8F5]/60">
          <div className="text-[10px] sm:text-[11px] font-bold text-[#8C4A26] uppercase tracking-wider">
            {t.phase1Title}
          </div>
          <div className="text-sm sm:text-base font-bold text-[#382314] mt-1">{t.phase1Range}</div>
          <p className="text-xs text-[#6B5A4D] mt-1.5 leading-relaxed">{t.phase1Desc}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#D9C8B4] bg-[#F7F2EC]">
          <div className="text-[10px] sm:text-[11px] font-bold text-[#8C4A26] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8C4A26] inline-block"></span>
            {t.phase2Title}
          </div>
          <div className="text-sm sm:text-base font-bold text-[#382314] mt-1">{t.phase2Range}</div>
          <p className="text-xs text-[#6B5A4D] mt-1.5 leading-relaxed">{t.phase2Desc}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#C5D9BE] bg-[#F4F9F2]">
          <div className="text-[10px] sm:text-[11px] font-bold text-[#4B703F] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5C8A4D]" />
            {t.phase3Title}
          </div>
          <div className="text-sm sm:text-base font-bold text-[#2A4422] mt-1">{t.phase3Range}</div>
          <p className="text-xs text-[#4B6B40] mt-1.5 leading-relaxed">{t.phase3Desc}</p>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto border border-[#EAE4DB] rounded-2xl w-full max-w-full">
        <table className="w-full text-left text-xs min-w-[600px] sm:min-w-[650px]">
          <thead className="bg-[#FAF8F5] border-b border-[#EAE4DB] text-[#6B5A4D] uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">{t.tableColTime}</th>
              <th className="py-3 px-4">{t.tableColFlow}</th>
              <th className="py-3 px-4">{t.tableColProtection}</th>
              <th className="py-3 px-4">{t.tableColStatus}</th>
              <th className="py-3 px-4 text-right">{t.tableColDrawer}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE3] text-[#382314]">
            {filteredTimeline.map((item, idx) => {
              const isDryNight = item.day === 2 && item.block === 'night';
              const isCleanReturn = item.day === 3 && item.block === 'morning';
              const blockLabel = getBlockName(item.block);
              const flowLabel = getFlowText(item.flow);

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isCleanReturn
                      ? 'bg-[#F4F9F2]/60'
                      : isDryNight
                        ? 'bg-[#FAF5EE]'
                        : 'hover:bg-[#FAF8F5]/80'
                  }`}
                >
                  {/* Time Block */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      {blockIcons[item.block]}
                      <div>
                        <span className="font-bold text-[#382314]">
                          {t.dayLabel(item.day)} {blockLabel}
                        </span>
                        <span className="text-[11px] text-[#6B5A4D] block tabular-nums">
                          {item.timeRange}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Flow */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-[#6B5A4D]">{flowLabel}</span>
                  </td>

                  {/* Products Worn */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-x-1.5 font-medium text-[#382314]">
                      {item.needs.pad > 0 && <span>{t.itemPad(item.needs.pad)}</span>}
                      {item.needs.panty > 0 && <span>{t.itemPanty(item.needs.panty)}</span>}
                      {item.needs.boxer > 0 && <span>{t.itemBoxer(item.needs.boxer)}</span>}
                      {item.needs.pad === 0 && item.needs.panty === 0 && item.needs.boxer === 0 && (
                        <span className="text-[#A39284]">{t.itemRest}</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {isCleanReturn ? (
                      <span className="text-[#4B703F] font-bold flex items-center gap-1 whitespace-nowrap">
                        <Sparkles className="w-3.5 h-3.5 text-[#5C8A4D]" />
                        {t.statusCleanReady}
                      </span>
                    ) : isDryNight ? (
                      <span className="text-[#8C4A26] font-semibold whitespace-nowrap">
                        {t.statusAirDrying}
                      </span>
                    ) : item.phase === 'pre_wash' ? (
                      <span className="text-[#6B5A4D] whitespace-nowrap">{t.statusFirstWear}</span>
                    ) : (
                      <span className="text-[#6B5A4D] whitespace-nowrap">
                        {t.statusCleanActive}
                      </span>
                    )}
                  </td>

                  {/* Clean Drawer stock */}
                  <td className="py-3.5 px-4 text-right tabular-nums font-mono whitespace-nowrap">
                    <span className="font-bold text-[#382314]">
                      {item.cleanRemaining.pad}p / {item.cleanRemaining.panty}b /{' '}
                      {item.cleanRemaining.boxer}x
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
