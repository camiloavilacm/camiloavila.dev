import { useState } from 'react';
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  createFilteredRowModel,
  createColumnHelper,
  filterFn_includesString,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { CampaignMetric } from '../../types';

// ── Feature set defined STATICALLY outside the component ──────────────────────
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

// ── Column helper with registered feature capabilities ────────────────────────
const columnHelper = createColumnHelper<typeof features, CampaignMetric>();

// ── Columns definition (static) ──────────────────────────────────────────────
const columns = columnHelper.columns([
  columnHelper.accessor('campaignName', {
    header: 'Campaign Name',
    cell: (info) => (
      <div className="font-medium text-slate-900 truncate max-w-xs">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('platform', {
    header: 'Platform',
    cell: (info) => {
      const platform = info.getValue().toLowerCase();
      const badgeVariants: Record<string, 'info' | 'success' | 'danger'> = {
        meta: 'info',
        google: 'success',
        tiktok: 'danger',
      };
      return (
        <Badge variant={badgeVariants[platform] || 'default'} className="uppercase">
          {platform}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('spend', {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center gap-1 hover:text-slate-900"
      >
        <span>Spend</span>
        <ArrowUpDown className="w-3 h-3" />
      </button>
    ),
    cell: (info) => (
      <span className="font-mono font-semibold text-slate-800">
        €
        {info
          .getValue()
          .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    ),
  }),
  columnHelper.accessor('impressions', {
    header: 'Impressions',
    cell: (info) => (
      <span className="font-mono text-slate-600 text-xs">{info.getValue().toLocaleString()}</span>
    ),
  }),
  columnHelper.accessor('clicks', {
    header: 'Clicks',
    cell: (info) => (
      <span className="font-mono text-slate-600 text-xs">
        {info.getValue().toLocaleString()} ({info.row.original.ctrPct.toFixed(2)}%)
      </span>
    ),
  }),
  columnHelper.accessor('conversions', {
    header: 'Conversions',
    cell: (info) => (
      <span className="font-mono text-slate-600 text-xs">
        {info.getValue().toLocaleString()} ({info.row.original.cvrPct.toFixed(2)}%)
      </span>
    ),
  }),
  columnHelper.accessor('cpaEur', {
    header: 'CPA',
    cell: (info) => (
      <span className="font-mono text-slate-600 text-xs">€{info.getValue().toFixed(2)}</span>
    ),
  }),
  columnHelper.accessor('attributedRevenue', {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center gap-1 hover:text-slate-900"
      >
        <span>Revenue</span>
        <ArrowUpDown className="w-3 h-3" />
      </button>
    ),
    cell: (info) => (
      <span className="font-mono font-bold text-slate-900">
        €
        {info
          .getValue()
          .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    ),
  }),
  columnHelper.accessor('attributedRoas', {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center gap-1 hover:text-slate-900"
      >
        <span>ROAS</span>
        <ArrowUpDown className="w-3 h-3" />
      </button>
    ),
    cell: (info) => {
      const roas = info.getValue();
      const colorClass =
        roas >= 4.0
          ? 'text-emerald-600 font-bold'
          : roas >= 2.5
            ? 'text-blue-600 font-semibold'
            : 'text-amber-600';
      return <span className={`font-mono ${colorClass}`}>{roas.toFixed(2)}x</span>;
    },
  }),
]);

// ── Component ─────────────────────────────────────────────────────────────────
interface CampaignTableProps {
  campaigns?: CampaignMetric[];
  isLoading?: boolean;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns = [],
  isLoading = false,
}) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'spend', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useTable({
    features,
    data: campaigns,
    columns,
    globalFilterFn: 'includesString' as const,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  // Derive visible rows & pagination from table state
  const rows = table.getRowModel().rows;
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();
  const pageIndex = table.state.pagination.pageIndex;
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle>Campaign Performance Ledger</CardTitle>
          <CardDescription>
            Attribution ledger with TanStack Table sorting, live search filtering, and ROAS
            calculations
          </CardDescription>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium placeholder-slate-400"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-slate-50/80 border-y border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider"
                >
                  {headerGroup.headers.map((header: any) => (
                    <th key={header.id} className="py-3 px-4 font-semibold">
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                    Loading campaigns...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                    No matching campaigns found.
                  </td>
                </tr>
              ) : (
                rows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    {row.getAllCells().map((cell: any) => (
                      <td key={cell.id} className="py-3 px-4">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="py-3 px-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div>
            Showing <span className="font-semibold text-slate-700">{rows.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{campaigns.length}</span> campaigns
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!canPrev}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {pageIndex + 1} of {pageCount}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!canNext}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
