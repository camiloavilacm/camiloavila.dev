import React from 'react';
import type * as echarts from 'echarts';
import { EChart } from '../ui/EChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { AiSovResponse } from '../../types';

interface SovTrendChartProps {
  monthlyTrend?: AiSovResponse['monthlyTrend'];
  providerComparison?: AiSovResponse['providerComparison'];
  isLoading?: boolean;
}

export const SovTrendChart: React.FC<SovTrendChartProps> = ({
  monthlyTrend = [],
  providerComparison = [],
  isLoading = false,
}) => {
  const months = monthlyTrend.map((m) => m.month);
  const sovData = monthlyTrend.map((m) => m.avgSovPct);
  const mentionRateData = monthlyTrend.map((m) => m.mentionRatePct);

  const trendOption: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        if (!Array.isArray(params) || !params.length) return '';
        const idx = params[0].dataIndex;
        const item = monthlyTrend[idx];
        if (!item) return '';
        return `
          <div style="font-weight:600;margin-bottom:6px;border-bottom:1px solid #334155;padding-bottom:4px;">${item.month}</div>
          <div>Share of Voice: <b style="color:#0077ff">${item.avgSovPct}%</b></div>
          <div>Mention Rate: <b style="color:#10b981">${item.mentionRatePct}%</b></div>
          <div>Avg Rank: <b style="color:#f59e0b">#${item.avgRank}</b></div>
        `;
      },
    },
    legend: {
      data: ['Share of Voice (%)', 'Mention Rate (%)'],
      bottom: 0,
      textStyle: { color: '#64748b', fontSize: 11 },
    },
    grid: { left: '2%', right: '4%', top: '10%', bottom: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Pct (%)',
        nameTextStyle: { color: '#64748b', fontSize: 10 },
        max: 100,
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLabel: { color: '#64748b', fontSize: 10, formatter: '{value}%' },
      },
    ],
    series: [
      {
        name: 'Share of Voice (%)',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        data: sovData,
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
              { offset: 0, color: 'rgba(0,119,255,0.2)' },
              { offset: 1, color: 'rgba(0,119,255,0.01)' },
            ],
          },
        },
      },
      {
        name: 'Mention Rate (%)',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        data: mentionRateData,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 2, color: '#10b981', type: 'dashed' },
      },
    ],
  };

  const providerColors: Record<string, string> = {
    openai: '#10a37f',
    anthropic: '#c97d4e',
    google: '#4285f4',
    perplexity: '#6366f1',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* SOV Trend Line */}
      <Card className="lg:col-span-8 p-0 overflow-hidden">
        <CardHeader>
          <CardTitle>Carolina Smith AI Visibility Trend (12 Months)</CardTitle>
          <CardDescription>
            Monthly Share of Voice % and Mention Rate across all LLM provider evaluations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <EChart option={trendOption} height={280} loading={isLoading} />
        </CardContent>
      </Card>

      {/* Provider Comparison Table */}
      <Card className="lg:col-span-4 p-0 overflow-hidden">
        <CardHeader>
          <CardTitle>LLM Provider Comparison</CardTitle>
          <CardDescription>
            Per-model Carolina Smith SOV, mention rates, and avg rank
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-slate-100">
            {providerComparison.map((p) => (
              <div key={p.provider} className="py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: providerColors[p.provider] || '#94a3b8' }}
                    />
                    <span className="text-xs font-bold text-slate-800 uppercase font-mono">
                      {p.provider}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{p.model}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-[11px] font-mono">
                  <div>
                    <div className="font-bold text-blue-600">{p.carolinaSmithSovPct}%</div>
                    <div className="text-slate-400 text-[9px]">SOV</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-600">{p.mentionRatePct}%</div>
                    <div className="text-slate-400 text-[9px]">Mention</div>
                  </div>
                  <div>
                    <div className="font-bold text-amber-600">#{p.avgRank.toFixed(1)}</div>
                    <div className="text-slate-400 text-[9px]">Avg Rank</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
