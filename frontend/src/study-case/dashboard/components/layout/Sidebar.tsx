import React from 'react';
import {
  LayoutGrid,
  BarChart2,
  Users,
  GitFork,
  Target,
  Store,
  Tag,
  ChevronLeft,
} from 'lucide-react';
import type { DashboardTab } from '../../types';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  brandName?: string;
  onToggleBrand?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  brandName = 'Alder & Thread',
  onToggleBrand,
  onToggleCollapse,
}) => {
  const navItems: Array<{
    id: DashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'overview',
      label: 'Daily overview',
      icon: LayoutGrid,
    },
    {
      id: 'spend',
      label: 'Spend & campaigns',
      icon: BarChart2,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'cohorts',
      label: 'Cohorts',
      icon: GitFork,
    },
    {
      id: 'targets',
      label: 'Targets & pace',
      icon: Target,
    },
    {
      id: 'industry',
      label: 'Industry snapshot',
      icon: Store,
    },
    {
      id: 'competitor-prices',
      label: 'Competitor prices',
      icon: Tag,
    },
  ];

  return (
    <aside className="w-[220px] bg-[#f8f9fa] border-r border-slate-200/90 flex flex-col shrink-0 h-full text-slate-700 select-none">
      {/* Brand Header */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <div
            onClick={onToggleBrand}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            title="Brand store context"
          >
            <div className="w-7 h-7 rounded-md bg-[#133d34] flex items-center justify-center font-bold text-white text-xs shrink-0 tracking-tight font-serif shadow-2xs">
              A
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-slate-900 tracking-tight">
                {brandName}
              </div>
              <div className="text-[11px] text-slate-400 font-normal">Apparel · Shopify</div>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="w-6 h-6 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors shadow-2xs"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-[#dbeee6] text-[#133d34] font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-normal'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 stroke-[1.8] ${
                  isActive ? 'text-[#133d34]' : 'text-slate-500'
                }`}
              />
              <span className="text-[12px] truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
