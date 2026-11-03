import type React from 'react';
import type * as echarts from 'echarts';
import { EChart } from '../ui/EChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { DashboardOverviewResponse } from '../../types';

interface ProductBreakdownProps {
  productBreakdown?: DashboardOverviewResponse['productBreakdown'];
  topProducts?: DashboardOverviewResponse['topProducts'];
  isLoading?: boolean;
}

export const ProductBreakdownChart: React.FC<ProductBreakdownProps> = ({
  productBreakdown = [],
  topProducts = [],
  isLoading = false,
}) => {
  const chartCategories = productBreakdown.map(
    (p) => `${p.productType === 'sujetador' ? 'Swim Tops' : 'Menstrual Swimwear'} (${p.audience})`
  );
  const revenueData = productBreakdown.map((p) => p.revenueEur);
  const returnRateData = productBreakdown.map((p) => p.returnRatePct);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const idx = params[0].dataIndex;
        const item = productBreakdown[idx];
        if (!item) return '';
        return `
          <div style="font-weight:600;margin-bottom:4px;">${chartCategories[idx]}</div>
          <div>Revenue: <b>€${item.revenueEur.toLocaleString()}</b></div>
          <div>Units Sold: <b>${item.unitsSold.toLocaleString()}</b></div>
          <div>Return Rate: <b style="color:${item.returnRatePct > 10 ? '#f43f5e' : '#10b981'}">${item.returnRatePct}%</b></div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '12%',
      bottom: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartCategories,
      axisLabel: { color: '#64748b', fontSize: 11 },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Revenue (€)',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: {
          color: '#64748b',
          formatter: (v: number) => `€${(v / 1000).toFixed(0)}k`,
        },
      },
      {
        type: 'value',
        name: 'Return Rate (%)',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        max: 20,
        splitLine: { show: false },
        axisLabel: {
          color: '#64748b',
          formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: 'Revenue (€)',
        type: 'bar',
        barWidth: '38%',
        data: revenueData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#38bdf8' },
              { offset: 1, color: '#0077ff' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Return Rate (%)',
        type: 'line',
        yAxisIndex: 1,
        data: returnRateData,
        itemStyle: { color: '#ff3355' },
        lineStyle: { width: 2, color: '#ff3355' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Category & Audience Distribution */}
      <Card className="lg:col-span-6 p-0 overflow-hidden">
        <CardHeader>
          <CardTitle>Catalog Mix: Product Type & Audience</CardTitle>
          <CardDescription>
            Menstrual Bikinis (€29.90) vs Swim Tops (€24.90) across Adult & Girls segments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <EChart option={option} height={280} loading={isLoading} />
        </CardContent>
      </Card>

      {/* Top 5 Products Leaderboard */}
      <Card className="lg:col-span-6 p-0 overflow-hidden flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Top Selling SKUs by Revenue</CardTitle>
          <CardDescription>
            Performance leaders in coral and blue polka dot colorways
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 flex-1">
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {topProducts.map((p, idx) => (
              <div key={p.productId} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-500 text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      €{p.priceEur.toFixed(2)} • {p.unitsSold} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-slate-900 font-mono">
                    €
                    {p.revenueEur.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ret:{' '}
                    <span
                      className={
                        p.returnRatePct > 10
                          ? 'text-rose-500 font-semibold'
                          : 'text-emerald-600 font-semibold'
                      }
                    >
                      {p.returnRatePct}%
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
