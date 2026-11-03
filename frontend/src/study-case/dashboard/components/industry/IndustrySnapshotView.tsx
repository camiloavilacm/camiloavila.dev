import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export const IndustrySnapshotView: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('Apparel & Accessories');

  // You vs Sector comparison table (from Screen 6)
  const comparisonRows = [
    {
      metric: 'Conversion rate',
      source: 'GA4 / Shopify',
      you: '2.25%',
      sector: '2.02%',
      gap: '+11.4%',
      gapPositive: true,
      status: 'On track',
      howToRead: 'At or above sector. Keep protecting page speed and trust signals.',
    },
    {
      metric: 'Your company ROAS',
      source: 'Screen 2 calculation',
      you: '4.33x',
      sector: '3.95x',
      gap: '+9.5%',
      gapPositive: true,
      status: 'On track',
      howToRead: 'At or above sector return on ad spend.',
    },
    {
      metric: 'Your company CAC',
      source: 'Screen 2 calculation',
      you: '$36.10',
      sector: '$34.03',
      gap: '+6.1%',
      gapPositive: false, // higher CAC is worse
      status: 'Below market',
      howToRead: 'Above sector cost. Read next to your LTV:CAC ratio, which is the primary check.',
    },
    {
      metric: 'AOV',
      source: 'Shopify native',
      you: '$83.25',
      sector: '$82.50',
      gap: '+0.9%',
      gapPositive: true,
      status: 'Above sector',
      howToRead:
        'Context, not good or bad. A high AOV often pairs with a lower CVR; read the two together.',
    },
    {
      metric: 'Add-to-cart rate',
      source: 'GA4 add_to_cart (free fallback)',
      you: '6.90%',
      sector: '7.37%',
      gap: '-6.4%',
      gapPositive: false,
      status: 'Below market',
      howToRead: 'Below sector signals product page or merchandising issues.',
    },
    {
      metric: 'Cart-to-purchase',
      source: 'GA4 add_to_cart -> purchase',
      you: '18.40%',
      sector: '17.09%',
      gap: '+7.7%',
      gapPositive: true,
      status: 'On track',
      howToRead: 'Checkout is holding shoppers.',
    },
  ];

  // Industry reference matrix
  const industryList = [
    {
      name: 'Apparel & Accessories',
      cvr: '2.02%',
      roas: '3.95x',
      cac: '$34.03',
      aov: '$82.50',
      atcRate: '7.37%',
      cartToPurchase: '17.09%',
    },
    {
      name: 'Arts & Entertainment',
      cvr: '2.75%',
      roas: '3.15x',
      cac: '$22.00',
      aov: '$93.80',
      atcRate: '7.64%',
      cartToPurchase: '36.81%',
    },
    {
      name: 'Automotive',
      cvr: '1.43%',
      roas: '2.29x',
      cac: '$61.81',
      aov: '$122.10',
      atcRate: '10.88%',
      cartToPurchase: '12.67%',
    },
    {
      name: 'Beauty & Fitness',
      cvr: '2.84%',
      roas: '4.12x',
      cac: '$28.40',
      aov: '$64.20',
      atcRate: '8.15%',
      cartToPurchase: '24.30%',
    },
    {
      name: 'Home & Garden',
      cvr: '1.78%',
      roas: '3.40x',
      cac: '$48.10',
      aov: '$145.00',
      atcRate: '5.90%',
      cartToPurchase: '15.20%',
    },
    {
      name: 'Food & Beverage',
      cvr: '3.10%',
      roas: '3.80x',
      cac: '$24.50',
      aov: '$52.30',
      atcRate: '9.40%',
      cartToPurchase: '29.10%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
        Is this number good? Each metric against the sector benchmark, with the reading guide.
      </p>

      {/* Sector Bar & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Your sector:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
          >
            {industryList.map((ind) => (
              <option key={ind.name} value={ind.name}>
                {ind.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />3 of 5 scored metrics on
            track
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            LTV:CAC 3.3:1 - healthy
          </span>
        </div>
      </div>

      {/* Table 1: You vs Sector Benchmark */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1">
          <h3 className="text-base font-bold text-slate-900">You vs. {selectedSector}</h3>
          <span className="text-xs font-mono text-slate-500">Your values: last 30 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 pr-4">Metric</th>
                <th className="py-2.5 px-3">You</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3">Gap</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 pl-3">How to read it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row) => (
                <tr key={row.metric} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <span>{row.metric}</span>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.source}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.you}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{row.sector}</td>
                  <td
                    className={`py-3 px-3 font-mono font-semibold ${
                      row.gapPositive ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {row.gap}
                  </td>
                  <td className="py-3 px-3">
                    {row.status === 'On track' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        On track
                      </span>
                    ) : row.status === 'Above sector' ? (
                      <span className="inline-flex items-center gap-1.5 text-slate-800 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        Above sector
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        Below market
                      </span>
                    )}
                  </td>
                  <td className="py-3 pl-3 text-slate-600 text-xs max-w-md leading-relaxed">
                    {row.howToRead}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Industry Reference Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1">
          <h3 className="text-base font-bold text-slate-900">Industry reference table</h3>
          <span className="text-xs text-slate-500">
            Select a sector name to benchmark against it
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 pr-4">Industry</th>
                <th className="py-2.5 px-3">CVR</th>
                <th className="py-2.5 px-3">ROAS</th>
                <th className="py-2.5 px-3">CAC</th>
                <th className="py-2.5 px-3">AOV</th>
                <th className="py-2.5 px-3">ATC rate</th>
                <th className="py-2.5 pl-3">Cart-to-purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {industryList.map((ind) => {
                const isSelected = selectedSector === ind.name;
                return (
                  <tr
                    key={ind.name}
                    onClick={() => setSelectedSector(ind.name)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/80 font-semibold' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3 pr-4 text-slate-900 flex items-center gap-2">
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      )}
                      <span>{ind.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono">{ind.cvr}</td>
                    <td className="py-3 px-3 font-mono">{ind.roas}</td>
                    <td className="py-3 px-3 font-mono">{ind.cac}</td>
                    <td className="py-3 px-3 font-mono">{ind.aov}</td>
                    <td className="py-3 px-3 font-mono">{ind.atcRate}</td>
                    <td className="py-3 pl-3 font-mono">{ind.cartToPurchase}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
