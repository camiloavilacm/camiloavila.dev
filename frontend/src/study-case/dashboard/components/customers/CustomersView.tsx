import type React from 'react';
import { HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { EChart } from '../ui/EChart';
import type { EChartsOption } from 'echarts';

export const CustomersView: React.FC = () => {
  // 12-Month Stacked Bar Chart option (from Screen 3)
  const months = [
    'Oct',
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
  ];
  const newCustomerSales = [120, 160, 210, 85, 75, 95, 115, 125, 120, 110, 130, 145];
  const repeatCustomerSales = [80, 130, 185, 90, 85, 90, 105, 115, 110, 105, 125, 150];

  const chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        let content = `<div class="font-sans text-xs"><b>${params[0].name}</b><br/>`;
        let total = 0;
        params.forEach((p: any) => {
          total += p.value;
          content += `<span style="color:${p.color}">●</span> ${p.seriesName}: <b>$${p.value}k</b><br/>`;
        });
        content += `<span class="text-slate-400">Total: $${total}k</span></div>`;
        return content;
      },
    },
    legend: {
      right: 10,
      top: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#475569', fontSize: 11 },
    },
    grid: {
      left: 10,
      right: 10,
      top: 40,
      bottom: 25,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        formatter: (val: number) => `$${val}k`,
      },
    },
    series: [
      {
        name: 'New customers',
        type: 'bar',
        stack: 'total',
        barWidth: '55%',
        itemStyle: { color: '#143d34' },
        data: newCustomerSales,
      },
      {
        name: 'Repeat customers',
        type: 'bar',
        stack: 'total',
        barWidth: '55%',
        itemStyle: { color: '#73a992', borderRadius: [4, 4, 0, 0] },
        data: repeatCustomerSales,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
        Who is buying: lifetime value, new versus repeat, and how that mix has moved over 12 months.
      </p>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: LTV */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">LTV</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">$118.40</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +13.7%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            vs. $104.10 a year ago · net revenue per customer, returns subtracted
          </p>
        </div>

        {/* Card 2: Total customers */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Total customers</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">21,840</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +9.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Lifetime, all channels · Shopify</p>
        </div>

        {/* Card 3: Avg. orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Avg. orders per customer</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">1.74</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +0.06
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Lifetime customer order history</p>
        </div>

        {/* Card 4: Repeat purchase rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Repeat purchase rate</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">31.2%</span>
            <span className="text-xs font-semibold text-amber-700 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -0.8 pts
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Customers with 2+ orders</p>
        </div>
      </div>

      {/* Split Cards: New vs Repeat Customers (Last 30 Days) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* New customers card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <span>New customers</span>
              <span className="text-amber-500">★</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Last 30 days</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <span className="text-xs text-slate-500">Orders</span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">1,276</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Share of orders</span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">57.6%</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">AOV</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">$79.10</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Sales</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">$100,930</div>
            </div>
          </div>
        </div>

        {/* Repeat customers card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <span>Repeat customers</span>
              <span className="text-amber-500">★</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Last 30 days</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <span className="text-xs text-slate-500">Orders</span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">938</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Share of orders</span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">42.4%</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">AOV</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">$88.90</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Sales</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">$83,390</div>
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Stacked Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900">
                New vs. repeat sales, 12 months
              </h3>
              <span className="text-amber-500">★</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Hover or focus a month for the split.</p>
          </div>
        </div>

        <EChart option={chartOption} height="320px" />

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Source: Shopify customer and order history. A customer counts as repeat from their second
          order onward.
        </div>
      </div>
    </div>
  );
};
