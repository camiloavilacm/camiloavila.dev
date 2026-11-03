import { useQuery } from '@tanstack/react-query';
import { fetchJson } from './client';
import type {
  DashboardOverviewResponse,
  MarketingPerformanceResponse,
  CustomerCohortsResponse,
  AiSovResponse,
  AiEvaluationsResponse,
  BenchmarksResponse,
  TargetsPaceResponse,
  CompetitorPricesResponse,
  TimeRange,
} from '../types';

export function useDashboardOverview(
  range: TimeRange = '30d',
  startDate?: string,
  endDate?: string
) {
  return useQuery<DashboardOverviewResponse>({
    queryKey: ['dashboard', 'overview', range, startDate, endDate],
    queryFn: () =>
      fetchJson<DashboardOverviewResponse>('/api/v1/dashboard/overview', {
        range: startDate && endDate ? undefined : range,
        startDate,
        endDate,
      }),
    staleTime: 60 * 1000,
  });
}

export function useMarketingPerformance(startDate?: string, endDate?: string, platform?: string) {
  return useQuery<MarketingPerformanceResponse>({
    queryKey: ['marketing', 'performance', startDate, endDate, platform],
    queryFn: () =>
      fetchJson<MarketingPerformanceResponse>('/api/v1/marketing/performance', {
        startDate,
        endDate,
        platform: platform === 'all' ? undefined : platform,
      }),
    staleTime: 60 * 1000,
  });
}

export function useCustomerCohorts(months = 12) {
  return useQuery<CustomerCohortsResponse>({
    queryKey: ['analytics', 'cohorts', months],
    queryFn: () =>
      fetchJson<CustomerCohortsResponse>('/api/v1/analytics/cohorts', {
        months,
      }),
    staleTime: 120 * 1000,
  });
}

export function useAiSov(provider?: string, category?: string) {
  return useQuery<AiSovResponse>({
    queryKey: ['ai-analytics', 'share-of-voice', provider, category],
    queryFn: () =>
      fetchJson<AiSovResponse>('/api/v1/ai-analytics/share-of-voice', {
        provider: provider === 'all' ? undefined : provider,
        category,
      }),
    staleTime: 60 * 1000,
  });
}

export function useAiEvaluations(params?: {
  provider?: string;
  category?: string;
  ownBrandMentioned?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery<AiEvaluationsResponse>({
    queryKey: ['ai-analytics', 'evaluations', params],
    queryFn: () => fetchJson<AiEvaluationsResponse>('/api/v1/ai-analytics/evaluations', params),
    staleTime: 30 * 1000,
  });
}

export function useHealthCheck() {
  return useQuery<{ status: string; timestamp: string; database: string }>({
    queryKey: ['health'],
    queryFn: () => fetchJson<{ status: string; timestamp: string; database: string }>('/health'),
    retry: 1,
    refetchInterval: 30000,
  });
}

export function useBenchmarks(sector?: string) {
  return useQuery<BenchmarksResponse>({
    queryKey: ['analytics', 'benchmarks', sector],
    queryFn: () => fetchJson<BenchmarksResponse>('/api/v1/analytics/benchmarks', { sector }),
    staleTime: 120 * 1000,
  });
}

export function useTargetsPace(month?: string) {
  return useQuery<TargetsPaceResponse>({
    queryKey: ['targets', 'pace', month],
    queryFn: () => fetchJson<TargetsPaceResponse>('/api/v1/targets/pace', { month }),
    staleTime: 60 * 1000,
  });
}

export function useCompetitorPrices() {
  return useQuery<CompetitorPricesResponse>({
    queryKey: ['ai-analytics', 'competitor-prices'],
    queryFn: () => fetchJson<CompetitorPricesResponse>('/api/v1/ai-analytics/competitor-prices'),
    staleTime: 60 * 1000,
  });
}
