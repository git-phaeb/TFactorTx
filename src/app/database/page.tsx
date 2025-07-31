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
    'dev_summary_dev_level_category': [],
    'dev_pharos_tcrd_tdl': []
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

  const clearAllFilters = () => {
    setFilters({});
  };

  // Helper function to get gradient color based on rank
  const getRankColor = (rank: number | string, maxRank: number = 1000) => {
    // Handle #NA or invalid values
    if (rank === '#NA' || rank === null || rank === undefined || isNaN(Number(rank))) {
      return '#d3d3d3'; // Light grey for #NA values
    }
    
    const rankNum = Number(rank);
    
    // Normalize rank to 0-1 range (1 is best, maxRank is worst)
    const normalized = Math.max(0, Math.min(1, (rankNum - 1) / (maxRank - 1)));
    
    // Green to darker green gradient (light green to dark green)
    const red = Math.round(50 + (normalized * 100)); // 50-150 range
    const green = Math.round(200 + (normalized * 55)); // 200-255 range  
    const blue = Math.round(50 + (normalized * 100)); // 50-150 range
    
    return `rgb(${red}, ${green}, ${blue})`;
  };

  // Get unique values for a column
  const getUniqueValues = (columnKey: string) => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = row[columnKey as keyof TFactorTxData];
      if (value && value !== '#NA') {
        // Trim whitespace and normalize the value
        const normalizedValue = value.toString().trim();
        if (normalizedValue) {
          values.add(normalizedValue);
        }
      }
    });
    
    // Special handling for Human Link column - dynamic based on actual data
    if (columnKey === 'aging_summary_human') {
      const uniqueValues = Array.from(values);
      // If we have Yes/No values, return them in that order
      if (uniqueValues.includes('Yes') && uniqueValues.includes('No')) {
        return ['Yes', 'No'];
      }
      // If we have Y/N values, return them in that order
      if (uniqueValues.includes('Y') && uniqueValues.includes('N')) {
        return ['Y', 'N'];
      }
      // Otherwise return sorted values
      return uniqueValues.sort();
    }

    // Special handling for Development Level column
    if (columnKey === 'dev_summary_dev_level_category') {
      const uniqueValues = Array.from(values);
      const orderedValues = [];
      
      // Add values in the specified order if they exist
      if (uniqueValues.includes('High')) orderedValues.push('High');
      if (uniqueValues.includes('Medium')) orderedValues.push('Medium');
      if (uniqueValues.includes('Medium to Low')) orderedValues.push('Medium to Low');
      if (uniqueValues.includes('Low')) orderedValues.push('Low');
      if (uniqueValues.includes('None')) orderedValues.push('None');
      
      // Add any other values that might exist but weren't in our predefined order
      const remainingValues = uniqueValues.filter(val => 
        !['High', 'Medium', 'Medium to Low', 'Low', 'None'].includes(val)
      );
      
      return [...orderedValues, ...remainingValues.sort()];
    }

    // Special handling for Pharos TDL column
    if (columnKey === 'dev_pharos_tcrd_tdl') {
      const uniqueValues = Array.from(values);
      const orderedValues = [];
      
      // Add values in the specified order if they exist
      if (uniqueValues.includes('Tclin')) orderedValues.push('Tclin');
      if (uniqueValues.includes('Tchem')) orderedValues.push('Tchem');
      if (uniqueValues.includes('Tbio')) orderedValues.push('Tbio');
      if (uniqueValues.includes('Tdark')) orderedValues.push('Tdark');
      if (uniqueValues.includes('#NA')) orderedValues.push('#NA');
      
      // Add any other values that might exist but weren't in our predefined order
      const remainingValues = uniqueValues.filter(val => 
        !['Tclin', 'Tchem', 'Tbio', 'Tdark', '#NA'].includes(val)
      );
      
      return [...orderedValues, ...remainingValues.sort()];
    }

    // Special handling for aging link columns (M. musculus, C. elegans, D. melanogaster)
    if (columnKey === 'aging_summary_mm_influence' || 
        columnKey === 'aging_summary_ce_influence' || 
        columnKey === 'aging_summary_dm_influence') {
      const uniqueValues = Array.from(values);
      const orderedValues = [];
      
      // Add Pro-Longevity and Anti-Longevity first if they exist
      if (uniqueValues.includes('Pro-Longevity')) orderedValues.push('Pro-Longevity');
      if (uniqueValues.includes('Anti-Longevity')) orderedValues.push('Anti-Longevity');
      
      // Add all other values except None, sorted alphabetically
      const otherValues = uniqueValues.filter(val => 
        !['Pro-Longevity', 'Anti-Longevity', 'None'].includes(val)
      ).sort();
      
      // Add None at the very end if it exists
      if (uniqueValues.includes('None')) {
        return [...orderedValues, ...otherValues, 'None'];
      }
      
      return [...orderedValues, ...otherValues];
    }
    
    return Array.from(values).sort();
  };



  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is on the popup itself or any of its children
      if (openFilter && !target.closest('[data-filter-popup]')) {
        setOpenFilter(null);
        setFilterPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter]);

  // Fetch data from API - dynamically adapts to CSV structure changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Add cache-busting parameter to force reload and get latest CSV data
        const response = await fetch(`/api/csv-data?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log('Loaded column names:', result.columnNames);
        console.log('Data structure adapts to CSV changes automatically');
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
      cell: ({ getValue }) => {
        const rank = getValue() as number;
        return (
          <div 
            className="w-full h-full"
            title={`Rank: ${rank}`}
          />
        );
      },
    },
    {
      accessorKey: 'sort_disease_ot_ard_total_assoc_count_score_rank',
      header: columnNames[3] || 'ARDs Rank',
      cell: ({ getValue }) => {
        const rank = getValue() as number;
        return (
          <div 
            className="w-full h-full"
            title={`Rank: ${rank}`}
          />
        );
      },
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
      cell: ({ getValue }) => {
        const rank = getValue() as number;
        return (
          <div 
            className="w-full h-full"
            title={`Rank: ${rank}`}
          />
        );
      },
    },
    {
      accessorKey: 'aging_summary_human',
      header: columnNames[6] || 'Human Link Y/N',
      cell: ({ getValue }) => {
        const human = getValue() as string;
        // Dynamic styling based on actual values in data
        const isPositive = human === 'Yes' || human === 'Y';
        const bgColor = isPositive ? 'bg-blue-600' : 'bg-gray-200';
        const textColor = isPositive ? 'text-white' : 'text-gray-700';
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`}>
            {human}
          </span>
        );
      },
    },
    {
      accessorKey: 'aging_summary_mm_influence',
      header: columnNames[7] || 'M. musculus Link',
      cell: ({ getValue }) => {
        const influence = getValue() as string;
        // Dynamic styling based on actual values
        const isProLongevity = influence === 'Pro-Longevity';
        const isAntiLongevity = influence === 'Anti-Longevity';
        const bgColor = isProLongevity ? 'bg-blue-600' : isAntiLongevity ? 'bg-red-600' : 'bg-gray-200';
        const textColor = (isProLongevity || isAntiLongevity) ? 'text-white' : 'text-gray-700';
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`} title={influence}>
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
        // Dynamic styling based on actual values
        const isProLongevity = influence === 'Pro-Longevity';
        const isAntiLongevity = influence === 'Anti-Longevity';
        const bgColor = isProLongevity ? 'bg-blue-600' : isAntiLongevity ? 'bg-red-600' : 'bg-gray-200';
        const textColor = (isProLongevity || isAntiLongevity) ? 'text-white' : 'text-gray-700';
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`} title={influence}>
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
        // Dynamic styling based on actual values
        const isProLongevity = influence === 'Pro-Longevity';
        const isAntiLongevity = influence === 'Anti-Longevity';
        const bgColor = isProLongevity ? 'bg-blue-600' : isAntiLongevity ? 'bg-red-600' : 'bg-gray-200';
        const textColor = (isProLongevity || isAntiLongevity) ? 'text-white' : 'text-gray-700';
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`} title={influence}>
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
        return (
          <span className={`text-xs ${getVariant(tdl)} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap`} title={tdl}>
            {tdl}
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
      const humanMatch = !filters['aging_summary_human'] || filters['aging_summary_human'].length === 0 || 
        filters['aging_summary_human'].includes((row['aging_summary_human'] || '').trim());
      const mmMatch = !filters['aging_summary_mm_influence'] || filters['aging_summary_mm_influence'].length === 0 || 
        filters['aging_summary_mm_influence'].includes((row['aging_summary_mm_influence'] || '').trim());
      const ceMatch = !filters['aging_summary_ce_influence'] || filters['aging_summary_ce_influence'].length === 0 || 
        filters['aging_summary_ce_influence'].includes((row['aging_summary_ce_influence'] || '').trim());
      const dmMatch = !filters['aging_summary_dm_influence'] || filters['aging_summary_dm_influence'].length === 0 || 
        filters['aging_summary_dm_influence'].includes((row['aging_summary_dm_influence'] || '').trim());
      const devMatch = !filters['dev_summary_dev_level_category'] || filters['dev_summary_dev_level_category'].length === 0 || 
        filters['dev_summary_dev_level_category'].includes((row['dev_summary_dev_level_category'] || '').trim());
      const tdlMatch = !filters['dev_pharos_tcrd_tdl'] || filters['dev_pharos_tcrd_tdl'].length === 0 || 
        filters['dev_pharos_tcrd_tdl'].includes((row['dev_pharos_tcrd_tdl'] || '').trim());
      
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
            <div className="flex-1" style={{ maxWidth: 'fit-content' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by TF Symbol..."
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="pl-9 pr-4 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  style={{ width: '220px' }}
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
                {/* Rotated Headers Row */}
                <tr className="bg-transparent">
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <th
                      key={`rotated-${header.id}`}
                      className="p-2 text-left text-sm font-medium text-gray-500 border-b"
                      style={{ 
                        height: '124px',
                        verticalAlign: 'bottom',
                        paddingBottom: '4px',
                        paddingLeft: '8px',
                        position: 'relative'
                      }}
                    >
                      <div 
                        className="transform -rotate-45 origin-bottom-left whitespace-nowrap"
                        style={{
                          transform: 'rotate(-45deg)',
                          transformOrigin: 'bottom left',
                          width: 'max-content',
                          minHeight: '20px',
                          overflow: 'visible',
                          textOverflow: 'clip',
                          position: 'absolute',
                          left: '20px',
                          bottom: '4px',
                          padding: '2px'
                        }}
                      >
                        {header.column.columnDef.header as string}
                      </div>
                    </th>
                  ))}
                </tr>
                {/* Functional Headers Row */}
                <tr className="bg-gray-50 border-2 border-red-500">
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left text-sm font-medium text-gray-500 border-b border-2 border-blue-500"
                      style={{
                        padding: '8px'
                      }}
                      onClick={undefined}
                    >
                      <div className="flex items-center justify-start border-2 border-green-500 min-h-[32px]">
                        {(() => {
                          const headerIndex = table.getHeaderGroups()[0].headers.indexOf(header);
                          console.log(`Header ${headerIndex}: ${header.column.columnDef.header} - Width: ${header.getSize()}, Column ID: ${header.column.id}`);
                          // Show sorting buttons for rank columns (indices 1, 2, 3, 5)
                          if ([1, 2, 3, 5].includes(headerIndex)) {
                            const sortDirection = header.column.getIsSorted();
                            return (
                              <div className="flex items-center justify-center w-full h-full border-2 border-purple-500 relative">
                                <div className="absolute top-0 left-0 text-xs text-red-600 font-bold">#{headerIndex}</div>
                                <div className="absolute top-0 right-0 text-xs text-blue-600 font-bold">{header.getSize()}px</div>
                                <button
                                  className={`w-6 h-6 rounded-md border transition-all duration-200 flex items-center justify-center ${
                                    sortDirection 
                                      ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' 
                                      : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    header.column.getToggleSortingHandler()?.(e);
                                  }}
                                >
                                  {sortDirection === 'asc' ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : sortDirection === 'desc' ? (
                                    <ChevronDown className="w-3 h-3" />
                                  ) : (
                                    <ChevronUp className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
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
                              <div className="relative w-full h-full border-2 border-orange-500" onClick={(e) => e.stopPropagation()}>
                                <div className="absolute top-0 left-0 text-xs text-red-600 font-bold">#{headerIndex}</div>
                                <div className="absolute top-0 right-0 text-xs text-blue-600 font-bold">{header.getSize()}px</div>
                                <div 
                                  className={`flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-all duration-200 z-20 ${
                                    isOpen 
                                      ? 'bg-blue-500 text-white shadow-md' 
                                      : activeFilters > 0 
                                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                  }`}
                                  style={{ backgroundColor: isOpen ? '#3b82f6' : activeFilters > 0 ? '#dbeafe' : '#f3f4f6' }}
                                  onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setFilterPosition({ x: rect.left, y: rect.bottom + 5 });
                                    setOpenFilter(isOpen ? null : columnKey);
                                  }}
                                >
                                  <Filter className={`w-3 h-3 ${
                                    isOpen ? 'text-white' : activeFilters > 0 ? 'text-blue-600' : 'text-gray-500'
                                  }`} />
                                  {activeFilters > 0 && (
                                    <span className="absolute top-1/2 -translate-y-1/2 bg-blue-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium shadow-sm" style={{ left: '36px' }}>
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
                    style={{ height: '20px' }}
                    onClick={() => handleGeneClick(row.original['TF Symbol'])}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      // Apply background color directly to rank column cells
                      const rankColumns = [2, 3, 5]; // All Diseases Rank, ARDs Rank, Aging Rank
                      let cellStyle = {};
                      
                      if (rankColumns.includes(cellIndex)) {
                        const rank = cell.getValue() as number;
                        const color = getRankColor(rank);
                        cellStyle = { 
                          backgroundColor: color,
                          border: '1px solid white',
                          padding: '0px'
                        };
                        console.log(`Cell ${cellIndex} (${cell.column.id}):`, rank, 'Color:', color);
                      }
                      
                      return (
                        <td 
                          key={cell.id} 
                          className="text-sm text-gray-900"
                          style={{
                            ...cellStyle,
                            height: '20px',
                            lineHeight: '20px',
                            verticalAlign: 'middle',
                            padding: rankColumns.includes(cellIndex) ? '0px' : '2px 4px'
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clear All Filters Button */}
          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs px-3 py-1 h-7"
              disabled={Object.keys(filters).length === 0 || Object.values(filters).every(f => f.length === 0)}
            >
              Clear All Filters
            </Button>
          </div>

          {/* Filter Popup Portal */}
          {openFilter && filterPosition && (
            <div 
              data-filter-popup
              className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2"
              style={{
                left: `${filterPosition.x}px`,
                top: `${filterPosition.y}px`,
                maxHeight: '300px',
                overflow: 'hidden',
                minWidth: 'fit-content',
                maxWidth: '280px'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-900">Filter</span>
                <X 
                  className="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    setOpenFilter(null);
                    setFilterPosition(null);
                  }}
                />
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {getUniqueValues(openFilter).map(value => (
                  <label key={value} className="flex items-center space-x-2 text-xs cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded">
                    <input
                      type="checkbox"
                      checked={filters[openFilter]?.includes(value) || false}
                      onChange={() => handleFilterChange(openFilter, value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                    />
                    <span className="flex-1 truncate" title={value}>{value}</span>
                  </label>
                ))}
              </div>
              {filters[openFilter]?.length > 0 && (
                <div className="mt-2 pt-1 border-t border-gray-200">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, [openFilter]: [] }))}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear ({filters[openFilter]?.length})
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