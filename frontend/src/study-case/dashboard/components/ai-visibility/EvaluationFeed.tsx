import React, { useState } from 'react';
import {
  MessageSquare,
  Link,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAiEvaluations } from '../../api/queries';
import type { EvaluationItem } from '../../types';

const CATEGORY_LABELS: Record<string, string> = {
  menstrual_swimwear: 'Menstrual Swimwear',
  girls_swimwear: 'Girls Swimwear',
  period_underwear: 'Period Underwear',
  swim_tops: 'Swim Tops',
  comparison: 'Brand Comparison',
  brand_discovery: 'Brand Discovery',
};

const PROVIDER_COLORS: Record<string, 'info' | 'success' | 'warning' | 'outline'> = {
  openai: 'success',
  anthropic: 'warning',
  google: 'info',
  perplexity: 'outline',
};

const SENTIMENT_STYLES: Record<string, string> = {
  positive: 'text-emerald-600 font-semibold',
  neutral: 'text-slate-500',
  negative: 'text-rose-500 font-semibold',
};

function EvaluationRow({ item }: { item: EvaluationItem }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(item.evaluatedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="border border-slate-200/80 rounded-xl overflow-hidden mb-3">
      {/* Row Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 p-4 hover:bg-slate-50/80 transition-colors text-left"
      >
        {/* Own brand indicator */}
        <div className="mt-0.5 shrink-0">
          {item.ownBrandMentioned ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-slate-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge
              variant={PROVIDER_COLORS[item.provider] || 'default'}
              className="uppercase font-mono"
            >
              {item.provider}
            </Badge>
            <Badge variant="default" className="font-mono text-[10px]">
              {CATEGORY_LABELS[item.promptCategory] || item.promptCategory}
            </Badge>
            {item.ownBrandMentioned && item.ownBrandRank && (
              <Badge variant="info" className="font-mono text-[10px]">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Rank #{item.ownBrandRank}
              </Badge>
            )}
            <span className="text-[10px] text-slate-400 font-mono ml-auto shrink-0">{date}</span>
          </div>

          <p className="text-xs font-medium text-slate-800 truncate">{item.promptText}</p>

          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
            <span>
              SOV: <b className="text-slate-700">{item.shareOfVoicePct}%</b>
            </span>
            <span>
              Model: <b className="text-slate-700">{item.model}</b>
            </span>
            <span>{item.citations.length} citations</span>
            <span>{item.latencyMs}ms</span>
          </div>
        </div>

        <div className="shrink-0 text-slate-400 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Detail Panel */}
      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50/60 p-4 space-y-4">
          {/* Raw Response */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5">
              Raw LLM Response
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-3">
              {item.rawResponse}
            </p>
          </div>

          {/* Brand Mentions Grid */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-2">
              Brand Mention Scores
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {item.brandMentions.map((bm) => (
                <div
                  key={bm.brand_id}
                  className={`rounded-lg border px-3 py-2 text-center text-[11px] font-mono ${
                    bm.brand === 'Carolina Smith'
                      ? 'border-blue-300 bg-blue-50/60'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-800 truncate text-[10px]">
                    {bm.brand}
                  </div>
                  {bm.mentioned ? (
                    <>
                      <div className="font-bold text-slate-900 mt-0.5">#{bm.rank}</div>
                      <div
                        className={`text-[10px] ${
                          SENTIMENT_STYLES[bm.sentiment || ''] || 'text-slate-400'
                        }`}
                      >
                        {bm.sentiment || '—'}
                      </div>
                      {bm.sentiment_score != null && (
                        <div className="text-[9px] text-slate-400">
                          score: {bm.sentiment_score.toFixed(2)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-[10px] text-slate-300 mt-1">not mentioned</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Citations */}
          {item.citations.length > 0 && (
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5">
                Source Citations ({item.citations.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {item.citations.map((c, i) => (
                  <a
                    key={i}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-mono text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded-md px-2 py-1"
                  >
                    <Link className="w-3 h-3" />
                    {c.domain}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Fan-out queries */}
          {item.fanOut.length > 0 && (
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5">
                Prompt Fan-Out Queries
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.fanOut.map((q, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 rounded px-2 py-0.5 font-mono"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Token usage */}
          <div className="text-[10px] font-mono text-slate-400 flex gap-4">
            <span>
              Input tokens: <b className="text-slate-600">{item.tokenUsage.input}</b>
            </span>
            <span>
              Output tokens: <b className="text-slate-600">{item.tokenUsage.output}</b>
            </span>
            <span>
              Latency: <b className="text-slate-600">{item.latencyMs}ms</b>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface EvaluationFeedProps {
  provider?: string;
  category?: string;
}

export const EvaluationFeed: React.FC<EvaluationFeedProps> = ({ provider, category }) => {
  const [page, setPage] = useState(0);
  const [searchFilter, setSearchFilter] = useState<boolean | undefined>(undefined);
  const limit = 8;

  const { data, isLoading, isFetching } = useAiEvaluations({
    provider,
    category,
    ownBrandMentioned: searchFilter,
    limit,
    offset: page * limit,
  });

  const evaluations = data?.evaluations || [];
  const total = data?.total || 0;
  const citationDomains = data?.topCitationDomains || [];
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Feed Panel */}
      <div className="lg:col-span-8">
        <Card className="p-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                LLM Evaluation Log
              </CardTitle>
              <CardDescription>
                {total.toLocaleString()} evaluations — Click any row to inspect prompt, brand
                mentions, citations and sentiment
              </CardDescription>
            </div>
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {([undefined, true, false] as const).map((val) => (
                <button
                  key={String(val)}
                  onClick={() => {
                    setSearchFilter(val);
                    setPage(0);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    searchFilter === val
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {val === undefined ? 'All' : val ? '✓ CS Mentioned' : '✗ Not Mentioned'}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 animate-pulse">
                    <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {evaluations.map((item) => (
                  <EvaluationRow key={item.evaluationId} item={item} />
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-mono">
                  <span>
                    Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0 || isFetching}
                      className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      ← Prev
                    </button>
                    <span>
                      {page + 1} / {Math.max(1, totalPages)}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1 || isFetching}
                      className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Citation Domains Sidebar */}
      <div className="lg:col-span-4">
        <Card className="p-0 overflow-hidden sticky top-20">
          <CardHeader>
            <CardTitle>Top Citation Domains</CardTitle>
            <CardDescription>
              Most frequently cited sources across all LLM responses
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {citationDomains.map((c, idx) => {
                const maxCount = citationDomains[0]?.citationCount || 1;
                const barPct = (c.citationCount / maxCount) * 100;
                return (
                  <div key={c.domain}>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          c.isOwnDomain ? 'text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        {idx + 1}. {c.domain}
                        {c.isOwnDomain && (
                          <span className="ml-1.5 text-[9px] bg-blue-100 text-blue-600 px-1 rounded">
                            OWN
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {c.citationCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          c.isOwnDomain ? 'bg-blue-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
