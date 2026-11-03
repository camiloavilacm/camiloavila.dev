import React from 'react';
import { Euro, ShoppingCart, Users, TrendingUp, Percent, RotateCcw } from 'lucide-react';
import { Card } from '../ui/Card';
import type { DashboardOverviewResponse } from '../../types';

interface KpiCardsProps {
  summary?: DashboardOverviewResponse['summary'];
  isLoading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary, isLoading = false }) => {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
            <div className="h-7 bg-slate-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Net Revenue',
      value: `€${summary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `Gross: €${summary.grossRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: Euro,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Total Orders',
      value: summary.totalOrders.toLocaleString(),
      subtitle: `${summary.totalUnitsSold.toLocaleString()} units sold (${summary.avgUnitsPerOrder} / order)`,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Average Order Value',
      value: `€${summary.averageOrderValue.toFixed(2)}`,
      subtitle: 'Target: €52.00',
      icon: Percent,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Blended ROAS',
      value: `${summary.blendedRoas.toFixed(2)}x`,
      subtitle: `Spend: €${summary.totalMarketingSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: TrendingUp,
      color: summary.blendedRoas >= 3.0 ? 'text-emerald-600' : 'text-amber-600',
      bg: summary.blendedRoas >= 3.0 ? 'bg-emerald-50' : 'bg-amber-50',
    },
    {
      title: 'Blended CAC',
      value: `€${summary.blendedCac.toFixed(2)}`,
      subtitle: `${summary.newCustomers.toLocaleString()} new customers`,
      icon: Users,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      title: 'Refund Rate',
      value: `${summary.refundRatePct.toFixed(1)}%`,
      subtitle: `Refunded: €${summary.totalRefunded.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: RotateCcw,
      color: summary.refundRatePct < 10 ? 'text-slate-700' : 'text-rose-600',
      bg: summary.refundRatePct < 10 ? 'bg-slate-50' : 'bg-rose-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card key={idx} className="p-4 hover:border-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                {kpi.title}
              </span>
              <div className={`p-1.5 rounded-md ${kpi.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 tracking-tight font-mono">
              {kpi.value}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">{kpi.subtitle}</div>
          </Card>
        );
      })}
    </div>
  );
};
