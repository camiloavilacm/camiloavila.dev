import React, { useState } from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EChart } from '../ui/EChart';
import { useDashboardOverview } from '../../api/queries';
import type { TimeRange } from '../../types';
import type { EChartsOption } from 'echarts';

interface DailyOverviewViewProps {
  timeRange?: TimeRange;
}

// Small circular tooltip icon matching docx screenshots
const HelpTooltip = ({ text }: { text?: string }) => (
  <span
    title={text || 'Shopify order ledger metric'}
    className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-slate-300 text-[10px] text-slate-400 font-serif leading-none cursor-help hover:text-slate-600 hover:border-slate-400 select-none shrink-0"
  >
    ?
  </span>
);

export const DailyOverviewView: React.FC<DailyOverviewViewProps> = () => {
  const [activePreset, setActivePreset] = useState<'7d' | '30d' | 'mtd'>('30d');
  const [comparePeriod, setComparePeriod] = useState('previous');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [viewMode, setViewMode] = useState<'expert' | 'summary'>('expert');

  const { data } = useDashboardOverview('30d');

  // Baseline data strictly matching docx Screen 1
  const summary = {
    totalSales: data?.summary?.totalRevenue || 184320,
    salesDelta: '+12.4%',
    salesProgress: 105,
    orders: data?.summary?.totalOrders || 2214,
    ordersDelta: '+9.8%',
    ordersProgress: 103,
    aov: data?.summary?.averageOrderValue || 83.25,
    aovDelta: '+2.4%',
    aovProgress: 102,
    cac: data?.summary?.blendedCac || 36.1,
    cacDelta: '+2.0%',
    cacProgress: 97,
    roas: data?.summary?.blendedRoas || 4.33,
    roasDelta: '+6.0%',
    roasProgress: 108,
    sessions: 98400,
    sessionsDelta: '+7.9%',
    sessionsProgress: 104,
    cvr: 2.25,
    cvrDelta: '+1.8%',
    cvrProgress: 102,
    returnLoss: data?.summary?.totalRefunded || 47780,
    returnLossDelta: '+3.1%',
  };

  // Top five products by return loss (Screen 1 screenshot table)
  const topReturnProducts = [
    {
      id: 1,
      name: 'Waxed Field Jacket',
      loss: '$10,240',
      lossAmount: 10240,
      share: '21%',
      barWidth: 100, // max benchmark
      returnRate: '28.1%',
      topReason: 'Fit: runs small',
    },
    {
      id: 2,
      name: 'Wool Overshirt',
      loss: '$7,560',
      lossAmount: 7560,
      share: '16%',
      barWidth: 74,
      returnRate: '26.0%',
      topReason: 'Fit: runs large',
    },
    {
      id: 3,
      name: 'Selvedge Straight Jean',
      loss: '$6,900',
      lossAmount: 6900,
      share: '14%',
      barWidth: 67,
      returnRate: '21.5%',
      topReason: 'Length and waist',
    },
    {
      id: 4,
      name: 'Merino Crew Sweater',
      loss: '$5,120',
      lossAmount: 5120,
      share: '11%',
      barWidth: 50,
      returnRate: '19.8%',
      topReason: 'Fabric feel',
    },
    {
      id: 5,
      name: 'Quilted Liner Vest',
      loss: '$3,860',
      lossAmount: 3860,
      share: '8%',
      barWidth: 38,
      returnRate: '24.6%',
      topReason: 'Colour not as shown',
    },
  ];

  // Helper generating sparklines visually authentic to the screenshot
  const generateTrendOption = (
    dataPoints: number[],
    targetValue?: number,
    hasArea = true,
    isCurrency = false,
    suffix = ''
  ): EChartsOption => {
    // 30 days categories matching Sep 21 - Oct 20
    const xLabels = Array.from({ length: 30 }, (_, i) => {
      if (i === 0) return 'Sep 21';
      if (i === 14) return 'Oct 5';
      if (i === 29) return 'Oct 20';
      return '';
    });

    const minVal = Math.min(...dataPoints);
    const maxVal = Math.max(...dataPoints);

    return {
      grid: { left: 4, right: 8, top: 12, bottom: 22, containLabel: false },
      xAxis: {
        type: 'category',
        data: xLabels,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          color: '#94a3b8',
          fontSize: 10,
          fontFamily: 'sans-serif',
        },
      },
      yAxis: {
        type: 'value',
        show: false,
        min: targetValue ? Math.min(minVal, targetValue) * 0.85 : minVal * 0.85,
        max: targetValue ? Math.max(maxVal, targetValue) * 1.15 : maxVal * 1.15,
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = params[0];
          const val = p?.value;
          return `<div class="font-sans text-xs"><b>Day ${p.dataIndex + 1}</b>: ${isCurrency ? '$' : ''}${typeof val === 'number' ? val.toLocaleString() : val}${suffix}</div>`;
        },
      },
      series: [
        {
          type: 'line',
          smooth: 0.28,
          symbol: (_value: any, params: any) => (params.dataIndex === 29 ? 'circle' : 'none'),
          symbolSize: 5,
          data: dataPoints,
          lineStyle: {
            color: '#143d34',
            width: 1.8,
          },
          itemStyle: {
            color: '#143d34',
          },
          areaStyle: hasArea
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(20, 61, 52, 0.16)' },
                    { offset: 1, color: 'rgba(20, 61, 52, 0.01)' },
                  ],
                },
              }
            : undefined,
          markLine: targetValue
            ? {
                silent: true,
                symbol: 'none',
                data: [
                  {
                    yAxis: targetValue,
                    lineStyle: { type: 'dashed', color: '#94a3b8', width: 1 },
                    label: { show: false },
                  },
                ],
              }
            : undefined,
        },
      ],
    };
  };

  // Trajectories with Oct 3-5 Autumn Edit launch peak (reproduced from screenshots)
  const salesTrend = [
    4200, 3900, 4300, 4800, 5200, 4900, 4400, 4600, 4800, 5300, 5800, 6900, 8800, 8400, 6200, 5100,
    5400, 5900, 6800, 6400, 5600, 5800, 6200, 6100, 5700, 5900, 6300, 6100, 5900, 5867,
  ];

  const ordersTrend = [
    52, 48, 55, 60, 65, 61, 56, 58, 62, 67, 73, 86, 112, 106, 78, 65, 68, 74, 86, 81, 71, 73, 78,
    77, 72, 74, 79, 77, 74, 72,
  ];

  const aovTrend = [
    80.5, 81.2, 78.2, 80.0, 80.0, 80.3, 78.5, 79.3, 77.4, 79.1, 79.5, 80.2, 78.6, 79.2, 79.5, 78.5,
    79.4, 79.7, 79.1, 79.0, 78.9, 79.5, 79.5, 79.2, 79.2, 79.7, 79.7, 79.2, 85.0, 83.25,
  ];

  const cacTrend = [
    37.5, 38.2, 36.1, 35.4, 34.2, 35.0, 36.5, 37.0, 38.2, 36.0, 34.5, 32.1, 31.0, 31.5, 34.2, 36.5,
    37.1, 35.8, 33.2, 34.5, 36.8, 37.2, 35.4, 34.8, 35.2, 35.6, 34.9, 35.8, 36.5, 36.1,
  ];

  const roasTrend = [
    3.8, 3.7, 3.9, 4.1, 4.3, 4.2, 4.0, 3.9, 3.8, 4.1, 4.3, 4.7, 4.9, 4.8, 4.4, 4.1, 4.0, 4.2, 4.5,
    4.4, 4.1, 4.1, 4.3, 4.4, 4.3, 4.3, 4.4, 4.3, 4.2, 4.33,
  ];

  const sessionsTrend = [
    2400, 2300, 2500, 2700, 2900, 2800, 2600, 2700, 2800, 3100, 3400, 4100, 4800, 4600, 3600, 3100,
    3200, 3400, 3900, 3700, 3300, 3350, 3550, 3500, 3300, 3400, 3600, 3500, 3400, 3167,
  ];

  const cvrTrend = [
    2.16, 2.08, 2.2, 2.22, 2.24, 2.18, 2.15, 2.15, 2.21, 2.16, 2.15, 2.1, 2.33, 2.3, 2.17, 2.1,
    2.13, 2.18, 2.21, 2.19, 2.15, 2.18, 2.2, 2.2, 2.18, 2.18, 2.19, 2.2, 2.18, 2.25,
  ];

  const returnLossTrend = [
    1100, 1050, 1150, 1200, 1300, 1250, 1150, 1200, 1250, 1350, 1500, 1800, 2200, 2600, 2400, 2100,
    1900, 1800, 2100, 1950, 1750, 1700, 1850, 1800, 1650, 1700, 1800, 1750, 1650, 1600,
  ];

  return (
    <div className="space-y-4 pb-12 font-sans text-slate-800">
      {/* =========================================================================
          1. HEADER & FILTER BAR (from dashboard1.jpeg)
          ========================================================================= */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
          Daily overview
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-normal max-w-4xl">
          One screen for sales, spend and customers. Revenue comes from the Shopify order ledger,
          not from summing platform claims.
        </p>

        {/* Filter Bar Row matching dashboard1.jpeg */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs">
          {/* Quick presets segmented button group */}
          <div className="inline-flex rounded-md border border-slate-200/90 overflow-hidden shadow-2xs font-normal">
            <button
              onClick={() => setActivePreset('7d')}
              className={`px-3 py-1.5 transition-colors ${
                activePreset === '7d'
                  ? 'bg-[#133d34] text-white font-medium'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => setActivePreset('30d')}
              className={`px-3 py-1.5 transition-colors border-l border-slate-200 ${
                activePreset === '30d'
                  ? 'bg-[#133d34] text-white font-medium'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Last 30 days
            </button>
            <button
              onClick={() => setActivePreset('mtd')}
              className={`px-3 py-1.5 transition-colors border-l border-slate-200 ${
                activePreset === 'mtd'
                  ? 'bg-[#133d34] text-white font-medium'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Month to date
            </button>
          </div>

          {/* Date range picker badge */}
          <div className="px-3 py-1.5 bg-white border border-slate-200/90 rounded-md text-slate-700 text-xs font-normal shadow-2xs">
            Sep 21 – Oct 20, 2026
          </div>

          {/* Compare dropdown */}
          <div className="relative">
            <select
              value={comparePeriod}
              onChange={(e) => setComparePeriod(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-md pl-3 pr-7 py-1.5 text-xs text-slate-700 font-normal cursor-pointer shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
            >
              <option value="previous">Compare: previous period</option>
              <option value="last_year">Compare: same period last year</option>
              <option value="target">Compare: monthly target</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Channels dropdown */}
          <div className="relative">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-md pl-3 pr-7 py-1.5 text-xs text-slate-700 font-normal cursor-pointer shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
            >
              <option value="all">All channels</option>
              <option value="online_store">Online Store (Shopify)</option>
              <option value="meta">Meta Ads</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* View mode toggle */}
          <div className="inline-flex rounded-md border border-slate-200/90 overflow-hidden shadow-2xs font-normal">
            <button
              onClick={() => setViewMode('expert')}
              className={`px-3 py-1.5 transition-colors ${
                viewMode === 'expert'
                  ? 'bg-[#133d34] text-white font-medium'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Expert view
            </button>
            <button
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1.5 transition-colors border-l border-slate-200 ${
                viewMode === 'summary'
                  ? 'bg-[#133d34] text-white font-medium'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Summary view
            </button>
          </div>
        </div>

        {/* Sector benchmarks line */}
        <div className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
          <span>Sector benchmarks:</span>
          <strong className="font-semibold text-slate-900">Apparel & Accessories</strong>
          <a
            href="#sector"
            className="text-slate-800 font-medium underline underline-offset-2 ml-1 cursor-pointer hover:text-emerald-950"
          >
            Change sector
          </a>
        </div>
      </div>

      {/* =========================================================================
          2. 8 KPI CARDS GRID (from image11.png)
          Row 1: 6 cards across. Row 2: 2 cards across under columns 1 & 2.
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Sales */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Your company total sales</span>
              <HelpTooltip text="Gross sales minus returns and discounts, Shopify ledger" />
            </div>
            <div className="text-[24px] font-bold text-slate-900 tracking-tight leading-none mt-1">
              ${summary.totalSales.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-2">
              <span className="text-[10px]">↑</span>
              <span>12.4%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2">
            <div className="flex-1 bg-slate-100 h-[3px] rounded-full overflow-hidden">
              <div className="bg-[#133d34] h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <span className="text-[11px] font-bold text-slate-800 font-mono">
              {summary.salesProgress}%
            </span>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Your company orders</span>
              <HelpTooltip text="Total fulfilled or paid orders across all channels" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                {summary.orders.toLocaleString()}
              </span>
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="text-[10px]">↑</span>
                <span>9.8%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2">
            <div className="flex-1 bg-slate-100 h-[3px] rounded-full overflow-hidden">
              <div className="bg-[#133d34] h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <span className="text-[11px] font-bold text-slate-800 font-mono">
              {summary.ordersProgress}%
            </span>
          </div>
        </div>

        {/* Card 3: AOV */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Your company AOV</span>
              <HelpTooltip text="Average order value net of discounts" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                ${summary.aov.toFixed(2)}
              </span>
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="text-[10px]">↑</span>
                <span>2.4%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#133d34] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-[11px] font-bold text-slate-800 font-mono">
                {summary.aovProgress}%
              </span>
            </div>
            <div className="text-[10px] text-slate-600 mt-2 flex flex-col leading-tight">
              <div className="flex items-center gap-1 font-medium text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Above sector</span>
              </div>
              <div className="text-slate-400 text-[10px] mt-0.5">Sector $82.50 · context only</div>
            </div>
          </div>
        </div>

        {/* Card 4: CAC */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Your company CAC</span>
              <span className="text-amber-500 text-xs">★</span>
              <HelpTooltip text="Blended acquisition cost per new acquired customer" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                ${summary.cac.toFixed(2)}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[10px]">↑</span>
                <span>2.0%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#133d34] h-full rounded-full" style={{ width: '97%' }} />
              </div>
              <span className="text-[11px] font-bold text-slate-800 font-mono">
                {summary.cacProgress}%
              </span>
            </div>
            <div className="text-[10px] text-slate-600 mt-2 flex items-center gap-1 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span className="font-medium text-slate-700">Below market</span>
              <span className="text-slate-400 ml-0.5">Sector $34.03</span>
            </div>
          </div>
        </div>

        {/* Card 5: ROAS */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Your company ROAS</span>
              <span className="text-amber-500 text-xs">★</span>
              <HelpTooltip text="Blended store return on ad spend" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                {summary.roas.toFixed(2)}x
              </span>
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="text-[10px]">↑</span>
                <span>6.0%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#133d34] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-[11px] font-bold text-slate-800 font-mono">
                {summary.roasProgress}%
              </span>
            </div>
            <div className="text-[10px] text-slate-600 mt-2 flex items-center gap-1 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700">On track</span>
              <span className="text-slate-400 ml-0.5">Sector 3.95x</span>
            </div>
          </div>
        </div>

        {/* Card 6: Sessions */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Sessions</span>
              <HelpTooltip text="Unique online storefront sessions from GA4" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                {summary.sessions.toLocaleString()}
              </span>
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="text-[10px]">↑</span>
                <span>7.9%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2">
            <div className="flex-1 bg-slate-100 h-[3px] rounded-full overflow-hidden">
              <div className="bg-[#133d34] h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <span className="text-[11px] font-bold text-slate-800 font-mono">
              {summary.sessionsProgress}%
            </span>
          </div>
        </div>

        {/* Card 7 (Row 2, Column 1): Conversion rate */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Conversion rate</span>
              <HelpTooltip text="Sessions to paid order conversion rate" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                {summary.cvr.toFixed(2)}%
              </span>
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="text-[10px]">↑</span>
                <span>1.8%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 h-[3px] rounded-full overflow-hidden">
                <div className="bg-[#133d34] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-[11px] font-bold text-slate-800 font-mono">
                {summary.cvrProgress}%
              </span>
            </div>
            <div className="text-[10px] text-slate-600 mt-2 flex items-center gap-1 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700">On track</span>
              <span className="text-slate-400 ml-0.5">Sector 2.02%</span>
            </div>
          </div>
        </div>

        {/* Card 8 (Row 2, Column 2): Return Loss */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[148px]">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-normal mb-1">
              <span>Your company return loss</span>
              <span className="text-amber-500 text-xs">★</span>
              <HelpTooltip text="Gross value of refunded and returned items" />
            </div>
            <div className="text-[24px] font-bold text-slate-900 tracking-tight leading-none mt-1">
              ${summary.returnLoss.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-[10px]">↑</span>
              <span>{summary.returnLossDelta}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-600 mt-2 flex flex-col leading-tight">
            <div className="flex items-center gap-1 font-medium text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Return rate 21.8%, better than norm</span>
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5 flex items-center gap-1">
              <span>Apparel typically 24–30%</span>
              <span className="text-xs">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. RETURNS SECTION (from image16.png)
          ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
              Returns: what you lose when customers send things back
            </h2>
            <span className="text-amber-500 text-xs">★</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Sep 21 – Oct 20, 2026 · All channels
          </span>
        </div>

        {/* 2-Column Split: Left Metrics & Right Products Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Metric 1: Return loss */}
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium mb-1">
                <span>Return loss</span>
                <span className="text-amber-500 text-xs">★</span>
                <HelpTooltip text="Total refunded value in current selected period" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  $47,780
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>+3.1%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Total refunded in the period: what returns take out of your top line.
              </p>
            </div>

            {/* Metric 2: Return rate */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium mb-1">
                <span>Return rate</span>
                <span className="text-amber-500 text-xs">★</span>
                <HelpTooltip text="Refunded orders divided by total orders placed" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">21.8%</span>
                <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-700">
                  <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                  <span>0.5 pts</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                Refunded orders ÷ orders. Typical: ecommerce about 19.3%, all retail 15.8%, apparel
                24–30%+.
              </p>
            </div>

            {/* Metric 3: Return leakage */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium mb-1">
                <span>Return leakage</span>
                <span className="text-amber-500 text-xs">★</span>
                <HelpTooltip text="Refunds as a percentage of total gross sales" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">20.6%</span>
                <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-700">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  <span>1.4 pts</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                Refunds as a share of gross sales: how much of your top line never becomes money.
              </p>
            </div>

            {/* Gross sales calculation box */}
            <div className="bg-slate-50/80 border border-slate-200/70 rounded-lg p-3 text-[11px] text-slate-700 font-mono leading-relaxed">
              Gross sales $232,100 – refunds $47,780 = net sales $184,320. Every money metric on
              this dashboard uses net sales.
            </div>

            {/* V2 Needs COGS callout box */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 leading-normal">
              <span className="inline-block bg-slate-100 text-slate-800 font-mono font-bold px-1.5 py-0.5 rounded text-[10px] mr-1.5 border border-slate-200">
                V2 · needs COGS
              </span>
              <strong className="text-slate-900">True cost per return.</strong> The refund plus
              round-trip shipping, restocking and unsellable items, usually far above the refund
              itself. Unlocks once cost per item is filled on every product.
            </div>

            {/* Sources footnote */}
            <p className="text-[10px] text-slate-400 leading-normal">
              Typical return rates: ecommerce about 19.3% of online sales, all retail 15.8%, apparel
              24–30% or more, electronics 8–15%, beauty 4–12%. Sources:{' '}
              <span className="underline cursor-pointer">3PL Insider</span>,{' '}
              <span className="underline cursor-pointer">Richpanel</span>.
            </p>
          </div>

          {/* Right Column (7 cols): Top Five Products by Return Loss Table */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
                <span>Top five products by return loss</span>
                <span className="text-amber-500 text-xs">★</span>
                <HelpTooltip text="Ranked by dollar return loss impact" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-normal text-[11px]">
                      <th className="py-2 pr-3 font-normal">Product</th>
                      <th className="py-2 px-2 text-right font-normal">Return loss</th>
                      <th className="py-2 px-2 text-right font-normal">Share</th>
                      <th className="py-2 px-2 text-right font-normal">Return rate</th>
                      <th className="py-2 pl-3 font-normal">Top reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topReturnProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 pr-3 font-semibold text-slate-900">
                          {prod.id}. {prod.name}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Proportional dark green bar directly from screenshot */}
                            <div
                              className="bg-[#133d34] h-1.5 rounded-full"
                              style={{ width: `${prod.barWidth}px` }}
                            />
                            <span>{prod.loss}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-600">
                          {prod.share}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                          {prod.returnRate}
                        </td>
                        <td className="py-2.5 pl-3 text-slate-600 text-[11px]">{prod.topReason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-4 mt-4 border-t border-slate-100">
              The top five account for 70% of return loss. Product split follows your date range and
              channel filter.
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. 30-DAY TRENDS SECTION (from image16.png and image17.png)
          Row 1: 5 cards across. Row 2: 3 cards across.
          ========================================================================= */}
      <div>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">30-day trends</h2>
          <span className="text-[11px] text-slate-500 font-sans">
            Sep 21 – Oct 20 · follows the channel filter · Oct 3-5 = Autumn Edit launch
          </span>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Sales */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Your company total sales</span>
                <HelpTooltip text="30-day daily sales trajectory" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">$184,320</strong>
              </div>
            </div>
            <EChart option={generateTrendOption(salesTrend, 5867, true, true)} height="85px" />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              Dashed line: daily target $5,867
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Your company orders</span>
                <HelpTooltip text="30-day daily order volume" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">2,214</strong>
              </div>
            </div>
            <EChart option={generateTrendOption(ordersTrend, 72, true, false)} height="85px" />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              Dashed line: daily target 72
            </div>
          </div>

          {/* Card 3: AOV */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Your company AOV</span>
                <HelpTooltip text="30-day average order value" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">$83.25</strong>
              </div>
            </div>
            <EChart option={generateTrendOption(aovTrend, 82.0, false, true)} height="85px" />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              Dashed line: daily target $82.00
            </div>
          </div>

          {/* Card 4: CAC */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Your company CAC</span>
                <span className="text-amber-500 text-xs">★</span>
                <HelpTooltip text="30-day blended acquisition cost" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">$36.10</strong>
              </div>
            </div>
            <EChart option={generateTrendOption(cacTrend, 35.0, false, true)} height="85px" />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              Dashed line: daily target $35.00
            </div>
          </div>

          {/* Card 5: ROAS */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Your company ROAS</span>
                <span className="text-amber-500 text-xs">★</span>
                <HelpTooltip text="30-day store return on ad spend" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">4.33x</strong>
              </div>
            </div>
            <EChart option={generateTrendOption(roasTrend, 4.0, false, false, 'x')} height="85px" />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              Dashed line: daily target 4.00x
            </div>
          </div>

          {/* Card 6 (Row 2, Column 1): Sessions */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Sessions</span>
                <HelpTooltip text="30-day web traffic volume" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">98,400</strong>
              </div>
            </div>
            <EChart option={generateTrendOption(sessionsTrend, 3167, true, false)} height="85px" />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              Dashed line: daily target 3,167
            </div>
          </div>

          {/* Card 7 (Row 2, Column 2): Conversion rate */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Conversion rate</span>
                <HelpTooltip text="30-day conversion rate" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">2.25%</strong>
              </div>
            </div>
            <EChart option={generateTrendOption(cvrTrend, 2.2, false, false, '%')} height="85px" />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              Dashed line: daily target 2.20%
            </div>
          </div>

          {/* Card 8 (Row 2, Column 3): Return loss */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-[11px]">
                <span>Your company return loss</span>
                <span className="text-amber-500 text-xs">★</span>
                <HelpTooltip text="30-day returned merchandise value" />
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                30-day: <strong className="text-slate-900 font-bold">$47,780</strong>
              </div>
            </div>
            <EChart
              option={generateTrendOption(returnLossTrend, undefined, true, true)}
              height="85px"
            />
            <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
              No daily target on a single-channel view
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
