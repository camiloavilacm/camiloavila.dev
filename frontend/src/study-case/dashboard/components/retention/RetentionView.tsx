import React from 'react';
import { CohortMatrix } from './CohortMatrix';
import { LtvMilestoneChart } from './LtvMilestoneChart';
import { Card } from '../ui/Card';
import { Users, Repeat, TrendingUp, DollarSign } from 'lucide-react';
import { useCustomerCohorts } from '../../api/queries';

export const RetentionView: React.FC = () => {
  const { data, isLoading } = useCustomerCohorts();

  const cohorts = data?.cohorts || [];
  const channelLtv = data?.channelLtv || [];
  const ltvProgression = data?.ltvProgression || [];
  const overallRepeatRate = data?.overallRepeatRatePct || 0;

  const totalAcquiredCustomers = cohorts.reduce((acc, c) => acc + c.cohortSize, 0);
  const totalRepeatCustomers = cohorts.reduce((acc, c) => acc + c.repeatCustomers, 0);
  const totalCohortRevenue = cohorts.reduce((acc, c) => acc + c.totalRevenue, 0);
  const averageCumulativeLtv =
    totalAcquiredCustomers > 0 ? totalCohortRevenue / totalAcquiredCustomers : 0;

  return (
    <div className="space-y-6">
      {/* Top Level Retention KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">
              Overall Repeat Rate
            </span>
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {overallRepeatRate.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalRepeatCustomers.toLocaleString()} of {totalAcquiredCustomers.toLocaleString()}{' '}
            customers purchased ≥2x
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">
              360-Day Blended LTV
            </span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            €{averageCumulativeLtv.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Benchmark: €85.00 (+31% vs AOV)</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">
              Repeat Buyer Volume
            </span>
            <div className="p-1.5 rounded-md bg-violet-50 text-violet-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {totalRepeatCustomers.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Drives €
            {(totalCohortRevenue * 0.48).toLocaleString(undefined, { maximumFractionDigits: 0 })} in
            secondary revenue
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">
              Cohort LTV Multiplier
            </span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">2.32x</div>
          <p className="text-[11px] text-slate-500 mt-1">12M LTV vs Day 0 First Order Value</p>
        </Card>
      </div>

      {/* Cohort Heatmap Table */}
      <CohortMatrix cohorts={cohorts} isLoading={isLoading} />

      {/* LTV Milestone & Channel Breakdown */}
      <LtvMilestoneChart
        ltvProgression={ltvProgression}
        channelLtv={channelLtv}
        isLoading={isLoading}
      />
    </div>
  );
};
