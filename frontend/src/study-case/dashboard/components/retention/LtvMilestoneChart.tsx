import React from 'react';
import type * as echarts from 'echarts';
import { EChart } from '../ui/EChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { LtvProgressionItem, ChannelLtvItem } from '../../types';

interface LtvMilestoneChartProps {
  ltvProgression?: LtvProgressionItem[];
  channelLtv?: ChannelLtvItem[];
  isLoading?: boolean;
}

export const LtvMilestoneChart: React.FC<LtvMilestoneChartProps> = ({
  ltvProgression = [],
  channelLtv = [],
  isLoading = false,
}) => {
  const milestoneDays = ltvProgression.map((m) => `Day ${m.milestoneDays}`);
  const averageLtv = ltvProgression.map((m) => m.averageLtv);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const idx = params[0].dataIndex;
        const item = ltvProgression[idx];
        if (!item) return '';
        return `
          <div style="font-weight:600;margin-bottom:4px;">Day ${item.milestoneDays} Milestone</div>
          <div>Cumulative Average LTV: <b>€${item.averageLtv.toFixed(2)}</b></div>
          <div>Cohort Revenue: <b>€${item.cumulativeRevenue.toLocaleString()}</b></div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '12%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: milestoneDays,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: {
        color: '#64748b',
        formatter: (v: number) => `€${v.toFixed(0)}`,
      },
    },
    series: [
      {
        name: 'Average LTV (€)',
        type: 'line',
        smooth: true,
        data: averageLtv,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3, color: '#10b981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.02)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 8,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LTV Curve */}
      <Card className="lg:col-span-7 p-0 overflow-hidden">
        <CardHeader>
          <CardTitle>Cumulative LTV Progression Curve</CardTitle>
          <CardDescription>
            Average customer monetary value growth from initial purchase through 360-day lifecycle
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <EChart option={option} height={280} loading={isLoading} />
        </CardContent>
      </Card>

      {/* Acquisition Source LTV Breakdown */}
      <Card className="lg:col-span-5 p-0 overflow-hidden flex flex-col justify-between">
        <CardHeader>
          <CardTitle>LTV by Acquisition Channel</CardTitle>
          <CardDescription>Channel quality & repeat purchase propensity</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 flex-1">
          <div className="divide-y divide-slate-100">
            {channelLtv.map((ch) => (
              <div
                key={ch.acquisitionSource}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800 uppercase font-mono text-[11px]">
                    {ch.acquisitionSource.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {ch.customersCount} customers • {ch.repeatRatePct}% repeat
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-slate-900 text-sm">
                    €{ch.averageLtv.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">Avg LTV</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
