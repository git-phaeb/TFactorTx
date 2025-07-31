'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, Search, Filter, X } from 'lucide-react';
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
  const [filters, setFilters] = useState<Record<string, string[]>>({
    'aging_summary_human': [],
    'aging_summary_mm_influence': [],
    'aging_summary_ce_influence': [],
    'aging_summary_dm_influence': [],
    'development_level': [],
    'pharos_tdl': []
  });
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<{ x: number; y: number } | null>(null);

  // Handle search term change
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  // Open gene details in new tab
  const handleGeneClick = (geneSymbol: string) => {
    window.open(`/database/${encodeURIComponent(geneSymbol)}`, '_blank');
  };

  // Handle filter changes
  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => {
      const currentFilters = prev[columnKey] || [];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(v => v !== value)
        : [...currentFilters, value];
      return { ...prev, [columnKey]: newFilters };
    });
  };

  // Get unique values for a column
  const getUniqueValues = (columnKey: string) => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = row[columnKey as keyof TFactorTxData];
      if (value && value !== '#NA') {
        // Handle special cases for the last two columns
        if (columnKey === 'dev_summary_dev_level_category') {
          values.add(value.toString());
        } else if (columnKey === 'dev_pharos_tcrd_tdl') {
          const displayText = getTDL(value.toString());
          values.add(displayText);
        } else {
          values.add(value.toString());
        }
      }
    });
    return Array.from(values).sort();
  };



  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openFilter && !(event.target as Element).closest('.filter-popup')) {
        setOpenFilter(null);
        setFilterPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter]);

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
          className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 truncate"
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
        <span className="text-sm font-medium truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'sort_disease_ot_total_assoc_score_rank',
      header: columnNames[2] || 'All Diseases Rank',
      cell: ({ getValue }) => (
        <span className="text-sm truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'sort_disease_ot_ard_total_assoc_count_score_rank',
      header: columnNames[3] || 'ARDs Rank',
      cell: ({ getValue }) => (
        <span className="text-sm truncate" title={getValue() as string}>
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
          <span className="text-xs truncate block" title={displayText}>
            {displayText}
          </span>
        );
      },
    },
    {
      accessorKey: 'sort_aging_summary_total_db_entries_count_rank',
      header: columnNames[5] || 'Aging Rank',
      cell: ({ getValue }) => (
        <span className="text-sm truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'aging_summary_human',
      header: columnNames[6] || 'Human Link Y/N',
      cell: ({ getValue }) => {
        const human = getValue() as string;
        const bgColor = human === 'Y' ? 'bg-blue-600' : 'bg-gray-200';
        const textColor = human === 'Y' ? 'text-white' : 'text-gray-700';
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`}>
            {human === 'Y' ? 'Yes' : 'No'}
          </span>
        );
      },
    },
    {
      accessorKey: 'aging_summary_mm_influence',
      header: columnNames[7] || 'M. musculus Link',
      cell: ({ getValue }) => {
        const influence = getValue() as string;
        if (influence === '#NA') return <span className="text-xs">Unknown</span>;
        if (influence === 'Pro-Longevity' || influence === 'Anti-Longevity') {
          const bgColor = influence === 'Pro-Longevity' ? 'bg-blue-600' : 'bg-red-600';
          const textColor = 'text-white';
          return (
            <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`}>
              {influence}
            </span>
          );
        }
        return (
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap" title={influence}>
            {influence}
          </span>
        );
      },
    },
    {
      accessorKey: 'aging_summary_ce_influence',
      header: columnNames[8] || 'C. elegans Link',
      cell: ({ getValue }) => {
        const influence = getValue() as string;
        if (influence === '#NA') return <span className="text-xs">Unknown</span>;
        if (influence === 'Pro-Longevity' || influence === 'Anti-Longevity') {
          const bgColor = influence === 'Pro-Longevity' ? 'bg-blue-600' : 'bg-red-600';
          const textColor = 'text-white';
          return (
            <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`}>
              {influence}
            </span>
          );
        }
        return (
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap" title={influence}>
            {influence}
          </span>
        );
      },
    },
    {
      accessorKey: 'aging_summary_dm_influence',
      header: columnNames[9] || 'D. melanogaster Link',
      cell: ({ getValue }) => {
        const influence = getValue() as string;
        if (influence === '#NA') return <span className="text-xs">Unknown</span>;
        if (influence === 'Pro-Longevity' || influence === 'Anti-Longevity') {
          const bgColor = influence === 'Pro-Longevity' ? 'bg-blue-600' : 'bg-red-600';
          const textColor = 'text-white';
          return (
            <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`}>
              {influence}
            </span>
          );
        }
        return (
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap" title={influence}>
            {influence}
          </span>
        );
      },
    },
    {
      accessorKey: 'dev_summary_dev_level_category',
      header: columnNames[10] || 'Development Level',
      cell: ({ getValue }) => {
        const category = getValue() as string;
        const getVariant = (cat: string) => {
          if (cat.includes('High')) return 'bg-blue-600 text-white';
          if (cat.includes('Medium')) return 'bg-gray-200 text-gray-700';
          if (cat.includes('Low')) return 'bg-gray-200 text-gray-700';
          return 'bg-gray-200 text-gray-700';
        };
        return (
          <span className={`text-xs ${getVariant(category)} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`} title={category}>
            {category}
          </span>
        );
      },
    },
    {
      accessorKey: 'dev_pharos_tcrd_tdl',
      header: columnNames[11] || 'Pharos TDL',
      cell: ({ getValue }) => {
        const tdl = getValue() as string;
        const getVariant = (tdlVal: string) => {
          if (tdlVal === 'Tclin') return 'bg-blue-600 text-white';
          if (tdlVal === 'Tchem') return 'bg-gray-200 text-gray-700';
          if (tdlVal === 'Tbio') return 'bg-gray-200 text-gray-700';
          return 'bg-gray-200 text-gray-700';
        };
        const displayText = getTDL(tdl);
        return (
          <span className={`text-xs ${getVariant(tdl)} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`} title={displayText}>
            {displayText}
          </span>
        );
      },
    },
  ], [columnNames]);

  // Filter data based on search term and column filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const symbol = row['TF Symbol']?.toString().toLowerCase() || '';
      const symbolMatch = symbol.includes(searchTerm.toLowerCase());
      
      // Apply column filters
      const humanMatch = filters['aging_summary_human'].length === 0 || 
        filters['aging_summary_human'].includes(row['aging_summary_human'] || '');
      const mmMatch = filters['aging_summary_mm_influence'].length === 0 || 
        filters['aging_summary_mm_influence'].includes(row['aging_summary_mm_influence'] || '');
      const ceMatch = filters['aging_summary_ce_influence'].length === 0 || 
        filters['aging_summary_ce_influence'].includes(row['aging_summary_ce_influence'] || '');
      const dmMatch = filters['aging_summary_dm_influence'].length === 0 || 
        filters['aging_summary_dm_influence'].includes(row['aging_summary_dm_influence'] || '');
      const devMatch = filters['development_level'].length === 0 || 
        filters['development_level'].includes(row['dev_summary_dev_level_category'] || '');
      const tdlMatch = filters['pharos_tdl'].length === 0 || 
        filters['pharos_tdl'].includes(row['dev_pharos_tcrd_tdl'] || '');
      
      return symbolMatch && humanMatch && mmMatch && ceMatch && dmMatch && devMatch && tdlMatch;
    });
  }, [data, searchTerm, filters]);

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
                  className="pl-9 pr-4 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
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




          

          {/* Simple Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '120px' }} /> {/* Gene name */}
                <col style={{ width: '60px' }} /> {/* Overall Rank */}
                <col style={{ width: '60px' }} /> {/* All Diseases Rank */}
                <col style={{ width: '60px' }} /> {/* ARDs Rank */}
                <col style={{ width: '350px' }} /> {/* Strongest Linked ARD */}
                <col style={{ width: '60px' }} /> {/* Aging Rank */}
                <col style={{ width: '80px' }} /> {/* Human Link */}
                <col style={{ width: '120px' }} /> {/* M. musculus Link */}
                <col style={{ width: '120px' }} /> {/* C. elegans Link */}
                <col style={{ width: '120px' }} /> {/* D. melanogaster Link */}
                <col style={{ width: '130px' }} /> {/* Development Level */}
                <col style={{ width: '80px' }} /> {/* Pharos TDL */}
              </colgroup>
              <thead>
                <tr className="bg-gray-50">
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 border-b"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center justify-start">
                        {(() => {
                          const headerIndex = table.getHeaderGroups()[0].headers.indexOf(header);
                          // Show sorting buttons for rank columns (indices 1, 2, 3, 5)
                          if ([1, 2, 3, 5].includes(headerIndex)) {
                            return header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-blue-600" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ChevronUp className="w-4 h-4 text-gray-300" />
                            );
                          }
                          // Show filter buttons for the last 6 columns (indices 6-11)
                          if ([6, 7, 8, 9, 10, 11].includes(headerIndex)) {
                            const columnKeys = [
                              'aging_summary_human',
                              'aging_summary_mm_influence', 
                              'aging_summary_ce_influence',
                              'aging_summary_dm_influence',
                              'dev_summary_dev_level_category',
                              'dev_pharos_tcrd_tdl'
                            ];
                            const columnKey = columnKeys[headerIndex - 6];
                            const isOpen = openFilter === columnKey;
                            const activeFilters = filters[columnKey]?.length || 0;
                            
                            return (
                              <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                                <div 
                                  className={`flex items-center justify-center w-8 h-8 rounded-md border-2 cursor-pointer transition-colors ${
                                    isOpen 
                                      ? 'border-blue-500 bg-blue-50' 
                                      : activeFilters > 0 
                                        ? 'border-blue-300 bg-blue-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                  onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setFilterPosition({ x: rect.left, y: rect.bottom + 5 });
                                    setOpenFilter(isOpen ? null : columnKey);
                                  }}
                                >
                                  <Filter className={`w-4 h-4 ${
                                    isOpen ? 'text-blue-600' : activeFilters > 0 ? 'text-blue-500' : 'text-gray-500'
                                  }`} />
                                  {activeFilters > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                      {activeFilters}
                                    </span>
                                  )}
                                </div>

                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 cursor-pointer border-b"
                    onClick={() => handleGeneClick(row.original['TF Symbol'])}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Filter Popup Portal */}
          {openFilter && filterPosition && (
            <div 
              className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg p-3 min-w-56"
              style={{
                left: `${filterPosition.x}px`,
                top: `${filterPosition.y}px`,
                maxHeight: '400px',
                overflow: 'hidden'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">Filter Options</span>
                <X 
                  className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    setOpenFilter(null);
                    setFilterPosition(null);
                  }}
                />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getUniqueValues(openFilter).map(value => (
                  <label key={value} className="flex items-center space-x-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={filters[openFilter]?.includes(value) || false}
                      onChange={() => handleFilterChange(openFilter, value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex-1">{value}</span>
                  </label>
                ))}
              </div>
              {filters[openFilter]?.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, [openFilter]: [] }))}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters ({filters[openFilter]?.length})
                  </button>
                </div>
              )}
            </div>
          )}

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