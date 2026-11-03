import React from 'react';
import type * as echarts from 'echarts';
import { EChart } from '../ui/EChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { DashboardOverviewResponse } from '../../types';

interface TrendLineChartProps {
  trends?: DashboardOverviewResponse['trends'];
  isLoading?: boolean;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  trends = [],
  isLoading = false,
}) => {
  const dates = trends.map((t) => t.date);
  const netRevenue = trends.map((t) => t.netRevenue);
  const marketingSpend = trends.map((t) => t.marketingSpend);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const itemIdx = params[0].dataIndex;
        const currentTrend = trends[itemIdx];
        if (!currentTrend) return '';

        let content = `<div style="font-weight:600;margin-bottom:6px;border-bottom:1px solid #334155;padding-bottom:4px;">${currentTrend.date}</div>`;
        content += `<div style="display:flex;justify-content:space-between;gap:12px;margin:3px 0;"><span>Net Revenue:</span><b>€${currentTrend.netRevenue.toFixed(2)}</b></div>`;
        content += `<div style="display:flex;justify-content:space-between;gap:12px;margin:3px 0;"><span>Marketing Spend:</span><b>€${currentTrend.marketingSpend.toFixed(2)}</b></div>`;
        content += `<div style="display:flex;justify-content:space-between;gap:12px;margin:3px 0;"><span>Daily Orders:</span><b>${currentTrend.orders}</b></div>`;
        if (currentTrend.roas > 0) {
          content += `<div style="display:flex;justify-content:space-between;gap:12px;margin:3px 0;color:#10b981;"><span>Daily ROAS:</span><b>${currentTrend.roas.toFixed(2)}x</b></div>`;
        }
        return content;
      },
    },
    legend: {
      data: ['Net Revenue (€)', 'Marketing Spend (€)'],
      bottom: 0,
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    grid: {
      left: '1%',
      right: '2%',
      top: '12%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: {
        color: '#64748b',
        fontSize: 10,
        formatter: (val: string) => {
          // Show format: 'MMM D'
          const parts = val.split('-');
          if (parts.length === 3) return `${parts[1]}/${parts[2]}`;
          return val;
        },
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        formatter: (val: number) => `€${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`,
      },
    },
    series: [
      {
        name: 'Net Revenue (€)',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: netRevenue,
        itemStyle: { color: '#0077ff' },
        lineStyle: { width: 2.5, color: '#0077ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 119, 255, 0.22)' },
              { offset: 1, color: 'rgba(0, 119, 255, 0.01)' },
            ],
          },
        },
        markArea: {
          silent: true,
          itemStyle: {
            color: 'rgba(255, 51, 85, 0.05)',
          },
          data: [
            [
              {
                name: 'Black Week',
                xAxis: '2025-11-20',
              },
              {
                xAxis: '2025-12-01',
              },
            ],
            [
              {
                name: 'Summer Peak',
                xAxis: '2026-06-01',
              },
              {
                xAxis: '2026-08-31',
              },
            ],
          ],
        },
      },
      {
        name: 'Marketing Spend (€)',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: marketingSpend,
        itemStyle: { color: '#ff3355' },
        lineStyle: { width: 1.8, color: '#ff3355', type: 'dashed' },
      },
    ],
  };

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Trend vs. Marketing Spend</CardTitle>
          <CardDescription>
            Multi-series historical net revenue with seasonal peak indicators (Summer Peak & Black
            Week)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <EChart option={option} height={340} loading={isLoading} />
      </CardContent>
    </Card>
  );
};
