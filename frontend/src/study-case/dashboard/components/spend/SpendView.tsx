import React from 'react';
import { SpendAttributionDonut } from './SpendAttributionDonut';
import { CampaignTable } from './CampaignTable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useMarketingPerformance } from '../../api/queries';
import type { TimeRange } from '../../types';

interface SpendViewProps {
  timeRange: TimeRange;
}

export const SpendView: React.FC<SpendViewProps> = ({ timeRange }) => {
  const getDates = (range: TimeRange) => {
    switch (range) {
      case 'summer':
        return { startDate: '2026-06-01', endDate: '2026-08-31' };
      case 'black_week':
        return { startDate: '2025-11-20', endDate: '2025-12-01' };
      case '90d':
        return { startDate: '2026-08-01', endDate: '2026-10-31' };
      case '30d':
        return { startDate: '2026-10-01', endDate: '2026-10-31' };
      case '12m':
      case 'all':
      default:
        return { startDate: '2025-11-01', endDate: '2026-10-31' };
    }
  };

  const { startDate, endDate } = getDates(timeRange);
  const { data, isLoading } = useMarketingPerformance(startDate, endDate);

  const platforms = data?.platformBreakdown || [];
  const campaigns = data?.campaigns || [];
  const salesChannels = data?.salesChannelComparison || [];

  return (
    <div className="space-y-6">
      {/* Platform Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((p) => {
          const isMeta = p.platform === 'meta';
          const isGoogle = p.platform === 'google';

          const accentColor = isMeta
            ? 'border-blue-500/30'
            : isGoogle
              ? 'border-emerald-500/30'
              : 'border-rose-500/30';

          const badgeVariant = isMeta ? 'info' : isGoogle ? 'success' : 'danger';

          return (
            <Card key={p.platform} className={`p-4 border-t-2 ${accentColor}`}>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={badgeVariant} className="uppercase font-mono">
                  {p.platform} ADS
                </Badge>
                <span className="text-xs text-slate-500 font-mono">
                  {p.spendSharePct}% of Spend
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">
                    €{p.spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Attributed: €
                    {p.attributedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-slate-800">
                    {p.attributedRoas.toFixed(2)}x
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">ROAS</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">CTR</div>
                  <div className="text-xs font-semibold text-slate-700">{p.ctrPct.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">CPC</div>
                  <div className="text-xs font-semibold text-slate-700">€{p.cpcEur.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">CPA</div>
                  <div className="text-xs font-semibold text-slate-700">€{p.cpaEur.toFixed(2)}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Donut and Sales Channels Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <SpendAttributionDonut platforms={platforms} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-5">
          <Card className="p-0 overflow-hidden h-full flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Shopify Sales Channels Verification</CardTitle>
              <CardDescription>
                Gross order distribution cross-validated with ad platform tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <div className="space-y-3">
                {salesChannels.map((ch) => (
                  <div key={ch.channel} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 uppercase font-mono text-[11px]">
                        {ch.channel.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-slate-600">
                        €{ch.netRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} (
                        {ch.revenueSharePct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, ch.revenueSharePct)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>{ch.orders} orders</span>
                      <span>AOV: €{ch.aov.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TanStack Campaign Table */}
      <CampaignTable campaigns={campaigns} isLoading={isLoading} />
    </div>
  );
};
