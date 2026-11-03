import type React from 'react';
import type { DashboardTab, TimeRange } from '../../types';

interface HeaderProps {
  currentTab: DashboardTab;
  brandName?: string;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  channel?: string;
  onChannelChange?: (ch: string) => void;
  comparePeriod?: string;
  onComparePeriodChange?: (cp: string) => void;
  viewMode?: 'expert' | 'summary';
  onViewModeChange?: (vm: 'expert' | 'summary') => void;
}

const TAB_SCREEN_MAP: Record<DashboardTab, { screenNumber: number; title: string }> = {
  overview: { screenNumber: 1, title: 'Daily overview' },
  spend: { screenNumber: 2, title: 'Spend, channels & campaigns' },
  customers: { screenNumber: 3, title: 'Customers & retention' },
  cohorts: { screenNumber: 4, title: 'Cohorts, light version' },
  targets: { screenNumber: 5, title: 'Targets & pace' },
  industry: { screenNumber: 6, title: 'Industry snapshot' },
  'competitor-prices': { screenNumber: 7, title: 'Competitor prices & AI visibility' },
};

export const Header: React.FC<HeaderProps> = ({ currentTab, brandName = 'Alder & Thread' }) => {
  const currentScreen = TAB_SCREEN_MAP[currentTab] || { screenNumber: 1, title: 'Overview' };

  return (
    <header className="bg-transparent px-8 pt-4 pb-1 shrink-0">
      {/* Top Meta Line (from Screen 1 screenshot image11.png) */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-slate-700">{brandName}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">Screen {currentScreen.screenNumber} of 7</span>
        </div>

        <div className="flex items-center gap-5 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-800 font-medium">
            <span className="text-amber-500 text-xs font-bold">★</span>
            Added on top of your Shopify dashboard
          </span>
          <span className="text-slate-400">Sample data · fictional brand</span>
          <span className="text-slate-400 font-mono text-[11px]">Updated today 06:00</span>
        </div>
      </div>
    </header>
  );
};
