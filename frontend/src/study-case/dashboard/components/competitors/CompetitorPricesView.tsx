import { useState } from 'react';
import {
  Tag,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  ThumbsUp,
  Sparkles,
  BarChart3,
  MessageSquare,
  Globe,
  Share2,
} from 'lucide-react';
import { EChart } from '../ui/EChart';
import { useCompetitorPrices } from '../../api/queries';
import type { EChartsOption } from 'echarts';

type CompetitorSubTab =
  | 'prices'
  | 'overview'
  | 'sov'
  | 'sentiment'
  | 'responses'
  | 'fanout'
  | 'citations';

export const CompetitorPricesView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<CompetitorSubTab>('prices');
  const [sentimentViewMode, setSentimentViewMode] = useState<'praise' | 'criticism'>('praise');
  const [citationFilter, setCitationFilter] = useState('All Sources');
  const [promptSearch, setPromptSearch] = useState('');
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>('bikini menstrual opiniones');

  const { data: compPrices } = useCompetitorPrices();

  // 1. Competitive Landscape Line Chart Option (from Elmo Overview screenshot)
  const competitiveLandscapeOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#64748b', fontSize: 11 },
      data: ['ecowoman', 'cocoro intim', 'sorio', 'womens secret'],
    },
    grid: { left: 40, right: 20, top: 20, bottom: 40, containLabel: false },
    xAxis: {
      type: 'category',
      data: ['Sep 20', 'Sep 24', 'Sep 28', 'Oct 2', 'Oct 5', 'Oct 8', 'Oct 12', 'Oct 16', 'Oct 20'],
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 50,
      interval: 9,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: 'ecowoman',
        type: 'line',
        data: [44, 44, 44, 44, 44, 44, 44, 43, 43],
        lineStyle: { color: '#2563eb', width: 2 },
        itemStyle: { color: '#2563eb' },
        showSymbol: false,
      },
      {
        name: 'cocoro intim',
        type: 'line',
        data: [44, 44, 44, 44, 44, 44, 44, 43, 43],
        lineStyle: { color: '#eab308', width: 2 },
        itemStyle: { color: '#eab308' },
        showSymbol: false,
      },
      {
        name: 'sorio',
        type: 'line',
        data: [22, 22, 22, 22, 22, 22, 22, 31, 31],
        lineStyle: { color: '#ec4899', width: 2 },
        itemStyle: { color: '#ec4899' },
        showSymbol: false,
      },
      {
        name: 'womens secret',
        type: 'line',
        data: [22, 22, 22, 22, 22, 22, 22, 31, 31],
        lineStyle: { color: '#854d0e', width: 2 },
        itemStyle: { color: '#854d0e' },
        showSymbol: false,
      },
    ],
  };

  // 2. Share of Voice Donut Option (from Elmo Share of Voice screenshot)
  const sovDonutOption: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '29%\nSoV',
          fontSize: 22,
          fontWeight: 'bold',
          color: '#0f172a',
        },
        data: [
          { value: 29, name: 'ecowoman', itemStyle: { color: '#2563eb' } },
          { value: 29, name: 'cocoro intim', itemStyle: { color: '#eab308' } },
          { value: 21, name: 'sorio', itemStyle: { color: '#ec4899' } },
          { value: 21, name: 'womens secret', itemStyle: { color: '#854d0e' } },
        ],
      },
    ],
  };

  // 3. Sentiment Donut Option (from Elmo Sentiment screenshot)
  const sentimentDonutOption: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '57\nScore',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#0f172a',
        },
        data: [
          { value: 14, name: 'Positive', itemStyle: { color: '#059669' } },
          { value: 86, name: 'Neutral', itemStyle: { color: '#94a3b8' } },
          { value: 0, name: 'Negative', itemStyle: { color: '#e11d48' } },
        ],
      },
    ],
  };

  // Citations data (from Elmo Citations screenshots)
  const domains = [
    { name: 'theecowoman.es', count: 10, shareWidth: 100, color: 'bg-blue-600', type: 'Brand' },
    { name: 'womensecret.com', count: 8, shareWidth: 80, color: 'bg-rose-500', type: 'Competitor' },
    { name: 'mysorio.com', count: 7, shareWidth: 70, color: 'bg-rose-500', type: 'Competitor' },
    { name: 'amazon.es', count: 7, shareWidth: 70, color: 'bg-emerald-600', type: 'Ecommerce' },
    { name: 'decathlon.es', count: 6, shareWidth: 60, color: 'bg-blue-500', type: 'Ecommerce' },
    {
      name: 'smoon-lingerie.com',
      count: 6,
      shareWidth: 60,
      color: 'bg-purple-600',
      type: 'Competitor',
    },
    { name: 'primark.com', count: 5, shareWidth: 50, color: 'bg-cyan-500', type: 'Competitor' },
    { name: 'elpais.com', count: 5, shareWidth: 50, color: 'bg-indigo-600', type: 'Editorial' },
    {
      name: 'bragas-menstruales.com',
      count: 5,
      shareWidth: 50,
      color: 'bg-slate-500',
      type: 'Editorial',
    },
    { name: 'druni.es', count: 5, shareWidth: 50, color: 'bg-teal-600', type: 'Ecommerce' },
  ];

  const citedUrls = [
    {
      domain: 'decathlon.es/es/mujer/braguitas-menstruales',
      title: 'Bragas menstruales',
      tag: 'Other',
      avgPos: 2.4,
      citations: 5,
    },
    {
      domain: 'primark.com/es-es/c/mujer/ropa-para-dormir/bragas',
      title: 'Bragas Menstruales | Bragas para la Regla Reutilizables',
      tag: 'Other',
      avgPos: 0.6,
      citations: 4,
    },
    {
      domain: 'hola.com/seleccion/mejor-banador-menstrual-comodo',
      title: 'Sentirse guapa y segura con un bañador menstrual...',
      tag: 'Editorial',
      avgPos: 2.0,
      citations: 3,
    },
    {
      domain: 'smoon-lingerie.com/es/blogs/protecciones/guia',
      title: 'Mejor bañador menstrual 2025: nuestra guía comparativa',
      tag: 'Editorial',
      avgPos: 1.7,
      citations: 3,
    },
    {
      domain: 'theecowoman.es/collections/banadores-menstruales',
      title: 'Bañadores y Bikinis Menstruales Antifugas | Ecowoman',
      tag: 'Brand',
      avgPos: 10.3,
      citations: 3,
    },
    {
      domain: 'womensecret.com/es/es/mujer/copa-y-bragas',
      title: 'Bragas Menstruales | Bragas para la Regla',
      tag: 'Competitor',
      avgPos: 4.0,
      citations: 3,
    },
  ];

  // Fan-Out prompts list
  const fanOutPrompts = [
    {
      prompt: 'bikini menstrual opiniones',
      variations: 2,
      queriesCount: 2,
      avgFanOut: 1,
      subQueries: ['opiniones bikini menstrual absorbent', 'mejores bañadores periodo españa'],
    },
    {
      prompt: 'bragas menstruales para niñas y adolescentes',
      variations: 2,
      queriesCount: 2,
      avgFanOut: 1,
      subQueries: ['bragas menstruales primera regla niñas', 'tallaje bragas periodo adolescentes'],
    },
    {
      prompt: 'dónde comprar bragas menstruales en españa',
      variations: 2,
      queriesCount: 2,
      avgFanOut: 1,
      subQueries: ['tiendas fisicas bañador menstrual madrid', 'comprar ecowoman sorio online'],
    },
    {
      prompt: 'marcas de bragas menstruales españolas',
      variations: 2,
      queriesCount: 2,
      avgFanOut: 1,
      subQueries: [
        'marcas sostenibles bragas menstruales fabricadas españa',
        'cocoro vs ecowoman comparativa',
      ],
    },
    {
      prompt: 'mejores bañadores menstruales',
      variations: 2,
      queriesCount: 2,
      avgFanOut: 1,
      subQueries: [
        'test bañadores menstruales natacion piscina',
        'bañador antifugas sorio ecowoman',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Subtitle & Document Origin Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          Screen 7 based on document design:{' '}
          <strong>Competitor prices & generative AI visibility suite</strong>. Real-time tracking of
          competitor pricing, LLM share of voice, citations, and search fan-out.
        </p>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
          Source: LLM Evaluation Scraping & Engine Panel
        </span>
      </div>

      {/* Sub-tab Navigation Bar (matching Elmo screens) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('prices')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'prices'
              ? 'bg-[#143d34] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Competitor Prices</span>
        </button>

        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'overview'
              ? 'bg-[#143d34] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>AI Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sov')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'sov'
              ? 'bg-[#143d34] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share of Voice</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sentiment')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'sentiment'
              ? 'bg-[#143d34] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Sentiment</span>
        </button>

        <button
          onClick={() => setActiveSubTab('responses')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'responses'
              ? 'bg-[#143d34] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Responses</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fanout')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'fanout'
              ? 'bg-[#143d34] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Query Fan-Out</span>
        </button>

        <button
          onClick={() => setActiveSubTab('citations')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'citations'
              ? 'bg-[#143d34] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Citations</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: COMPETITOR PRICES & POSITIONING MATRIX
          ========================================================================= */}
      {activeSubTab === 'prices' && (
        <div className="space-y-6">
          {/* Top Price KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Our Catalog Avg. Price</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">34.50 €</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Active catalog range: 24.00€ – 58.00€ · 56% gross margin
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">
                Market Entry Price (Ecowoman)
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">23.00 €</div>
              <p className="text-[11px] text-amber-700 mt-1 font-medium">
                -33.3% below our average · cited in 70% of LLM searches
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">
                Mid-Tier Competitor (Sorio)
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">28.50 €</div>
              <p className="text-[11px] text-slate-500 mt-1">
                -17.4% vs our price · focused on leak-proof swimwear
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">
                Sustainable Premium (Cocoro)
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">29.00 €</div>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                Comparable technical positioning · 29% Share of Voice
              </p>
            </div>
          </div>

          {/* Catalog Category Price Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Category Price Benchmark vs Competitor Average
                </h3>
                <p className="text-xs text-slate-500">
                  Data synthesized from LLM product scraping and citation snippets
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                Shopify Ledger vs Web Extracted
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 pr-4">Category</th>
                    <th className="py-2.5 px-3">Our Price</th>
                    <th className="py-2.5 px-3">Competitor Avg</th>
                    <th className="py-2.5 px-3">Price Gap</th>
                    <th className="py-2.5 pl-3">Competitor Price Tiers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {compPrices?.categoryComparison?.map((cat) => (
                    <tr key={cat.category} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-slate-900">{cat.category}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {cat.ourPrice.toFixed(2)} €
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {cat.competitorAvg.toFixed(2)} €
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-amber-700">
                        +{cat.variancePct.toFixed(1)}%
                      </td>
                      <td className="py-3 pl-3 text-slate-600 font-mono text-[11px]">
                        {cat.competitorTiers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Competitor Scraped Pricing Snippets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Scraped Competitor Price Quotes in AI Engine Responses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compPrices?.competitors?.map((comp) => (
                <div
                  key={comp.brandName}
                  className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{comp.brandName}</span>
                      <span className="text-[11px] font-mono text-slate-500">({comp.domain})</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                      ~{comp.avgPrice.toFixed(2)} €
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                    {comp.pricePosition}
                  </div>
                  <blockquote className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/80 text-[11px] leading-relaxed">
                    "{comp.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>SoV: {comp.shareOfVoicePct}%</span>
                    <span>Sentiment: {comp.sentimentScore}</span>
                    <span>Catalog: {comp.priceRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: AI OVERVIEW (from Elmo Overview screenshot)
          ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-rose-600 font-medium">AI Visibility</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">44%</span>
                <span className="text-xs font-semibold text-rose-600">↘ 1pt</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-emerald-600 font-medium">Share of Voice</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">29%</span>
                <span className="text-xs font-semibold text-rose-600">↘ 4pt</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-amber-600 font-medium">Sentiment</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">57</span>
                <span className="text-xs font-semibold text-rose-600">↘ 30</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-amber-600 font-medium">Position</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">1.9</span>
                <span className="text-xs font-semibold text-amber-600">↗ 0.1</span>
              </div>
            </div>
          </div>

          {/* Competitive Landscape Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                <span>Competitive Landscape</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                <button className="px-2.5 py-1 bg-white text-slate-900 rounded font-semibold shadow-2xs">
                  Visibility
                </button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900">
                  Share of Voice
                </button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900">
                  Sentiment
                </button>
                <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900">
                  Position
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <EChart option={competitiveLandscapeOption} height="280px" />
              </div>

              {/* Company Model Table */}
              <div className="lg:col-span-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                      <th className="py-2">Company</th>
                      <th className="py-2 text-right">All</th>
                      <th className="py-2 text-right">Google</th>
                      <th className="py-2 text-right">Perplexity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 font-semibold text-slate-900">ecowoman</td>
                      <td className="py-2.5 text-right font-mono font-bold">44%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">60%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">80%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 font-semibold text-slate-900">cocoro intim</td>
                      <td className="py-2.5 text-right font-mono font-bold">44%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">40%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">60%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 font-semibold text-slate-900">sorio</td>
                      <td className="py-2.5 text-right font-mono font-bold">31%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">40%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">60%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 font-semibold text-slate-900">womens secret</td>
                      <td className="py-2.5 text-right font-mono font-bold">31%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">40%</td>
                      <td className="py-2.5 text-right font-mono text-slate-600">60%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>5 prompts tracked · 25 evaluations</span>
              <span>~1w run frequency · 2d ago last updated</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SHARE OF VOICE (from Elmo Share of Voice screenshot)
          ========================================================================= */}
      {activeSubTab === 'sov' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-600">
            How often AI engines mention you versus your competitors.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Share of Voice Donut Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Share of Voice</h3>
              <EChart option={sovDonutOption} height="240px" />
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="font-semibold text-slate-800">ecowoman</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">29%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-semibold text-slate-800">cocoro intim</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">29%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <span className="font-semibold text-slate-800">sorio</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">21%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-900" />
                    <span className="font-semibold text-slate-800">womens secret</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">21%</span>
                </div>
              </div>
            </div>

            {/* Share of Voice Trends Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Share of Voice Trends</h3>
              <EChart option={competitiveLandscapeOption} height="280px" />
            </div>
          </div>

          {/* Share of Voice Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Share of Voice Leaderboard</h3>
            <div className="space-y-3">
              {[
                {
                  rank: 1,
                  name: 'ecowoman',
                  isYou: true,
                  mentions: 7,
                  share: 29,
                  color: 'bg-blue-600',
                  prompts: 4,
                },
                {
                  rank: 2,
                  name: 'cocoro intim',
                  isYou: false,
                  mentions: 7,
                  share: 29,
                  color: 'bg-amber-500',
                  prompts: 3,
                },
                {
                  rank: 3,
                  name: 'sorio',
                  isYou: false,
                  mentions: 5,
                  share: 21,
                  color: 'bg-pink-500',
                  prompts: 3,
                },
                {
                  rank: 4,
                  name: 'womens secret',
                  isYou: false,
                  mentions: 5,
                  share: 21,
                  color: 'bg-amber-900',
                  prompts: 3,
                },
              ].map((b) => (
                <div
                  key={b.name}
                  className="flex items-center gap-4 text-xs py-2 border-b border-slate-100 last:border-none"
                >
                  <span className="font-mono text-slate-400 w-4">{b.rank}</span>
                  <div className="w-32 font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>{b.name}</span>
                    {b.isYou && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-normal font-mono">
                        You
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-600 w-16 text-right">
                    {b.mentions} mentions
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden mx-2">
                    <div
                      className={`h-full rounded-full ${b.color}`}
                      style={{ width: `${b.share * 2.5}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-12 text-right">
                    {b.share}%
                  </span>
                  <span className="font-mono text-slate-400 w-16 text-right">
                    {b.prompts} prompts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SENTIMENT (from Elmo Sentiment screenshot)
          ========================================================================= */}
      {activeSubTab === 'sentiment' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-600">
            How AI answers describe your brand when they mention it.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sentiment Donut Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Sentiment Score</h3>
              <EChart option={sentimentDonutOption} height="220px" />
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Positive</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">14%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>Neutral</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">86%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Negative</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">0%</span>
                </div>
              </div>
            </div>

            {/* What AI Says About You Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">What AI Says About You</h3>
                <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                  <button
                    onClick={() => setSentimentViewMode('criticism')}
                    className={`px-3 py-1 rounded transition-all ${
                      sentimentViewMode === 'criticism'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Criticism
                  </button>
                  <button
                    onClick={() => setSentimentViewMode('praise')}
                    className={`px-3 py-1 rounded transition-all ${
                      sentimentViewMode === 'praise'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Praise
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-900">
                    Bañadores y Bikinis Menstruales Antifugas — theecowoman.es
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Ventajas clave de nuestros bañadores menstruales: Hasta 8 horas de protección
                    sin fugas, incluso dentro del agua.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <span className="text-emerald-700 font-semibold">Positive</span>
                    <span>•</span>
                    <span>mejores bañadores menstruales · 17/10/2026</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-900">Precios y variedad de catálogo</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Sus precios individuales rondan los 23 €. Ecowoman: Ofrecen una gran variedad de
                    estilos (bóxer, tanga, tiro alto) y un catálogo inclusivo de tallas desde la XS
                    hasta la 4XL.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                    <span className="text-emerald-700 font-semibold">Positive</span>
                    <span>•</span>
                    <span>dónde comprar bragas menstruales en españa · 16/10/2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: RESPONSES (from Elmo Responses screenshot)
          ========================================================================= */}
      {activeSubTab === 'responses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Responses</h3>
              <p className="text-xs text-slate-500">Every AI answer to your prompts.</p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search responses..."
                value={promptSearch}
                onChange={(e) => setPromptSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-700 w-56"
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">36% positive across 25 answers</span>
              <span className="text-slate-500 font-mono">Newest first</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
              <div className="bg-emerald-600 h-full" style={{ width: '16%' }} />
              <div className="bg-slate-400 h-full" style={{ width: '28%' }} />
              <div className="bg-slate-200 h-full" style={{ width: '56%' }} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
              <span>● Positive 4</span>
              <span>● Neutral 7</span>
              <span>● Mixed 0</span>
              <span>● Negative 0</span>
              <span>● Doesn't mention you 14</span>
            </div>
          </div>

          {/* Prompt Answer Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono">Prompt</span>
                <h4 className="text-sm font-bold text-slate-900">bikini menstrual opiniones</h4>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-500">
                <div>Model: Google Search (searchapi)</div>
                <div>Evaluated: 17/10/2026, 16:54:26 CEST</div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-700">Brands Mentioned:</span>
              <div className="flex gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs border border-slate-200 font-mono">
                  ecowoman #1 <span className="text-slate-500 text-[10px]">Neutral</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-xs border border-emerald-200 font-mono">
                  sorio #2 <span className="text-emerald-700 text-[10px]">Positive</span>
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50/80 p-4 rounded-xl border border-slate-200 leading-relaxed font-sans">
              <span className="font-semibold text-slate-900 block mb-2 font-mono text-[11px]">
                LLM Response
              </span>
              <p>
                1. <strong>Hablamos hace tiempo de las braguitas menstruales y...</strong> —
                instagram.com Las bragas para la noche o para estar en casa me parecen lo más, y
                desde que las probé, no he vuelto a usar otra cosa...
              </p>
              <p>
                2. <strong>Bañadores y Bikinis Menstruales Antifugas — theecowoman.es</strong> Es
                una prenda de ropa de baño menstrual diseñada para absorber el flujo menstrual
                mientras nadas o tomas el sol...
              </p>
              <p>
                3. <strong>Los mejores bikinis menstruales del 2025 — glamour.es</strong> No calan,
                no manchan y, por su aspecto, nadie diría que son bikinis menstruales. Seleccionamos
                los mejores de la temporada...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: QUERY FAN-OUT (from Elmo Query Fan-Out screenshot)
          ========================================================================= */}
      {activeSubTab === 'fanout' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-600">
            The web searches AI engines run when answering your prompts.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Search Prompt Runs</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">25</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">
                Prompt Runs w/ Unknown Queries
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">15</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">
                Prompt Runs w/ Known Queries
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">10</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Average Fan-Out</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">1</div>
            </div>
          </div>

          {/* Prompts table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Prompts</h3>
            <div className="divide-y divide-slate-100">
              {fanOutPrompts.map((fp) => {
                const isExp = expandedPrompt === fp.prompt;
                return (
                  <div key={fp.prompt} className="py-3">
                    <div
                      onClick={() => setExpandedPrompt(isExp ? null : fp.prompt)}
                      className="flex items-center justify-between cursor-pointer hover:text-slate-900 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {isExp ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <div>
                          <span className="font-semibold text-slate-900">{fp.prompt}</span>
                          <span className="text-[11px] text-slate-400 ml-2 font-mono">
                            {fp.variations} variations
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 font-mono text-slate-600">
                        <span>{fp.queriesCount} queries</span>
                        <span>{fp.avgFanOut} avg fan-out</span>
                      </div>
                    </div>

                    {isExp && (
                      <div className="mt-3 ml-6 pl-4 border-l-2 border-slate-200 space-y-1.5 text-xs text-slate-600">
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                          Generated Sub-Queries
                        </span>
                        {fp.subQueries.map((sq) => (
                          <div
                            key={sq}
                            className="flex items-center gap-2 font-mono text-[11px] text-slate-800"
                          >
                            <span>↳</span>
                            <span>{sq}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: CITATIONS (from Elmo Citations screenshots)
          ========================================================================= */}
      {activeSubTab === 'citations' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-600">
            Which domains and URLs LLMs reference most when responding to your prompts.
          </p>

          {/* Top Cited Domains Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Top Cited Domains</h3>
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {['All Sources', 'Brand', 'Competitor', 'Editorial', 'Ecommerce'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setCitationFilter(tag)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      citationFilter === tag
                        ? 'bg-[#143d34] text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {domains
                .filter((d) => citationFilter === 'All Sources' || d.type === citationFilter)
                .map((dom) => (
                  <div key={dom.name} className="flex items-center gap-4 text-xs py-1.5">
                    <span className="font-semibold text-slate-900 w-48 truncate">{dom.name}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dom.color}`}
                        style={{ width: `${dom.shareWidth}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-900 w-10 text-right">
                      {dom.count}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Cited URLs Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Top Cited URLs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-medium text-[11px]">
                    <th className="py-2 pr-4">Page & Title</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3 text-right">Avg Pos</th>
                    <th className="py-2 pl-3 text-right">Citations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {citedUrls.map((u) => (
                    <tr key={u.domain} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-slate-900">{u.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">
                          {u.domain}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                            u.tag === 'Brand'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : u.tag === 'Competitor'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : u.tag === 'Editorial'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {u.tag}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        {u.avgPos.toFixed(1)}
                      </td>
                      <td className="py-3 pl-3 text-right font-mono font-bold text-slate-900">
                        {u.citations}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
