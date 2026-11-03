export type DashboardTab =
  | 'overview'
  | 'spend'
  | 'customers'
  | 'cohorts'
  | 'targets'
  | 'industry'
  | 'competitor-prices';

export type TimeRange = '7d' | '30d' | 'mtd' | '90d' | 'summer' | 'black_week' | '12m' | 'all';

export interface DashboardOverviewResponse {
  period: {
    startDate: string;
    endDate: string;
    range: string;
  };
  summary: {
    totalRevenue: number;
    grossRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    newCustomers: number;
    averageOrderValue: number;
    totalMarketingSpend: number;
    blendedRoas: number;
    blendedCac: number;
    totalRefunded: number;
    refundRatePct: number;
    totalUnitsSold: number;
    avgUnitsPerOrder: number;
  };
  trends: Array<{
    date: string;
    netRevenue: number;
    grossRevenue: number;
    orders: number;
    marketingSpend: number;
    aov: number;
    roas: number;
    conversions?: number;
  }>;
  productBreakdown: Array<{
    productType: string;
    audience: string;
    ordersCount: number;
    unitsSold: number;
    revenueEur: number;
    returnRatePct: number;
  }>;
  topProducts: Array<{
    productId: number;
    name: string;
    handle: string;
    priceEur: number;
    unitsSold: number;
    revenueEur: number;
    returnRatePct: number;
  }>;
}

export interface PlatformMetric {
  platform: 'meta' | 'google' | 'tiktok';
  spend: number;
  spendSharePct: number;
  impressions: number;
  clicks: number;
  ctrPct: number;
  cpcEur: number;
  conversions: number;
  cvrPct: number;
  cpaEur: number;
  attributedRevenue: number;
  attributedRoas: number;
  campaignCount: number;
}

export interface CampaignMetric {
  campaignName: string;
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctrPct: number;
  conversions: number;
  cvrPct: number;
  cpaEur: number;
  attributedRevenue: number;
  attributedRoas: number;
}

export interface SalesChannelMetric {
  channel: string;
  orders: number;
  netRevenue: number;
  aov: number;
  revenueSharePct: number;
}

export interface MarketingPerformanceResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    totalAttributedRevenue: number;
    blendedCtrPct: number;
    blendedCpcEur: number;
    blendedCvrPct: number;
    blendedCpaEur: number;
    attributedRoas: number;
    storeNetRevenue: number;
    blendedStoreRoas: number;
  };
  platformBreakdown: PlatformMetric[];
  campaigns: CampaignMetric[];
  salesChannelComparison: SalesChannelMetric[];
}

export interface CohortItem {
  cohortMonth: string;
  cohortSize: number;
  repeatCustomers: number;
  repeatRatePct: number;
  totalRevenue: number;
  cumulativeLtv: number;
  retentionByPeriod: Array<{
    periodIndex: number;
    activeCustomers: number;
    retentionRatePct: number;
    revenue: number;
  }>;
}

export interface ChannelLtvItem {
  acquisitionSource: string;
  customersCount: number;
  repeatCustomers: number;
  repeatRatePct: number;
  totalRevenue: number;
  averageLtv: number;
}

export interface LtvProgressionItem {
  milestoneDays: number;
  cumulativeRevenue: number;
  averageLtv: number;
}

export interface CustomerCohortsResponse {
  overallRepeatRatePct: number;
  cohorts: CohortItem[];
  channelLtv: ChannelLtvItem[];
  ltvProgression: LtvProgressionItem[];
}

