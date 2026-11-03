import { useState } from 'react';
import { EChart } from '../ui/EChart';
import type { EChartsOption } from 'echarts';

interface CohortRow {
  month: string;
  customers: number;
  m0: number;
  m1: number | null;
  m2: number | null;
  m3: number | null;
}

export const CohortsView: React.FC = () => {
  const [metricMode, setMetricMode] = useState<'monthly' | 'cumulative'>('monthly');
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Cohort matrix data (from Screen 4)
  const cohorts: CohortRow[] = [
    { month: 'Jan 2026', customers: 640, m0: 6.1, m1: 9.8, m2: 7.4, m3: 6.2 },
    { month: 'Feb 2026', customers: 580, m0: 5.9, m1: 9.1, m2: 7.0, m3: 6.0 },
    { month: 'Mar 2026', customers: 720, m0: 6.4, m1: 10.2, m2: 7.9, m3: 6.5 },
    { month: 'Apr 2026', customers: 860, m0: 6.8, m1: 10.9, m2: 8.3, m3: 6.9 },
    { month: 'May 2026', customers: 940, m0: 7.0, m1: 11.4, m2: 8.8, m3: 7.2 },
    { month: 'Jun 2026', customers: 910, m0: 6.6, m1: 11.0, m2: 8.4, m3: 7.0 },
    { month: 'Jul 2026', customers: 1020, m0: 7.2, m1: 11.8, m2: 9.0, m3: null },
    { month: 'Aug 2026', customers: 1090, m0: 7.4, m1: 12.1, m2: null, m3: null },
    { month: 'Sep 2026', customers: 1150, m0: 7.5, m1: null, m2: null, m3: null },
  ];

  // Cell heatmap background style based on repeat rate
  const getCellBg = (val: number | null) => {
    if (val === null) return 'text-slate-400 bg-transparent';
    if (val >= 11.0) return 'bg-[#143d34]/40 font-bold text-slate-900';
    if (val >= 9.0) return 'bg-[#143d34]/25 font-semibold text-slate-900';
    if (val >= 7.0) return 'bg-[#143d34]/15 text-slate-800';
    return 'bg-[#143d34]/8 text-slate-700';
  };

  // Cumulative LTV chart option (from Screen 4 bottom)
  const ltvChartOption: EChartsOption = {
    grid: { left: 40, right: 30, top: 30, bottom: 30, containLabel: false },
    xAxis: {
      type: 'category',
      data: ['M0', 'M1', 'M2', 'M3'],
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      min: 70,
      max: 130,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        formatter: (val: number) => `$${val}`,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: <b>${c}</b>',
    },
    series: [
      {
        type: 'line',
        data: [85.54, 95.89, 103.83, 110.43],
        lineStyle: { color: '#143d34', width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#ffffff', borderColor: '#143d34', borderWidth: 2 },
        label: {
          show: true,
          position: 'top',
          color: '#0f172a',
          fontWeight: 'bold',
          fontSize: 11,
          formatter: '${c}',
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
        Month 0–3 repeat rates by acquisition month, built from the Shopify customer export.
      </p>

      {/* Cohorts Heatmap Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Repeat purchase by acquisition month
            </h3>
            <span className="text-amber-500">★</span>
          </div>

          {/* Toggle buttons */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setMetricMode('monthly')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                metricMode === 'monthly'
                  ? 'bg-[#143d34] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly repeat rate
            </button>
            <button
              onClick={() => setMetricMode('cumulative')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                metricMode === 'cumulative'
                  ? 'bg-[#143d34] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 pr-4">Acquired</th>
                <th className="py-2.5 px-4 text-right">Customers</th>
                <th className="py-2.5 px-4 text-center">Month 0</th>
                <th className="py-2.5 px-4 text-center">Month 1</th>
                <th className="py-2.5 px-4 text-center">Month 2</th>
                <th className="py-2.5 px-4 text-center">Month 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cohorts.map((c) => (
                <tr key={c.month} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-slate-900">{c.month}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                    {c.customers.toLocaleString()}
                  </td>
                  <td className={`py-2.5 px-4 text-center font-mono ${getCellBg(c.m0)}`}>
                    {c.m0.toFixed(1)}%
                  </td>
                  <td className={`py-2.5 px-4 text-center font-mono ${getCellBg(c.m1)}`}>
                    {c.m1 !== null ? `${c.m1.toFixed(1)}%` : '—'}
                  </td>
                  <td className={`py-2.5 px-4 text-center font-mono ${getCellBg(c.m2)}`}>
                    {c.m2 !== null ? `${c.m2.toFixed(1)}%` : '—'}
                  </td>
                  <td className={`py-2.5 px-4 text-center font-mono ${getCellBg(c.m3)}`}>
                    {c.m3 !== null ? `${c.m3.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Share of each cohort placing an order in that month after acquisition. "—" means the month
          has not finished yet. Source: Shopify customer export.
        </p>
      </div>

      {/* Cumulative LTV Approximation Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Cumulative LTV approximation</h3>
            <span className="text-amber-500">★</span>
          </div>
          <span className="text-xs text-slate-500">
            Average of the Jan–Jun 2026 cohorts, revenue per customer
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Chart Left Column */}
          <div className="lg:col-span-7">
            <EChart option={ltvChartOption} height="220px" />
          </div>

          {/* Context Right Column (Placeholder from Screenshot 4) */}
          <div className="lg:col-span-5 h-48 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-6 text-center text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">
                Months 4–11 and 180-day LTV: needs a tool
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Full-cohort predictive modeling unlocks with connected warehouse ingestion
                (Snowflake / BigQuery).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner (from Screen 4) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-slate-900">
            Need Month 0–11 or product-level cohorts?
          </span>
          <p className="text-slate-500 text-[11px] mt-0.5">
            These are outside v1. We flag them instead of faking them.
          </p>
        </div>
        <button
          onClick={() => setShowOptionsModal(true)}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium text-slate-800 transition-colors shadow-2xs shrink-0"
        >
          What are my options?
        </button>
      </div>

      {/* Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 border border-slate-200">
            <h4 className="text-base font-bold text-slate-900">
              Advanced Cohort Analytics Options
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">
                  Option 1: PostgreSQL Direct Ingestion
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Utilize our existing Fastify + Drizzle backend connected to PostgreSQL to stream
                  full 12-month cohort matrices.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">
                  Option 2: BigQuery Warehouse Sync
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Automated sync with Shopify via Google Cloud Storage to model repeat purchase
                  decay curves.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowOptionsModal(false)}
                className="px-4 py-2 bg-[#143d34] text-white rounded-lg text-xs font-semibold hover:bg-[#0f2e27]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
