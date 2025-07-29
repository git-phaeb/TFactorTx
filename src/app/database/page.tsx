'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TFactorTxData, getTDL } from '@/lib/csv-loader';

export default function DatabasePage() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'sort_disease_ot_ard_aging_overall_rank', desc: false }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<TFactorTxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnNames, setColumnNames] = useState<string[]>([]);

  // Handle search term change
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  // Open gene details in new tab
  const handleGeneClick = (geneSymbol: string) => {
    window.open(`/database/${encodeURIComponent(geneSymbol)}`, '_blank');
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Add cache-busting parameter to force reload
        const response = await fetch(`/api/csv-data?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log('Loaded column names:', result.columnNames);
        setData(result.data);
        setColumnNames(result.columnNames || []);
        // Remove automatic selection of TP53
        // const tp53 = result.data.find((row: TFactorTxData) => row['TF Symbol'] === 'TP53');
        // setSelectedRow(tp53 || result.data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Column definitions
  const columns: ColumnDef<TFactorTxData>[] = useMemo(() => [
    {
      accessorKey: 'TF Symbol',
      header: columnNames[0] || 'Gene Name',
      cell: ({ row }) => (
        <div
          className="font-medium text-blue-600 cursor-pointer hover:text-blue-800 truncate"
          onClick={() => handleGeneClick(row.getValue('TF Symbol') as string)}
          title={row.getValue('TF Symbol') as string}
        >
          {row.getValue('TF Symbol')}
        </div>
      ),
    },
    {
      accessorKey: 'sort_disease_ot_ard_aging_overall_rank',
      header: columnNames[1] || 'Overall Rank',
      cell: ({ getValue }) => (
        <span className="font-medium truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'sort_disease_ot_total_assoc_score_rank',
      header: columnNames[2] || 'All Diseases Rank',
      cell: ({ getValue }) => (
        <span className="truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'sort_disease_ot_ard_total_assoc_count_score_rank',
      header: columnNames[3] || 'ARDs Rank',
      cell: ({ getValue }) => (
        <span className="truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'disease_ot_ard_strongest_linked_disease',
      header: columnNames[4] || 'Strongest Linked ARD',
      cell: ({ getValue }) => {
        const disease = getValue() as string;
        const displayText = disease === '#NA' ? 'Unknown' : disease;
        return (
          <span className="truncate block" title={displayText}>
            {displayText}
          </span>
        );
      },
    },
    {
      accessorKey: 'sort_aging_summary_total_db_entries_count_rank',
      header: columnNames[5] || 'Aging Rank',
      cell: ({ getValue }) => (
        <span className="truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'aging_summary_human',
      header: columnNames[6] || 'Human Link Y/N',
      cell: ({ getValue }) => {
        const human = getValue() as string;
        return (
          <Badge variant={human === 'Y' ? 'default' : 'secondary'} className="text-xs">
            {human === 'Y' ? 'Yes' : 'No'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'aging_summary_mm_influence',
      header: columnNames[7] || 'M. musculus Link',
      cell: ({ getValue }) => {
        const influence = getValue() as string;
        if (influence === '#NA') return <span className="text-xs">Unknown</span>;
        return (
          <Badge
            variant={
              influence === 'Pro-Longevity'
                ? 'default'
                : influence === 'Anti-Longevity'
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs"
            title={influence}
          >
            {influence}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'aging_summary_ce_influence',
      header: columnNames[8] || 'C. elegans Link',
      cell: ({ getValue }) => {
        const influence = getValue() as string;
        if (influence === '#NA') return <span className="text-xs">Unknown</span>;
        return (
          <Badge
            variant={
              influence === 'Pro-Longevity'
                ? 'default'
                : influence === 'Anti-Longevity'
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs"
            title={influence}
          >
            {influence}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'aging_summary_dm_influence',
      header: columnNames[9] || 'D. melanogaster Link',
      cell: ({ getValue }) => {
        const influence = getValue() as string;
        if (influence === '#NA') return <span className="text-xs">Unknown</span>;
        return (
          <Badge
            variant={
              influence === 'Pro-Longevity'
                ? 'default'
                : influence === 'Anti-Longevity'
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs"
            title={influence}
          >
            {influence}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'dev_summary_dev_level_category',
      header: columnNames[10] || 'Development Level',
      cell: ({ getValue }) => {
        const category = getValue() as string;
        const getVariant = (cat: string) => {
          if (cat.includes('High')) return 'default';
          if (cat.includes('Medium')) return 'outline';
          if (cat.includes('Low')) return 'secondary';
          return 'outline';
        };
        return (
          <Badge variant={getVariant(category)} className="text-xs" title={category}>
            {category}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'dev_pharos_tcrd_tdl',
      header: columnNames[11] || 'Pharos TDL',
      cell: ({ getValue }) => {
        const tdl = getValue() as string;
        const getVariant = (tdlVal: string) => {
          if (tdlVal === 'Tclin') return 'default';
          if (tdlVal === 'Tchem') return 'outline';
          if (tdlVal === 'Tbio') return 'outline';
          return 'outline';
        };
        const displayText = getTDL(tdl);
        return (
          <Badge variant={getVariant(tdl)} className="text-xs" title={displayText}>
            {displayText}
          </Badge>
        );
      },
    },
  ], [columnNames]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      row['TF Symbol'].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter: searchTerm,
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater(sorting);
        // If no sorting or same column clicked, toggle between asc/desc
        if (newSorting.length === 0 ||
            (newSorting.length === 1 && sorting.length === 1 && newSorting[0].id === sorting[0].id)) {
          // Toggle current sort direction
          setSorting([{
            id: sorting.length > 0 ? sorting[0].id : 'sort_disease_ot_ard_aging_overall_rank',
            desc: !(sorting.length > 0 ? sorting[0].desc : false)
          }]);
        } else {
          // New column selected, start with ascending
          setSorting([{ id: newSorting[0].id, desc: false }]);
        }
      } else {
        // Direct array assignment
        if (updater.length === 0) {
          setSorting([{ id: 'sort_disease_ot_ard_aging_overall_rank', desc: false }]);
        } else {
          setSorting(updater);
        }
      }
    },
    onGlobalFilterChange: setSearchTerm,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
      sorting: [
        { id: 'sort_disease_ot_ard_aging_overall_rank', desc: false },
      ],
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading 1642 entries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
      <div className="container mx-auto px-4 pt-0 pb-0 mb-8" style={{ marginTop: '-20px' }}>

        {/* Filter Options - Horizontal Layout */}
        <div className="mb-1 p-2 bg-white border border-gray-200 rounded">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by TF Symbol..."
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="pl-9 pr-4 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredData.length}</span> results found
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Controls - Moved to top */}
        <div className="mb-1 p-1 bg-white border border-gray-200 rounded">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
            </div>
            <div className="flex items-center space-x-3">
              {/* Page Size Selector */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-700">Size:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="border border-gray-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[20, 50, 100].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="h-6 px-2 text-xs"
                >
                  <ChevronFirst className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-6 px-2 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="text-xs font-medium px-1">
                  {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-6 px-2 text-xs"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="h-6 px-2 text-xs"
                >
                  <ChevronLast className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="space-y-2">
          {/* Rotated Column Headers - Independent above table */}
          <div className="bg-gray-50 border border-gray-200 rounded-t-lg">
              <div className="flex" style={{ height: '120px' }}>
                {table.getHeaderGroups()[0].headers.map((header, index) => (
                  <div
                    key={header.id}
                    className="flex items-end justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      width: `${100 / table.getHeaderGroups()[0].headers.length}%`,
                      position: 'relative',
                    }}
                  >
                    <span
                      className="block text-xs font-medium text-gray-500 tracking-wider whitespace-nowrap"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 0,
                        transform: 'translateX(0%) rotate(-45deg)',
                        transformOrigin: 'bottom left',
                        display: 'inline-block',
                      }}
                    >
                      <span className="flex flex-row items-center gap-1">
                        {((columnNames[table.getHeaderGroups()[0].headers.indexOf(header)] || header.id) as string)
                          .replace(/_/g, ' ')
                          .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-3 h-3 flex-shrink-0 text-blue-600" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="w-3 h-3 flex-shrink-0 text-blue-600" />
                        ) : (
                          <ChevronUp className="w-3 h-3 flex-shrink-0 text-gray-300" />
                        )}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto pb-0 mb-0">
            <table className="w-full table-fixed">
              <colgroup>
                {table.getHeaderGroups()[0].headers.map((header, index) => (
                  <col key={header.id} style={{ width: `${100 / table.getHeaderGroups()[0].headers.length}%` }} />
                ))}
              </colgroup>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 cursor-pointer relative"
                    onClick={() => handleGeneClick(row.original['TF Symbol'])}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-2 text-sm text-gray-900 relative">
                        <div className="truncate px-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Bottom */}
          <div className="mt-1 p-1 bg-white border border-gray-200 rounded">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
              </div>
              <div className="flex items-center space-x-3">
                {/* Page Size Selector */}
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-700">Size:</span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="border border-gray-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {[20, 50, 100].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronFirst className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-medium px-1">
                    {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronLast className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Gene Details Modal - REMOVED - Now using page navigation */}
        </div>
      </div>
    </div>
  );
} 