export interface BrandLeaderboardItem {
  brandId: number;
  brandName: string;
  domain: string;
  isOwnBrand: boolean;
  totalMentions: number;
  mentionRatePct: number;
  shareOfVoicePct: number;
  avgRank: number;
  avgSentimentScore: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface AiSovResponse {
  overallSummary: {
    totalEvaluations: number;
    carolinaSmithSovPct: number;
    carolinaSmithMentionRatePct: number;
    carolinaSmithAvgRank: number;
    topCompetitor: string;
  };
  brandLeaderboard: BrandLeaderboardItem[];
  providerComparison: Array<{
    provider: string;
    model: string;
    evalCount: number;
    carolinaSmithSovPct: number;
    mentionRatePct: number;
    avgRank: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    evalCount: number;
    carolinaSmithSovPct: number;
    mentionRatePct: number;
    avgRank: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    avgSovPct: number;
    mentionRatePct: number;
    avgRank: number;
  }>;
}

export interface EvaluationItem {
  evaluationId: number;
  runId: string;
  evaluatedAt: string;
  provider: string;
  model: string;
  promptCategory: string;
  promptText: string;
  locale: string;
  ownBrandMentioned: boolean;
  ownBrandRank: number | null;
  shareOfVoicePct: number;
  rawResponse: string;
  citations: Array<{ url: string; domain: string; brand_id: number }>;
  fanOut: string[];
  brandMentions: Array<{
    brand_id: number;
    brand: string;
    mentioned: boolean;
    rank?: number | null;
    sentiment?: string | null;
    sentiment_score?: number | null;
  }>;
  latencyMs: number;
  tokenUsage: { input: number; output: number };
}

export interface AiEvaluationsResponse {
  total: number;
  limit: number;
  offset: number;
  evaluations: EvaluationItem[];
  topCitationDomains: Array<{
    domain: string;
    citationCount: number;
    isOwnDomain: boolean;
  }>;
}

export interface BenchmarkItem {
  metricKey: string;
  metricLabel: string;
  sourceTag?: string;
  you: string;
  sector: string;
  gap: string;
  status: 'On track' | 'Below market' | 'Above sector' | string;
  howToRead: string;
}

export interface IndustryReferenceItem {
  industry: string;
  cvr: string;
  roas: string;
  cac: string;
  aov: string;
  atcRate: string;
  cartToPurchase: string;
}

export interface BenchmarksResponse {
  currentSector: string;
  scoredMetricsOnTrack: number;
  totalScoredMetrics: number;
  ltvCacRatio: string;
  benchmarks: BenchmarkItem[];
  industryReferenceTable: IndustryReferenceItem[];
}

export interface TargetsPaceResponse {
  currentMonthPace: {
    periodMonth: string;
    seasonLabel: string;
    daysInMonth: number;
    daysElapsed: number;
    elapsedPct: number;
    revenue: {
      targetEur: number;
      actualEur: number;
      proratedTargetEur: number;
      pacePct: number;
      achievementPct: number;
      projectedEur: number;
      status: string;
    };
    orders: {
      target: number;
      actual: number;
      proratedTarget: number;
      pacePct: number;
      achievementPct: number;
      projected: number;
      status: string;
    };
    newCustomers: {
      target: number;
      actual: number;
      proratedTarget: number;
      pacePct: number;
      achievementPct: number;
      projected: number;
      status: string;
    };
    roas: {
      target: number;
      actual: number;
      status: string;
    };
    aiSov: {
      targetPct: number;
      actualPct: number;
      status: string;
    };
  };
  allMonths: Array<{
    periodMonth: string;
    seasonLabel: string;
    revenueTargetEur: number;
    actualRevenueEur: number;
    revenueAchievementPct: number;
    ordersTarget: number;
    actualOrders: number;
    ordersAchievementPct: number;
    status: string;
  }>;
  annualSummary: {
    revenueTargetEur: number;
    actualRevenueEur: number;
    revenueAchievementPct: number;
    ordersTarget: number;
    actualOrders: number;
    ordersAchievementPct: number;
  };
}

export interface CompetitorPricesResponse {
  ourBrand: {
    name: string;
    averagePrice: number;
    priceRange: string;
    grossMarginPct: number;
  };
  competitors: Array<{
    brandName: string;
    domain: string;
    avgPrice: number;
    priceRange: string;
    shareOfVoicePct: number;
    sentimentScore: number;
    pricePosition: string;
    quote: string;
  }>;
  categoryComparison: Array<{
    category: string;
    ourPrice: number;
    competitorAvg: number;
    variancePct: number;
    competitorTiers: string;
  }>;
  priceVsSovMatrix: Array<{
    brand: string;
    avgPrice: number;
    shareOfVoicePct: number;
    sentimentScore: number;
    isOwnBrand: boolean;
  }>;
}
