import React from 'react';
import { KpiCards } from './KpiCards';
import { TrendLineChart } from './TrendLineChart';
import { ProductBreakdownChart } from './ProductBreakdownChart';
import { useDashboardOverview } from '../../api/queries';
import type { TimeRange } from '../../types';

interface OverviewViewProps {
  timeRange: TimeRange;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ timeRange }) => {
  const { data, isLoading } = useDashboardOverview(timeRange);

  return (
    <div className="space-y-6">
      <KpiCards summary={data?.summary} isLoading={isLoading} />
      <TrendLineChart trends={data?.trends} isLoading={isLoading} />
      <ProductBreakdownChart
        productBreakdown={data?.productBreakdown}
        topProducts={data?.topProducts}
        isLoading={isLoading}
      />
    </div>
  );
};
