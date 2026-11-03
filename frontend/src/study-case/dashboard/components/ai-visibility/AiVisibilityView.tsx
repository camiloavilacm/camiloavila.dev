import { useState } from 'react';
import { SovDonutChart } from './SovDonutChart';
import { SovTrendChart } from './SovTrendChart';
import { EvaluationFeed } from './EvaluationFeed';
import { Card } from '../ui/Card';
import { Bot, TrendingUp, Award, Eye } from 'lucide-react';
import { useAiSov } from '../../api/queries';

const PROVIDERS = ['all', 'openai', 'anthropic', 'google', 'perplexity'] as const;
type Provider = (typeof PROVIDERS)[number];

const CATEGORIES = [
  'all',
  'menstrual_swimwear',
  'girls_swimwear',
  'period_underwear',
  'swim_tops',
  'comparison',
  'brand_discovery',
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Categories',
  menstrual_swimwear: 'Menstrual Swimwear',
  girls_swimwear: 'Girls Swimwear',
  period_underwear: 'Period Underwear',
  swim_tops: 'Swim Tops',
  comparison: 'Brand Comparison',
  brand_discovery: 'Brand Discovery',
};

export const AiVisibilityView: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data, isLoading } = useAiSov(
    selectedProvider === 'all' ? undefined : selectedProvider,
    selectedCategory === 'all' ? undefined : selectedCategory
  );

  const summary = data?.overallSummary;
  const brands = data?.brandLeaderboard || [];
  const providerComparison = data?.providerComparison || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const monthlyTrend = data?.monthlyTrend || [];

  return (
    <div className="space-y-6">
      {/* Global Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1.5">
              LLM Provider
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {PROVIDERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProvider(p)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border transition-all ${
                    selectedProvider === p
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1.5">
              Prompt Category
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    selectedCategory === c
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {CATEGORY_LABELS[c] || c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
              CS Share of Voice
            </span>
            <div className="p-1.5 bg-blue-50 rounded-md">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {summary?.carolinaSmithSovPct ?? '—'}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target: 22% (Summer) | 15% (Off-peak)</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
              CS Mention Rate
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-md">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {summary?.carolinaSmithMentionRatePct ?? '—'}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {(summary?.totalEvaluations ?? 0).toLocaleString()} LLM evaluations
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
              Avg Brand Rank
            </span>
            <div className="p-1.5 bg-amber-50 rounded-md">
              <Award className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            #{summary?.carolinaSmithAvgRank?.toFixed(1) ?? '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">When mentioned in LLM responses</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
              Top Competitor
            </span>
            <div className="p-1.5 bg-rose-50 rounded-md">
              <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono truncate">
            {summary?.topCompetitor ?? '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Highest competitor mention rate</p>
        </Card>
      </div>

      {/* SoV Donut + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <SovDonutChart brands={brands} isLoading={isLoading} />
        </div>

        {/* Category breakdown */}
        <Card className="lg:col-span-5 p-0 overflow-hidden">
          <div className="p-5 pb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              SOV by Prompt Category
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              How Carolina Smith appears across each search intent
            </p>
          </div>
          <div className="p-4 space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-700">
                    {CATEGORY_LABELS[cat.category] || cat.category}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-blue-600 font-bold">{cat.carolinaSmithSovPct}%</span>
                    <span className="text-slate-400">{cat.evalCount} evals</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, cat.carolinaSmithSovPct * 2)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono w-10 text-right">
                    #{cat.avgRank.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trend Line + Provider Comparison */}
      <SovTrendChart
        monthlyTrend={monthlyTrend}
        providerComparison={providerComparison}
        isLoading={isLoading}
      />

      {/* Evaluation Feed */}
      <EvaluationFeed
        provider={selectedProvider === 'all' ? undefined : selectedProvider}
        category={selectedCategory === 'all' ? undefined : selectedCategory}
      />
    </div>
  );
};
