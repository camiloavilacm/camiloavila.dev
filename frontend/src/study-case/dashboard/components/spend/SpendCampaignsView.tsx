import { useState, useMemo } from 'react';
import {
  HelpCircle,
  ArrowUpRight,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { TimeRange } from '../../types';

interface SpendCampaignsViewProps {
  timeRange?: TimeRange;
}

interface CampaignRow {
  name: string;
  platform: 'Google' | 'Meta' | 'TikTok';
  spend: number;
  revenue: number;
  roas: number;
  cac: number;
}

type SortField = 'name' | 'platform' | 'spend' | 'revenue' | 'roas' | 'cac';
type SortOrder = 'asc' | 'desc';

export const SpendCampaignsView: React.FC<SpendCampaignsViewProps> = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'Google' | 'Meta' | 'TikTok'>('all');
  const [sortField, setSortField] = useState<SortField>('spend');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Channels data (from docx Screen 2)
  const channels = [
    {
      channel: 'Meta Ads',
      spend: '$19,800',
      revenue: '$71,280',
      roas: '3.60x',
      cac: '$39.13',
      orders: 842,
      pixelValue: '$88,900',
      poas: '2.02x',
      color: 'bg-blue-600',
    },
    {
      channel: 'Google Ads',
      spend: '$15,400',
      revenue: '$64,680',
      roas: '4.20x',
      cac: '$39.29',
      orders: 761,
      pixelValue: '$70,200',
      poas: '2.35x',
      color: 'bg-emerald-600',
    },
    {
      channel: 'TikTok Ads',
      spend: '$7,400',
      revenue: '$19,610',
      roas: '2.65x',
      cac: '$40.66',
      orders: 247,
      pixelValue: '$31,400',
      poas: '1.48x',
      color: 'bg-slate-900',
    },
  ];

  // Campaigns data (from docx Screen 2)
  const rawCampaigns: CampaignRow[] = useMemo(
    () => [
      {
        name: 'Shopping · Performance Max',
        platform: 'Google',
        spend: 8100,
        revenue: 31590,
        roas: 3.9,
        cac: 40.91,
      },
      {
        name: 'Fall Layering · Prospecting',
        platform: 'Meta',
        spend: 7900,
        revenue: 27650,
        roas: 3.5,
        cac: 39.9,
      },
      {
        name: 'Outerwear Lookbook · Video',
        platform: 'Meta',
        spend: 5200,
        revenue: 14560,
        roas: 2.8,
        cac: 35.14,
      },
      {
        name: 'Spark Ads · Creator Fits',
        platform: 'TikTok',
        spend: 4600,
        revenue: 13340,
        roas: 2.9,
        cac: 38.98,
      },
      {
        name: 'Core Denim · Retargeting',
        platform: 'Meta',
        spend: 4100,
        revenue: 21320,
        roas: 5.2,
        cac: 42.71,
      },
      {
        name: 'Non-brand Search · Jackets',
        platform: 'Google',
        spend: 4100,
        revenue: 10690,
        roas: 2.61,
        cac: 55.41,
      },
      {
        name: 'Brand Search',
        platform: 'Google',
        spend: 3200,
        revenue: 22400,
        roas: 7.0,
        cac: 26.67,
      },
      {
        name: 'Prospecting · Broad',
        platform: 'TikTok',
        spend: 2800,
        revenue: 6270,
        roas: 2.24,
        cac: 43.75,
      },
      {
        name: 'Catalog · Advantage+',
        platform: 'Meta',
        spend: 2600,
        revenue: 7750,
        roas: 2.98,
        cac: 40.63,
      },
    ],
    []
  );

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    return rawCampaigns
      .filter((item) => {
        const matchPlatform = platformFilter === 'all' || item.platform === platformFilter;
        const matchSearch =
          item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
          item.platform.toLowerCase().includes(globalFilter.toLowerCase());
        return matchPlatform && matchSearch;
      })
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (typeof a[sortField] === 'string') {
          return factor * (a[sortField] as string).localeCompare(b[sortField] as string);
        }
        return factor * ((a[sortField] as number) - (b[sortField] as number));
      });
  }, [rawCampaigns, platformFilter, globalFilter, sortField, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
        What each channel cost and what the order ledger says it returned, under a single
        attribution model.
      </p>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Total ad spend</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">$42,600</div>
          <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +6.0% vs. previous period
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Revenue from paid channels</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">$155,570</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Net of refunds · Shopify ledger, last non-direct click
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Platforms claim</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">$190,500</div>
          <div className="text-xs font-medium text-amber-700 mt-1">
            +22.5% above the ledger for the same channels
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">POAS (stretch)</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">2.05x</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Gross profit on net sales ÷ ad spend · 56% margin assumed
          </p>
        </div>
      </div>

      {/* Channels Table (from Screen 2) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Channels</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Revenue = Shopify ledger, net of refunds. Pixel value = what each platform claims.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 pr-4">Channel</th>
                <th className="py-2.5 px-3">Spend</th>
                <th className="py-2.5 px-3">Revenue</th>
                <th className="py-2.5 px-3">ROAS</th>
                <th className="py-2.5 px-3">CAC</th>
                <th className="py-2.5 px-3">Orders</th>
                <th className="py-2.5 px-3">Pixel value</th>
                <th className="py-2.5 pl-3">POAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {channels.map((c) => (
                <tr key={c.channel} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-slate-900">{c.channel}</td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">{c.spend}</td>
                  <td className="py-3 px-3 font-mono text-slate-800">{c.revenue}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800">{c.roas}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{c.cac}</td>
                  <td className="py-3 px-3 font-mono text-slate-800">{c.orders}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{c.pixelValue}</td>
                  <td className="py-3 pl-3 font-mono font-bold text-slate-800">{c.poas}</td>
                </tr>
              ))}
              {/* Paid total summary row */}
              <tr className="bg-slate-50/80 font-bold border-t-2 border-slate-200">
                <td className="py-3 pr-4 text-slate-900">Paid total</td>
                <td className="py-3 px-3 font-mono text-slate-900">$42,600</td>
                <td className="py-3 px-3 font-mono text-slate-900">$155,570</td>
                <td className="py-3 px-3 font-mono text-emerald-800">3.65x</td>
                <td className="py-3 px-3 font-mono text-slate-900">$39.44</td>
                <td className="py-3 px-3 font-mono text-slate-900">1,850</td>
                <td className="py-3 px-3 font-mono text-slate-900">$190,500</td>
                <td className="py-3 pl-3 font-mono text-slate-900">2.05x</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          POAS (profit on ad spend) is a stretch metric: it assumes a 56% gross margin until cost
          per item is filled on every SKU.
        </p>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Campaigns</h3>
              <span className="text-amber-500">★</span>
            </div>
            <p className="text-xs text-slate-500">
              Click a column to sort · sorted by {sortField}, {sortOrder}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-700 w-44 sm:w-56"
              />
            </div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-medium cursor-pointer"
            >
              <option value="all">All platforms</option>
              <option value="Google">Google</option>
              <option value="Meta">Meta</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => handleToggleSort('name')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Campaign</span>
                    {sortField === 'name' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('spend')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Spend</span>
                    {sortField === 'spend' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('revenue')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Revenue</span>
                    {sortField === 'revenue' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('roas')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ROAS</span>
                    {sortField === 'roas' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('cac')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>CAC</span>
                    {sortField === 'cac' ? (
                      sortOrder === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedCampaigns.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{row.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                          row.platform === 'Google'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : row.platform === 'Meta'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        {row.platform}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">
                    ${row.spend.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.roas >= 3.0 ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-bold text-slate-900">{row.roas.toFixed(2)}x</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">${row.cac.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attribution Explanation Card (from Screen 2 Bottom) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
        <p className="font-semibold text-slate-800">
          One attribution model: Shopify last non-direct click, 30-day lookback. Every number on
          this screen uses it.
        </p>
        <p className="text-[11px] text-slate-500">
          Not in v1: GA vs. ad-platform vs. multi-model attribution comparison. We refer that to a
          partner tool rather than blur the picture.
        </p>
      </div>
    </div>
  );
};
