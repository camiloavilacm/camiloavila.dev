import React from 'react';
import type * as echarts from 'echarts';
import { EChart } from '../ui/EChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { PlatformMetric } from '../../types';

interface SpendAttributionDonutProps {
  platforms?: PlatformMetric[];
  isLoading?: boolean;
}

export const SpendAttributionDonut: React.FC<SpendAttributionDonutProps> = ({
  platforms = [],
  isLoading = false,
}) => {
  const platformColors: Record<string, string> = {
    meta: '#0077ff',
    google: '#10b981',
    tiktok: '#ff3355',
  };

  const spendData = platforms.map((p) => ({
    name: p.platform.toUpperCase(),
    value: p.spend,
    itemStyle: { color: platformColors[p.platform] || '#64748b' },
  }));

  const revenueData = platforms.map((p) => ({
    name: p.platform.toUpperCase(),
    value: p.attributedRevenue,
    itemStyle: { color: platformColors[p.platform] || '#64748b' },
  }));

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        return `
          <div style="font-weight:600;margin-bottom:4px;">${params.name}</div>
          <div>${params.seriesName}: <b>€${params.value.toLocaleString()}</b></div>
          <div>Share: <b>${params.percent}%</b></div>
        `;
      },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#64748b', fontSize: 11 },
    },
    series: [
      {
        name: 'Ad Spend (€)',
        type: 'pie',
        radius: ['42%', '60%'],
        center: ['28%', '46%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => 'SPEND',
          fontSize: 12,
          fontWeight: 700,
          color: '#64748b',
        },
        data: spendData,
      },
      {
        name: 'Attributed Revenue (€)',
        type: 'pie',
        radius: ['42%', '60%'],
        center: ['72%', '46%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => 'REVENUE',
          fontSize: 12,
          fontWeight: 700,
          color: '#64748b',
        },
        data: revenueData,
      },
    ],
  };

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Ad Spend vs. Attributed Revenue by Platform</CardTitle>
        <CardDescription>
          Comparison of budget allocation (left) vs generated sales return (right)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <EChart option={option} height={280} loading={isLoading} />
      </CardContent>
    </Card>
  );
};
