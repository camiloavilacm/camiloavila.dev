import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TargetRow {
  metric: string;
  monthTarget: string;
  proratedToday: string;
  actual: string;
  progressPct: number;
  status: 'on_pace' | 'behind';
  behindPts?: number;
  isRatio?: boolean;
}

export const TargetsPaceView: React.FC = () => {
  const [viewTab, setViewTab] = useState<'table' | 'monday'>('table');

  // Realistic target rows exactly matching docx Screen 5
  const targets: TargetRow[] = [
    {
      metric: 'Total sales',
      monthTarget: '$185,000',
      proratedToday: '$119,355',
      actual: '$123,128',
      progressPct: 103,
      status: 'on_pace',
    },
    {
      metric: 'Orders',
      monthTarget: '2,300',
      proratedToday: '1,484',
      actual: '1,466',
      progressPct: 99,
      status: 'on_pace',
    },
    {
      metric: 'Sessions',
      monthTarget: '105,000',
      proratedToday: '67,742',
      actual: '65,436',
      progressPct: 97,
      status: 'on_pace',
    },
    {
      metric: 'New customers',
      monthTarget: '1,400',
      proratedToday: '903',
      actual: '778',
      progressPct: 86,
      status: 'behind',
      behindPts: 14,
    },
    {
      metric: 'AOV',
      monthTarget: '$85.00',
      proratedToday: '$85.00',
      actual: '$84.01',
      progressPct: 99,
      status: 'on_pace',
      isRatio: true,
    },
    {
      metric: 'Your company CAC',
      monthTarget: '$34.00',
      proratedToday: '$34.00',
      actual: '$36.76',
      progressPct: 92,
      status: 'on_pace',
      isRatio: true,
    },
    {
      metric: 'Your company ROAS',
      monthTarget: '4.50x',
      proratedToday: '4.50x',
      actual: '4.31x',
      progressPct: 96,
      status: 'on_pace',
      isRatio: true,
    },
    {
      metric: 'Conversion rate',
      monthTarget: '2.40%',
      proratedToday: '2.40%',
      actual: '2.24%',
      progressPct: 93,
      status: 'on_pace',
      isRatio: true,
    },
    {
      metric: 'POAS (stretch)',
      monthTarget: '2.80x',
      proratedToday: '2.80x',
      actual: '2.41x',
      progressPct: 86,
      status: 'behind',
      behindPts: 14,
      isRatio: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
        Are we on pace to hit the month? Prorated targets turn numbers into decisions.
      </p>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setViewTab('table')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewTab === 'table'
                ? 'bg-[#143d34] text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pace table
          </button>
          <button
            onClick={() => setViewTab('monday')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewTab === 'monday'
                ? 'bg-[#143d34] text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monday snapshot
          </button>
        </div>
      </div>

      {viewTab === 'table' ? (
        /* October 2026 Targets Table (from Screen 5) */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">October 2026 targets</h3>
              <span className="text-amber-500">★</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Day 20 of 31 · prorated at 64.5%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 pr-4">Metric</th>
                  <th className="py-2.5 px-3">Month target</th>
                  <th className="py-2.5 px-3">
                    Prorated today <span className="text-amber-500">★</span>
                  </th>
                  <th className="py-2.5 px-3">Actual</th>
                  <th className="py-2.5 px-3">
                    Progress <span className="text-amber-500">★</span>
                  </th>
                  <th className="py-2.5 pl-3">Pace status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {targets.map((row) => (
                  <tr key={row.metric} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{row.metric}</span>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">{row.monthTarget}</td>
                    <td className="py-3 px-3 font-mono text-slate-800">{row.proratedToday}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.actual}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.status === 'on_pace' ? 'bg-[#143d34]' : 'bg-amber-600'
                            }`}
                            style={{ width: `${Math.min(row.progressPct, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono font-semibold text-slate-800 w-10">
                          {row.progressPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pl-3 font-mono text-xs">
                      {row.status === 'on_pace' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          On pace
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Behind by {row.behindPts} pts
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            On pace = at least 90% of the prorated target. Behind = 10 or more points short. Cost
            metrics (CAC) are scored in reverse. Ratio targets apply as-is each day.
          </div>
        </div>
      ) : (
        /* Monday Snapshot View */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monday Executive Briefing & Pacing Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Weekly cadence summary, pacing delta vs last week, and projected month-end close
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              Week 42 · Snapshot generated Monday 06:00
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider font-mono">
                Revenue Trajectory
              </span>
              <div className="text-2xl font-bold text-emerald-950">$123,128</div>
              <p className="text-xs text-emerald-800">
                Projected month-end: <b>$190,800</b> (+3.1% vs $185k target). Core drivers: Strong
                Autumn Edit AOV ($84.01).
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider font-mono">
                Customer Acquisition Pacing
              </span>
              <div className="text-2xl font-bold text-amber-950">778 New Cust.</div>
              <p className="text-xs text-amber-800">
                Projected month-end: <b>1,205</b> (-14% vs 1,400 target). Ad CPA elevated on TikTok
                broad prospecting ($43.75).
              </p>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider font-mono">
                Blended ROAS & POAS
              </span>
              <div className="text-2xl font-bold text-blue-950">4.31x ROAS</div>
              <p className="text-xs text-blue-800">
                Meta Retargeting (5.20x) and Brand Search (7.00x) maintaining health; POAS at 2.41x
                vs 2.80x stretch.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
