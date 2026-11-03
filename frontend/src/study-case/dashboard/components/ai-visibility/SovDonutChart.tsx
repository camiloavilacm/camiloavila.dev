import React from 'react';
import type * as echarts from 'echarts';
import { EChart } from '../ui/EChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { BrandLeaderboardItem } from '../../types';

interface SovDonutChartProps {
  brands?: BrandLeaderboardItem[];
  isLoading?: boolean;
}

export const SovDonutChart: React.FC<SovDonutChartProps> = ({ brands = [], isLoading = false }) => {
  const brandColors: Record<string, string> = {
    'Carolina Smith': '#0077ff',
    "Women'secret": '#ec4899',
    Ecowoman: '#10b981',
    Sorio: '#f59e0b',
    'Cocoro Intim': '#8b5cf6',
  };

  const chartData = brands.map((b) => ({
    name: b.brandName,
    value: b.totalMentions,
    itemStyle: { color: brandColors[b.brandName] || '#94a3b8' },
  }));

  const carolinaSmith = brands.find((b) => b.isOwnBrand);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        const brand = brands.find((b) => b.brandName === params.name);
        return `
          <div style="font-weight:600;margin-bottom:4px;">${params.name} ${brand?.isOwnBrand ? '(Own Brand)' : ''}</div>
          <div>Share of Voice: <b>${brand?.shareOfVoicePct}%</b></div>
          <div>Total Mentions: <b>${params.value.toLocaleString()}</b></div>
          <div>Mention Rate: <b>${brand?.mentionRatePct}%</b></div>
          <div>Avg Rank: <b>#${brand?.avgRank}</b></div>
          <div>Avg Sentiment: <b>${brand?.avgSentimentScore}</b></div>
        `;
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'middle',
      textStyle: { color: '#64748b', fontSize: 11 },
    },
    series: [
      {
        name: 'Brand Share of Voice',
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['36%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => (carolinaSmith ? `${carolinaSmith.shareOfVoicePct}%\nCS SOV` : 'SOV'),
          fontSize: 14,
          fontWeight: 700,
          color: '#0f172a',
        },
        data: chartData,
      },
    ],
  };

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader>
        <CardTitle>AI Share of Voice Benchmark</CardTitle>
        <CardDescription>
          Carolina Smith vs. Ecowoman, Sorio, Women'secret, and Cocoro Intim across 1,664 LLM prompt
          evaluations
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <EChart option={option} height={280} loading={isLoading} />
      </CardContent>
    </Card>
  );
};
