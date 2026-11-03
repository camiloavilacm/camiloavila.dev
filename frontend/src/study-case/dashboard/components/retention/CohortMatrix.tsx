import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { CohortItem } from '../../types';

interface CohortMatrixProps {
  cohorts?: CohortItem[];
  isLoading?: boolean;
}

export const CohortMatrix: React.FC<CohortMatrixProps> = ({ cohorts = [], isLoading = false }) => {
  // Get maximum period index present
  const maxPeriods = 6; // Month 0 to Month 5

  const getHeatmapColor = (pct: number) => {
    if (pct >= 70) return 'bg-blue-600 text-white font-bold';
    if (pct >= 50) return 'bg-blue-500/80 text-white font-semibold';
    if (pct >= 30) return 'bg-blue-400/50 text-slate-900 font-medium';
    if (pct >= 15) return 'bg-blue-300/40 text-slate-800';
    if (pct > 0) return 'bg-blue-100 text-slate-700';
    return 'bg-slate-50 text-slate-400';
  };

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Customer Cohort Retention Matrix (Month 0 → Month 5)</CardTitle>
        <CardDescription>
          Tracking customer re-purchase activity across consecutive calendar months post-acquisition
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="bg-slate-50/80 border-y border-slate-200 text-slate-600 text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Cohort</th>
                <th className="py-2.5 px-3 font-semibold text-right">Size</th>
                <th className="py-2.5 px-3 font-semibold text-right">Repeat %</th>
                <th className="py-2.5 px-3 font-semibold text-right">Avg LTV</th>
                {[...Array(maxPeriods)].map((_, i) => (
                  <th key={i} className="py-2.5 px-2 font-semibold text-center w-16">
                    M+{i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Calculating cohort retention matrices...
                  </td>
                </tr>
              ) : (
                cohorts.map((c) => {
                  return (
                    <tr key={c.cohortMonth} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{c.cohortMonth}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {c.cohortSize.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-semibold text-blue-600">{c.repeatRatePct}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                        €{c.cumulativeLtv.toFixed(2)}
                      </td>

                      {[...Array(maxPeriods)].map((_, pIdx) => {
                        const periodData = c.retentionByPeriod.find((p) => p.periodIndex === pIdx);
                        const pct = periodData?.retentionRatePct || 0;
                        return (
                          <td key={pIdx} className="p-1 text-center">
                            {periodData ? (
                              <div
                                className={`py-1 rounded text-[11px] ${getHeatmapColor(pct)}`}
                                title={`M+${pIdx}: ${pct}% (${periodData.activeCustomers} customers, €${periodData.revenue})`}
                              >
                                {pct}%
                              </div>
                            ) : (
                              <div className="py-1 text-slate-300 text-[10px]">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
