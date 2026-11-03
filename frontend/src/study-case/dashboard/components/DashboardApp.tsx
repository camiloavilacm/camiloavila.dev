import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { DailyOverviewView } from './overview/DailyOverviewView';
import { SpendCampaignsView } from './spend/SpendCampaignsView';
import { CustomersView } from './customers/CustomersView';
import { CohortsView } from './cohorts/CohortsView';
import { TargetsPaceView } from './targets/TargetsPaceView';
import { IndustrySnapshotView } from './industry/IndustrySnapshotView';
import { CompetitorPricesView } from './competitors/CompetitorPricesView';
import { useHealthCheck } from '../api/queries';
import type { DashboardTab, TimeRange } from '../types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const DashboardInner: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [brandName, setBrandName] = useState<'Alder & Thread' | 'Carolina Smith'>('Alder & Thread');
  const [channel, setChannel] = useState('all');
  const [comparePeriod, setComparePeriod] = useState('previous');
  const [viewMode, setViewMode] = useState<'expert' | 'summary'>('expert');

  const qc = useQueryClient();
  const { data: health, isError: isHealthError, isLoading: isHealthLoading } = useHealthCheck();

  const handleRefresh = useCallback(() => {
    qc.invalidateQueries();
  }, [qc]);

  const toggleBrand = useCallback(() => {
    setBrandName((prev) => (prev === 'Alder & Thread' ? 'Carolina Smith' : 'Alder & Thread'));
  }, []);

  // Gather isFetching state across all active queries
  const isFetching = qc.isFetching() > 0;
  const isOffline = !isHealthLoading && (isHealthError || health?.status !== 'ok');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#18181b] font-sans antialiased text-slate-800">
      {/* Top Black Application Navigation Bar (from dashboard1.jpeg) */}
      <header className="h-8 bg-[#18181b] text-white flex items-center justify-between px-3 text-xs shrink-0 select-none border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-normal text-[11px]"
            title="Back to Landing"
          >
            <span className="text-sm leading-none">‹</span>
            <span>Alder & Thread — Dashboard</span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center border border-zinc-700 rounded text-[10px] text-zinc-300 overflow-hidden">
            <button className="px-2 py-0.5 hover:bg-zinc-800 transition-colors">Fill</button>
            <button className="px-2 py-0.5 hover:bg-zinc-800 transition-colors border-l border-zinc-700 bg-zinc-800/60 font-medium text-white">
              Fit
            </button>
          </div>
        </div>
      </header>

      {/* Main App Canvas */}
      <div className="flex flex-1 overflow-hidden bg-[#f4f5f7]">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          brandName={brandName}
          onToggleBrand={toggleBrand}
        />

        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          <Header
            currentTab={currentTab}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onRefresh={handleRefresh}
            isFetching={isFetching}
            brandName={brandName}
            channel={channel}
            onChannelChange={setChannel}
            comparePeriod={comparePeriod}
            onComparePeriodChange={setComparePeriod}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <main className="flex-1 px-8 py-3 overflow-y-auto">
            {isOffline && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 shadow-xs">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-amber-950">Analytics API Server Offline</div>
                    <div className="text-amber-800 text-[11px] mt-0.5">
                      Fastify backend at{' '}
                      <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">
                        http://localhost:4000
                      </code>{' '}
                      is currently unreachable. Start it with{' '}
                      <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-semibold">
                        npm run server
                      </code>
                      .
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Screen 1: Daily overview */}
            {currentTab === 'overview' && <DailyOverviewView timeRange={timeRange} />}

            {/* Screen 2: Spend & campaigns */}
            {currentTab === 'spend' && <SpendCampaignsView timeRange={timeRange} />}

            {/* Screen 3: Customers */}
            {currentTab === 'customers' && <CustomersView />}

            {/* Screen 4: Cohorts */}
            {currentTab === 'cohorts' && <CohortsView />}

            {/* Screen 5: Targets & pace */}
            {currentTab === 'targets' && <TargetsPaceView />}

            {/* Screen 6: Industry snapshot */}
            {currentTab === 'industry' && <IndustrySnapshotView />}

            {/* Screen 7: Competitor prices & AI visibility */}
            {currentTab === 'competitor-prices' && <CompetitorPricesView />}
          </main>

          {/* Clean Footer Bar */}
          <footer className="px-6 py-2.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Alder & Thread / Carolina Smith Analytics Engine</span>
              <span>•</span>
              <span>Fastify v5 + Drizzle ORM + PostgreSQL</span>
            </div>
            <span>Refreshed daily, 06:00 · 6,045 orders · 2,600 customers</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export const DashboardApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardInner />
    </QueryClientProvider>
  );
};
