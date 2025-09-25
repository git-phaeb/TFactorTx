'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, Search, Filter, X, Copy, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TFactorTxData, getTDL } from '@/lib/csv-loader';

// Helper function for column tooltips
const getColumnTooltip = (columnId: string): string => {
  switch (columnId) {
    case 'TF Symbol': return 'Transcription factor gene name. Click entry to view detailed information.';
    case 'sort_disease_ot_ard_aging_overall_rank': return 'Overall rank based on disease associations and aging data. Lower is better.';
    case 'sort_disease_ot_total_assoc_score_rank': return 'Rank based on the sum of Open Targets disease association scores across all diseases linked to this transcription factor.';
    case 'sort_disease_ot_ard_total_assoc_count_score_rank': return 'Rank based on the sum of Open Targets disease association scores across selected age-related diseases (ARDs) linked to this transcription factor.';
    case 'disease_ot_ard_strongest_linked_disease': return 'Age-related disease with highest Open Targets assocation score for this transcription factor.';
    case 'sort_aging_summary_total_db_entries_count_rank': return 'Rank based on number of aging database entries across all species.';
    case 'aging_summary_human': return 'Indicates if any evidence linking this transcription factor to human aging is available across checked databases.';
    case 'aging_summary_mm_influence': return 'Overall conclusion about the influence of this transcription factor on mouse aging, based on evidence across checked databases.';
    case 'aging_summary_ce_influence': return 'Overall conclusion about the influence of this transcription factor on worm aging, based on evidence across checked databases.';
    case 'aging_summary_dm_influence': return 'Overall conclusion about the influence of this transcription factor on fly aging, based on evidence across checked databases.';
    case 'dev_summary_dev_level_category': return 'Drug development level, based on evidence across checked databases.';
    case 'dev_pharos_tcrd_tdl': return 'Target development level (TDL) according to Pharos database.';
    default: return 'Column information and data description';
  }
};

// Separate component that uses useSearchParams
function DatabaseContent() {
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
    'dev_pharos_tcrd_tdl': [],
    'disease_ot_ard_strongest_linked_disease': []
  });
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<{ x: number; y: number } | null>(null);
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);
  const [columnVisibilityPosition, setColumnVisibilityPosition] = useState<{ x: number; y: number } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Column visibility state - working copy and applied copy
  const [workingColumnVisibility, setWorkingColumnVisibility] = useState<Record<string, boolean>>({
    'TF Symbol': true,
    'sort_disease_ot_ard_aging_overall_rank': true,
    'sort_disease_ot_total_assoc_score_rank': true,
    'sort_disease_ot_ard_total_assoc_count_score_rank': true,
    'disease_ot_ard_strongest_linked_disease': true,
    'sort_aging_summary_total_db_entries_count_rank': true,
    'aging_summary_human': true,
    'aging_summary_mm_influence': true,
    'aging_summary_ce_influence': true,
    'aging_summary_dm_influence': true,
    'dev_summary_dev_level_category': true,
    'dev_pharos_tcrd_tdl': true
  });
  
  const [appliedColumnVisibility, setAppliedColumnVisibility] = useState<Record<string, boolean>>({
    'TF Symbol': true,
    'sort_disease_ot_ard_aging_overall_rank': true,
    'sort_disease_ot_total_assoc_score_rank': true,
    'sort_disease_ot_ard_total_assoc_count_score_rank': true,
    'disease_ot_ard_strongest_linked_disease': true,
    'sort_aging_summary_total_db_entries_count_rank': true,
    'aging_summary_human': true,
    'aging_summary_mm_influence': true,
    'aging_summary_ce_influence': true,
    'aging_summary_dm_influence': true,
    'dev_summary_dev_level_category': true,
    'dev_pharos_tcrd_tdl': true
  });

  // URL state management
  const searchParams = useSearchParams();
  const router = useRouter();

  // Update URL with current state
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.replace(newURL, { scroll: false });
  };

  // Parse filters from URL
  const parseFiltersFromURL = (): Record<string, string[]> => {
    const filtersParam = searchParams.get('filters');
    if (!filtersParam) return {};
    
    try {
      const filters: Record<string, string[]> = {};
      filtersParam.split(',').forEach(filter => {
        const [key, value] = filter.split(':');
        if (key && value) {
          if (!filters[key]) filters[key] = [];
          filters[key].push(value);
        }
      });
      return filters;
    } catch (error) {
      console.error('Error parsing filters from URL:', error);
      return {};
    }
  };

  // Serialize filters to URL
  const serializeFiltersToURL = (filters: Record<string, string[]>): string => {
    const filterStrings: string[] = [];
    Object.entries(filters).forEach(([key, values]) => {
      values.forEach(value => {
        filterStrings.push(`${key}:${value}`);
      });
    });
    return filterStrings.join(',');
  };

  // Parse column visibility from URL
  const parseColumnVisibilityFromURL = (): Record<string, boolean> => {
    const visibilityParam = searchParams.get('columns');
    if (!visibilityParam) return {};
    
    try {
      const visibility: Record<string, boolean> = {};
      visibilityParam.split(',').forEach(col => {
        const [key, value] = col.split(':');
        if (key && value) {
          visibility[key] = value === 'true';
        }
      });
      return visibility;
    } catch (error) {
      console.error('Error parsing column visibility from URL:', error);
      return {};
    }
  };

  // Serialize column visibility to URL
  const serializeColumnVisibilityToURL = (visibility: Record<string, boolean>): string => {
    const visibilityStrings: string[] = [];
    Object.entries(visibility).forEach(([key, value]) => {
      visibilityStrings.push(`${key}:${value}`);
    });
    return visibilityStrings.join(',');
  };

  // Initialize state from URL on component mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlFilters = parseFiltersFromURL();
    const urlSort = searchParams.get('sort');
    const urlPage = searchParams.get('page');
    const urlPageSize = searchParams.get('pageSize');
    const urlColumns = parseColumnVisibilityFromURL();

    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
    
    if (urlSort) {
      const [sortId, sortDir] = urlSort.split(':');
      setSorting([{ id: sortId, desc: sortDir === 'desc' }]);
    }
    
    if (urlPage) {
      const pageIndex = parseInt(urlPage) - 1;
      // Note: We'll handle pagination URL updates in the table component
    }

    if (urlPageSize) {
      const pageSize = parseInt(urlPageSize);
      // We'll handle page size URL updates in the table component
    }

    if (Object.keys(urlColumns).length > 0) {
      setWorkingColumnVisibility(prev => ({ ...prev, ...urlColumns }));
      setAppliedColumnVisibility(prev => ({ ...prev, ...urlColumns }));
    }
  }, []); // Only run on mount

  // Update URL when state changes
  useEffect(() => {
    if (data.length > 0) { // Only update URL after data is loaded
      const updates: Record<string, string | null> = {};
      
      // Update search
      updates.search = searchTerm || null;
      
      // Update filters
      const hasFilters = Object.values(filters).some(values => values.length > 0);
      updates.filters = hasFilters ? serializeFiltersToURL(filters) : null;
      
      // Update sort
      if (sorting.length > 0) {
        updates.sort = `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`;
      }
      
      // Update column visibility
      const hasHiddenColumns = Object.values(appliedColumnVisibility).some(visible => !visible);
      updates.columns = hasHiddenColumns ? serializeColumnVisibilityToURL(appliedColumnVisibility) : null;
      
      updateURL(updates);
    }
  }, [searchTerm, filters, sorting, appliedColumnVisibility, data.length]);

  // Handle page size URL updates
  const handlePageSizeChange = (pageSize: number) => {
    updateURL({ pageSize: pageSize.toString() });
    // Scroll to top when page size changes to prevent scroll offset issues
    window.scrollTo(0, 0);
  };

  // Handle pagination URL updates
  const handlePageChange = (pageIndex: number) => {
    updateURL({ page: (pageIndex + 1).toString() });
    // Scroll to top when page changes to prevent scroll offset issues
    window.scrollTo(0, 0);
  };

  // Handle search term change
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    
    // Generate suggestions based on search term
    if (newSearchTerm.length >= 1) {
      const geneNames = data.map(row => row['TF Symbol']).filter(Boolean);
      const filteredSuggestions = geneNames
        .filter(name => name.toLowerCase().startsWith(newSearchTerm.toLowerCase()))
        .sort() // Sort alphabetically
        .slice(0, 8); // Limit to 8 suggestions
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  // Handle copy gene name
  const handleCopyGene = async (geneSymbol: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(geneSymbol);
      // Optional: Show a brief success message
      console.log(`Copied ${geneSymbol} to clipboard`);
    } catch (err) {
      console.error('Failed to copy gene name:', err);
    }
  };

  // Handle export data - completely rewritten
  const handleExportData = () => {
    // Get the data that should be exported based on current state
    let dataToExport;
    
    if (searchTerm.trim() === '' && Object.values(filters).every(f => f.length === 0)) {
      // No filters - export all data
      dataToExport = [...data]; // Create a copy of all data
    } else {
      // Has filters - export filtered data
      dataToExport = [...filteredData]; // Create a copy of filtered data
    }

    // Apply current sorting to the export data
    if (sorting.length > 0) {
      const sortConfig = sorting[0];
      dataToExport.sort((a, b) => {
        const aVal = a[sortConfig.id as keyof TFactorTxData];
        const bVal = b[sortConfig.id as keyof TFactorTxData];
        
        // Handle numeric values
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.desc ? bVal - aVal : aVal - bVal;
        }
        
        // Handle string values
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        return sortConfig.desc ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      });
    }

    // Create dynamic column mapping based on current visibility settings
    const columnMapping = [
      { key: 'TF Symbol', header: 'Gene Name', visible: appliedColumnVisibility['TF Symbol'] },
      { key: 'sort_disease_ot_ard_aging_overall_rank', header: 'Overall Rank', visible: appliedColumnVisibility['sort_disease_ot_ard_aging_overall_rank'] },
      { key: 'sort_disease_ot_total_assoc_score_rank', header: 'All Diseases Rank', visible: appliedColumnVisibility['sort_disease_ot_total_assoc_score_rank'] },
      { key: 'sort_disease_ot_ard_total_assoc_count_score_rank', header: 'ARDs Rank', visible: appliedColumnVisibility['sort_disease_ot_ard_total_assoc_count_score_rank'] },
      { key: 'disease_ot_ard_strongest_linked_disease', header: 'Strongest Linked ARD', visible: appliedColumnVisibility['disease_ot_ard_strongest_linked_disease'] },
      { key: 'sort_aging_summary_total_db_entries_count_rank', header: 'Aging Rank', visible: appliedColumnVisibility['sort_aging_summary_total_db_entries_count_rank'] },
      { key: 'aging_summary_human', header: 'Human Link Y/N', visible: appliedColumnVisibility['aging_summary_human'] },
      { key: 'aging_summary_mm_influence', header: 'M. musculus Link', visible: appliedColumnVisibility['aging_summary_mm_influence'] },
      { key: 'aging_summary_ce_influence', header: 'C. elegans Link', visible: appliedColumnVisibility['aging_summary_ce_influence'] },
      { key: 'aging_summary_dm_influence', header: 'D. melanogaster Link', visible: appliedColumnVisibility['aging_summary_dm_influence'] },
      { key: 'dev_summary_dev_level_category', header: 'Development Level', visible: appliedColumnVisibility['dev_summary_dev_level_category'] },
      { key: 'dev_pharos_tcrd_tdl', header: 'Pharos TDL', visible: appliedColumnVisibility['dev_pharos_tcrd_tdl'] }
    ];

    // Filter to only visible columns
    const visibleColumns = columnMapping.filter(col => col.visible);

    console.log('Export info:', {
      totalEntries: dataToExport.length,
      searchTerm: searchTerm,
      hasFilters: Object.values(filters).some(f => f.length > 0),
      sorting: sorting,
      visibleColumns: visibleColumns.length,
      hiddenColumns: columnMapping.length - visibleColumns.length,
      firstEntry: dataToExport[0]?.['TF Symbol'],
      lastEntry: dataToExport[dataToExport.length - 1]?.['TF Symbol']
    });

    // Convert to CSV format
    const csvRows = [];
    
    // Add header row with only visible columns
    const headers = visibleColumns.map(col => col.header);
    csvRows.push(headers.join(','));

    // Add data rows with only visible columns
    dataToExport.forEach(row => {
      const values = visibleColumns.map(col => row[col.key as keyof TFactorTxData]);
      
      // Escape CSV values
      const escapedValues = values.map(value => {
        const strValue = String(value || '');
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      });
      
      csvRows.push(escapedValues.join(','));
    });

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Create unique filename
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const filename = `TFactorTx_Data_${timestamp}.csv`;

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
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
    setSearchTerm('');
  };

  const toggleColumnVisibility = (columnId: string) => {
    // Prevent hiding required columns
    if (columnId === 'TF Symbol' || columnId === 'sort_disease_ot_ard_aging_overall_rank') {
      return;
    }
    setWorkingColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const applyColumnVisibility = () => {
    setAppliedColumnVisibility(workingColumnVisibility);
    setShowColumnVisibility(false);
    setColumnVisibilityPosition(null);
  };

  const resetColumnVisibility = () => {
    const defaultVisibility = {
      'TF Symbol': true,
      'sort_disease_ot_ard_aging_overall_rank': true,
      'sort_disease_ot_total_assoc_score_rank': true,
      'sort_disease_ot_ard_total_assoc_count_score_rank': true,
      'disease_ot_ard_strongest_linked_disease': true,
      'sort_aging_summary_total_db_entries_count_rank': true,
      'aging_summary_human': true,
      'aging_summary_mm_influence': true,
      'aging_summary_ce_influence': true,
      'aging_summary_dm_influence': true,
      'dev_summary_dev_level_category': true,
      'dev_pharos_tcrd_tdl': true
    };
    setWorkingColumnVisibility(defaultVisibility);
    setAppliedColumnVisibility(defaultVisibility);
  };



  // Viridis color palette hex values (inverted for warmer colors for lower ranks)
  // From dark purple (best) -> blue -> teal -> green -> bright yellow (worst)
  const viridisColors = [
    '#440154', // Dark purple (best rank)
    '#482878', // Purple
    '#3e4989', // Dark blue-purple
    '#31688e', // Blue-purple
    '#26828e', // Blue-teal
    '#1f9e89', // Teal
    '#35b779', // Green-teal
    '#6ece58', // Green
    '#b5de2b', // Light green
    '#fde725'  // Bright yellow (worst rank)
  ];

  // Memoized rank color cache - recalculates only when data changes
  const rankColorCache = useMemo(() => {
    const cache = new Map<string, Map<number | string, string>>();
    
    // Process each rank column
    const rankColumns = ['sort_disease_ot_total_assoc_score_rank', 'sort_disease_ot_ard_total_assoc_count_score_rank', 'sort_aging_summary_total_db_entries_count_rank'];
    
    rankColumns.forEach(columnKey => {
      const columnCache = new Map<number | string, string>();
      
      // Get unique rank values for this column
      const columnRanks = data
        .map(row => row[columnKey as keyof TFactorTxData])
        .filter(val => val !== '#NA' && val !== null && val !== undefined && !isNaN(Number(val)))
        .map(val => Number(val))
        .sort((a, b) => a - b);
      
      // Remove duplicates and get min/max
      const uniqueRanks = [...new Set(columnRanks)];
      const minRank = Math.min(...uniqueRanks);
      const maxRank = Math.max(...uniqueRanks);
      
      // Pre-calculate colors for all possible rank values
      data.forEach(row => {
        const rank = row[columnKey as keyof TFactorTxData];
        
        // Handle #NA or invalid values
        if (rank === '#NA' || rank === null || rank === undefined || isNaN(Number(rank))) {
          columnCache.set(rank, '#d3d3d3'); // Light grey for #NA values
          return;
        }
        
        const rankNum = Number(rank);
        
        // Normalize rank to 0-1 range within this column's range
        // Invert so lower ranks (worse) get warmer colors
        const normalized = uniqueRanks.length > 1 
          ? Math.max(0, Math.min(1, (rankNum - minRank) / (maxRank - minRank)))
          : 0; // If all values are the same, use 0
        
        // Map normalized value to color index
        const colorIndex = Math.min(
          Math.floor(normalized * (viridisColors.length - 1)),
          viridisColors.length - 1
        );
        
        columnCache.set(rank, viridisColors[colorIndex]);
      });
      
      cache.set(columnKey, columnCache);
    });
    
    return cache;
  }, [data]);

  // Optimized function to get gradient color based on rank using cached values
  const getRankColor = (rank: number | string, columnKey: string) => {
    const columnCache = rankColorCache.get(columnKey);
    if (columnCache) {
      return columnCache.get(rank) || '#d3d3d3';
    }
    return '#d3d3d3'; // Fallback
  };

  // Get unique values for a column
  const getUniqueValues = (columnKey: string) => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = row[columnKey as keyof TFactorTxData];
      if (value && value !== '#NA') {
        // Use the raw value without any processing
        const rawValue = value.toString();
        if (rawValue) {
          values.add(rawValue);
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
      if (uniqueValues.includes('None')) orderedValues.push('None');
      
      // Add any other values that might exist but weren't in our predefined order
      const remainingValues = uniqueValues.filter(val => 
        !['Tclin', 'Tchem', 'Tbio', 'Tdark', 'None'].includes(val)
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
      if (showColumnVisibility && !target.closest('[data-column-visibility-popup]')) {
        setShowColumnVisibility(false);
        setColumnVisibilityPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter, showColumnVisibility]);

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

  // Ensure page scrolls to top on mount and when page size changes
  useEffect(() => {
    // Scroll to top when component mounts or when page size changes
    window.scrollTo(0, 0);
  }, []);







  // Column definitions
  const rankSortingFn = (rowA: any, rowB: any, columnId: string) => {
    const getNum = (row: any) => {
      const v = row.getValue(columnId);
      const n = Number(v);
      return isNaN(n) ? Number.POSITIVE_INFINITY : n;
    };
    const aNum = getNum(rowA);
    const bNum = getNum(rowB);

    if (aNum < bNum) return -1;
    if (aNum > bNum) return 1;

    // Tie-breaker: alphabetical by TF Symbol (case-insensitive)
    const aName = String(rowA.original['TF Symbol'] || '').toLowerCase();
    const bName = String(rowB.original['TF Symbol'] || '').toLowerCase();
    return aName.localeCompare(bName);
  };

  const columns = useMemo<ColumnDef<TFactorTxData>[]>(() => [
    {
      accessorKey: 'TF Symbol',
      header: columnNames[0] || 'Gene Name',
      enableSorting: true,
      cell: ({ row }) => {
        const geneSymbol = row.getValue('TF Symbol') as string;
        return (
          <div className="flex items-center space-x-1 group w-full">
            <div
              className="text-sm font-medium cursor-pointer hover:text-blue-800 truncate"
              style={{ color: '#31688e', maxWidth: 'calc(100% - 24px)' }}
              onClick={() => handleGeneClick(geneSymbol)}
              title={geneSymbol}
            >
              {geneSymbol}
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded flex-shrink-0"
              onClick={(e) => handleCopyGene(geneSymbol, e)}
              title={`Copy ${geneSymbol}`}
            >
              <Copy className="w-3 h-3 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: 'sort_disease_ot_ard_aging_overall_rank',
      header: columnNames[1] || 'Overall Rank',
      sortingFn: rankSortingFn,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium truncate" title={getValue() as string}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: 'sort_disease_ot_total_assoc_score_rank',
      header: columnNames[2] || 'All Diseases Rank',
      sortingFn: rankSortingFn,
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
      sortingFn: rankSortingFn,
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
      enableSorting: false,
      cell: ({ getValue }) => {
        const disease = getValue() as string;
        const displayText = disease === '#NA' ? 'Unknown' : disease;
        
        if (displayText === 'None') {
          return (
            <span className="text-xs text-gray-400 font-normal">
              None
            </span>
          );
        }
        
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
      sortingFn: rankSortingFn,
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
        const isNone = human === 'None';
        
        if (isNone) {
          return (
            <span className="text-xs text-gray-400 font-normal pl-2">
              None
            </span>
          );
        }
        
        // Use viridis colors: purple for positive, yellow for negative
        const bgColor = isPositive ? 'bg-[#440154]' : 'bg-[#fde725]';
        const textColor = isPositive ? 'text-white' : 'text-gray-800';
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
        const isNone = influence === 'None';
        
        if (isNone) {
          return (
            <span className="text-xs text-gray-400 font-normal pl-2">
              None
            </span>
          );
        }
        
        // Use viridis colors: purple for pro-longevity, yellow for anti-longevity, teal for unclear
        const bgColor = isProLongevity ? 'bg-[#440154]' : isAntiLongevity ? 'bg-[#fde725]' : 'bg-[#1f9e89]';
        const textColor = isProLongevity ? 'text-white' : isAntiLongevity ? 'text-gray-800' : 'text-white';
        const isUnclear = !isProLongevity && !isAntiLongevity && !isNone;
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap ${isUnclear ? 'w-[60px] flex items-center justify-center' : ''}`} title={influence}>
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
        const isNone = influence === 'None';
        
        if (isNone) {
          return (
            <span className="text-xs text-gray-400 font-normal pl-2">
              None
            </span>
          );
        }
        
        // Use viridis colors: purple for pro-longevity, yellow for anti-longevity, teal for unclear
        const bgColor = isProLongevity ? 'bg-[#440154]' : isAntiLongevity ? 'bg-[#fde725]' : 'bg-[#1f9e89]';
        const textColor = isProLongevity ? 'text-white' : isAntiLongevity ? 'text-gray-800' : 'text-white';
        const isUnclear = !isProLongevity && !isAntiLongevity && !isNone;
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap ${isUnclear ? 'w-[60px] flex items-center justify-center' : ''}`} title={influence}>
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
        const isNone = influence === 'None';
        
        if (isNone) {
          return (
            <span className="text-xs text-gray-400 font-normal pl-2">
              None
            </span>
          );
        }
        
        // Use viridis colors: purple for pro-longevity, yellow for anti-longevity, teal for unclear
        const bgColor = isProLongevity ? 'bg-[#440154]' : isAntiLongevity ? 'bg-[#fde725]' : 'bg-[#1f9e89]';
        const textColor = isProLongevity ? 'text-white' : isAntiLongevity ? 'text-gray-800' : 'text-white';
        const isUnclear = !isProLongevity && !isAntiLongevity && !isNone;
        return (
          <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-md border border-transparent whitespace-nowrap ${isUnclear ? 'w-[60px] flex items-center justify-center' : ''}`} title={influence}>
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
        const isNone = category === 'None';
        
        if (isNone) {
          return (
            <span className="text-xs text-gray-400 font-normal pl-2">
              None
            </span>
          );
        }
        
        // Use viridis colors: purple for high, teal for medium, green for medium to low, yellow for low
        const getVariant = (cat: string) => {
          if (cat.includes('High')) return 'bg-[#440154] text-white';
          if (cat.includes('Medium to Low')) return 'bg-[#35b779] text-white';
          if (cat.includes('Medium')) return 'bg-[#1f9e89] text-white';
          if (cat.includes('Low')) return 'bg-[#fde725] text-gray-800';
          return 'bg-[#fde725] text-gray-800';
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
        
        if (tdl === 'None') {
          return (
            <span 
              className="text-xs font-normal pl-2" 
              style={{ color: '#9ca3af', fontWeight: 'normal' }}
            >
              None
            </span>
          );
        }
        
        // Use black text for all other values (Tclin, Tchem, Tbio, etc.)
        return (
          <span 
            className="text-xs font-normal pl-2"
            style={{ color: '#000000' }}
          >
            {tdl}
          </span>
        );
      }
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
        filters['dev_pharos_tcrd_tdl'].includes(row['dev_pharos_tcrd_tdl'] || '');
      
      const diseaseMatch = !filters['disease_ot_ard_strongest_linked_disease'] || filters['disease_ot_ard_strongest_linked_disease'].length === 0 || 
        filters['disease_ot_ard_strongest_linked_disease'].includes((row['disease_ot_ard_strongest_linked_disease'] || '').trim());
      
      return symbolMatch && humanMatch && mmMatch && ceMatch && dmMatch && devMatch && tdlMatch && diseaseMatch;
    });
  }, [data, searchTerm, filters]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility: appliedColumnVisibility,
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
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
        <div className="container mx-auto px-4 pt-4 pb-0 mb-8">
          {/* Filter Options Skeleton */}
          <div className="mb-2 p-2 bg-white border-2 border-gray-300 rounded-md" style={{ minHeight: '48px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-1" style={{ maxWidth: 'fit-content', minWidth: '220px' }}>
                  <div className="h-8 bg-gray-200 rounded-md animate-pulse" style={{ width: '220px' }}></div>
                </div>
                <div className="flex items-center" style={{ width: '140px', flexShrink: 0 }}>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '100px' }}></div>
                </div>
              </div>
              
              {/* Export Button Skeleton */}
              <div className="flex items-center" style={{ width: '80px', flexShrink: 0 }}>
                <div className="h-7 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
              
              {/* Column Visibility Toggle Skeleton */}
              <div className="flex items-center" style={{ width: '100px', flexShrink: 0 }}>
                <div className="h-7 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
              
              {/* Clear All Filters Button Skeleton */}
              <div className="flex items-center" style={{ width: '120px', flexShrink: 0 }}>
                <div className="h-7 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
              
              {/* Viridis Legend Skeleton */}
              <div className="flex items-center space-x-2" style={{ flexShrink: 0 }}>
                <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '80px' }}></div>
                <div className="flex items-center space-x-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-4 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '30px' }}></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '10px' }}></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '40px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Controls Skeleton */}
          <div className="mb-2 p-1 bg-white border-2 border-gray-300 rounded-md">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '120px' }}></div>
              <div className="flex items-center space-x-3 flex-nowrap">
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '60px' }}></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '50px' }}></div>
                </div>
                <div className="flex items-center space-x-1 flex-nowrap">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '24px' }}></div>
                  ))}
                  <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '40px' }}></div>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '24px' }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="space-y-2">
            {/* Table Skeleton */}
            <div className="overflow-x-auto border-2 border-gray-300 rounded-md">
              <div className="w-full">
                {/* Table Header Skeleton */}
                <div className="bg-white">
                  {/* Rotated Headers Row Skeleton */}
                  <div className="flex" style={{ height: '124px' }}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="flex-1 border-r border-gray-200 p-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80px' }}></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Functional Headers Row Skeleton */}
                  <div className="flex" style={{ backgroundColor: '#31688e', height: '32px' }}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="flex-1 border-r border-gray-200 p-1">
                        <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto" style={{ width: '20px' }}></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Table Body Skeleton */}
                <div>
                  {[...Array(20)].map((_, rowIndex) => (
                    <div key={rowIndex} className={`flex ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`} style={{ height: '24px' }}>
                      {[...Array(12)].map((_, colIndex) => (
                        <div key={colIndex} className="flex-1 border-r border-gray-200 p-1">
                          <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '60px' }}></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Pagination Controls Skeleton */}
            <div className="p-1 bg-white border-2 border-gray-300 rounded-md">
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '120px' }}></div>
                <div className="flex items-center space-x-3 flex-nowrap">
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '60px' }}></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '50px' }}></div>
                  </div>
                  <div className="flex items-center space-x-1 flex-nowrap">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '24px' }}></div>
                    ))}
                    <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '40px' }}></div>
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '24px' }}></div>
                    ))}
                  </div>
                </div>
              </div>
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
      <div className="container mx-auto px-4 pt-4 pb-0 mb-8">

        {/* Filter Options - Horizontal Layout */}
        <div className="mb-2 p-2 bg-white border-2 border-gray-300 rounded-md" style={{ minHeight: '48px' }}>
          <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                <div className="flex-1" style={{ maxWidth: 'fit-content', minWidth: '220px' }}>
                  <div className="relative" style={{ minHeight: '32px', width: '220px' }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by TF Symbol..."
                      value={searchTerm}
                      onChange={e => handleSearchChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => searchTerm.length >= 1 && suggestions.length > 0 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-9 pr-4 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      style={{ width: '220px', minWidth: '220px', maxWidth: '220px' }}
                    />
                    
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div 
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
                        style={{ position: 'absolute', zIndex: 1000 }}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside dropdown
                      >
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={suggestion}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                              index === selectedSuggestionIndex ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking suggestion
                          >
                            <span className="font-medium" style={{ color: '#31688e' }}>
                              {suggestion}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              <div className="flex items-center" style={{ width: '140px', flexShrink: 0 }}>
                <div className="text-sm text-gray-600 text-right w-full">
                  <span className="font-medium">{filteredData.length}</span> results found
                </div>
              </div>
            </div>
            
            {/* Export Button */}
            <div className="flex items-center" style={{ width: '80px', flexShrink: 0 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="text-xs px-3 py-1 h-7 flex items-center space-x-1 w-full"
                title="Export current data as CSV"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </Button>
            </div>
            
            {/* Column Visibility Toggle */}
            <div className="flex items-center" style={{ width: '100px', flexShrink: 0 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setColumnVisibilityPosition({ x: rect.left, y: rect.bottom + 5 });
                  setShowColumnVisibility(!showColumnVisibility);
                }}
                className="text-xs px-3 py-1 h-7 flex items-center space-x-1 w-full"
                title="Toggle column visibility"
              >
                <Eye className="w-3 h-3" />
                <span>Columns</span>
              </Button>
            </div>
            
            {/* Clear All Filters Button */}
            <div className="flex items-center" style={{ width: '120px', flexShrink: 0 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs px-3 py-1 h-7 flex items-center space-x-1 w-full"
                disabled={searchTerm.trim() === '' && Object.values(filters).every(f => f.length === 0)}
                title="Clear all filters"
              >
                <X className="w-3 h-3" />
                <span>Clear Filters</span>
              </Button>
            </div>
            
            {/* Viridis Legend */}
            <div className="flex items-center space-x-2" style={{ flexShrink: 0 }}>
              <div className="text-xs text-gray-600 font-medium">Rank Scale:</div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#440154' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#482878' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#3e4989' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#31688e' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#26828e' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#1f9e89' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#35b779' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#6ece58' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#b5de2b' }}></div>
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#fde725' }}></div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <span>Best</span>
                <span>→</span>
                <span>Worst</span>
              </div>
            </div>
          </div>
        </div>

                 {/* Pagination Controls - Moved to top */}
         <div className="mb-2 p-1 bg-white border-2 border-gray-300 rounded-md">
           <div className="flex items-center justify-between">
             <div className="text-xs text-gray-600 pl-2" style={{ width: '120px', flexShrink: 0 }}>
               {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
             </div>
            <div className="flex items-center space-x-3 flex-nowrap">
                {/* Page Size Selector */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <span className="text-xs text-gray-700">Page Size:</span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                      const newPageSize = Number(e.target.value);
                      table.setPageSize(newPageSize);
                      handlePageSizeChange(newPageSize);
                    }}
                    className="h-6 px-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[20, 50, 100].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>

              {/* Page Navigation */}
              <div className="flex items-center space-x-1 flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.setPageIndex(0);
                    handlePageChange(0);
                  }}
                  disabled={!table.getCanPreviousPage()}
                  className="h-6 px-2 text-xs"
                >
                  <ChevronFirst className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.previousPage();
                    handlePageChange(table.getState().pagination.pageIndex - 1);
                  }}
                  disabled={!table.getCanPreviousPage()}
                  className="h-6 px-2 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="text-xs font-medium px-1 whitespace-nowrap" style={{ width: '60px', textAlign: 'center', minWidth: '60px' }}>
                  {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.nextPage();
                    handlePageChange(table.getState().pagination.pageIndex + 1);
                  }}
                  disabled={!table.getCanNextPage()}
                  className="h-6 px-2 text-xs"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.setPageIndex(table.getPageCount() - 1);
                    handlePageChange(table.getPageCount() - 1);
                  }}
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
          <div className="overflow-x-auto border-2 border-gray-300 rounded-md">
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                {table.getHeaderGroups()[0].headers.map((header) => {
                  const columnId = header.column.id;
                  let width = 'auto';
                  
                  // Set widths based on column identity, not position
                  if (columnId === 'TF Symbol') width = '140px';
                  else if (columnId === 'sort_disease_ot_ard_aging_overall_rank') width = '45px';
                  else if (columnId === 'sort_disease_ot_total_assoc_score_rank') width = '30px';
                  else if (columnId === 'sort_disease_ot_ard_total_assoc_count_score_rank') width = '30px';
                  else if (columnId === 'disease_ot_ard_strongest_linked_disease') width = '280px';
                  else if (columnId === 'sort_aging_summary_total_db_entries_count_rank') width = '30px';
                  else if (columnId === 'aging_summary_human') width = '80px';
                  else if (columnId === 'aging_summary_mm_influence') width = '120px';
                  else if (columnId === 'aging_summary_ce_influence') width = '120px';
                  else if (columnId === 'aging_summary_dm_influence') width = '120px';
                  else if (columnId === 'dev_summary_dev_level_category') width = '130px';
                  else if (columnId === 'dev_pharos_tcrd_tdl') width = '80px';
                  
                  return <col key={columnId} style={{ width }} />;
                })}
              </colgroup>
              <thead>
                {/* Rotated Headers Row */}
                <tr className="bg-white">
                  {table.getHeaderGroups()[0].headers.map((header, headerIndex) => (
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
                        <span
                          className="cursor-help"
                          title={getColumnTooltip(header.column.id)}
                        >
                          {header.column.columnDef.header as string}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
                {/* Functional Headers Row */}
                <tr style={{ backgroundColor: '#31688e' }}>
                  {table.getHeaderGroups()[0].headers.map((header, headerIndex) => {
                    // No vertical separators in functional headers row
                    let borderClass = '';
                    
                    return (
                      <th
                        key={header.id}
                        className={`text-left text-sm font-medium text-white ${borderClass}`}
                        style={{
                          padding: '2px'
                        }}
                        onClick={undefined}
                      >
                      <div className="flex items-center justify-start min-h-[32px]">
                        {(() => {
                          const columnId = header.column.id;

                          // Show sorting buttons for gene name column and rank columns
                          if (['TF Symbol', 'sort_disease_ot_ard_aging_overall_rank', 'sort_disease_ot_total_assoc_score_rank', 'sort_disease_ot_ard_total_assoc_count_score_rank', 'sort_aging_summary_total_db_entries_count_rank'].includes(columnId)) {
                            const sortDirection = header.column.getIsSorted();
                            return (
                              <div className="flex items-center justify-center w-full h-full relative p-0">
                                <button
                                  className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center mx-auto ${
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
                                    <ChevronUp className="w-2.5 h-2.5" />
                                  ) : sortDirection === 'desc' ? (
                                    <ChevronDown className="w-2.5 h-2.5" />
                                  ) : (
                                    <ChevronUp className="w-2.5 h-2.5" />
                                  )}
                                </button>
                              </div>
                            );
                          }
                          // Show filter buttons for filterable columns (by identity, not position)
                          if (['aging_summary_human', 'aging_summary_mm_influence', 'aging_summary_ce_influence', 'aging_summary_dm_influence', 'dev_summary_dev_level_category', 'dev_pharos_tcrd_tdl', 'disease_ot_ard_strongest_linked_disease'].includes(columnId)) {
                            const columnKey = columnId;
                            const isOpen = openFilter === columnKey;
                            const activeFilters = filters[columnKey]?.length || 0;
                            
                            return (
                              <div className="relative w-full h-full pl-2" onClick={(e) => e.stopPropagation()}>
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
                                    <span className="absolute top-1/2 -translate-y-1/2 bg-blue-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm leading-none text-center" style={{ left: '36px' }}>
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
                  );
                })}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                    }`}
                    style={{ height: '24px' }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      // Apply background color directly to rank column cells (by identity, not position)
                      const columnId = cell.column.id;
                      const isRankColumn = ['sort_disease_ot_total_assoc_score_rank', 'sort_disease_ot_ard_total_assoc_count_score_rank', 'sort_aging_summary_total_db_entries_count_rank'].includes(columnId);
                      let cellStyle = {};
                      
                      // No border logic needed with spacer columns
                      let borderClass = '';
                      
                      if (isRankColumn) {
                        const rank = cell.getValue() as number;
                        const columnKey = cell.column.id;
                        const color = getRankColor(rank, columnKey);
                        cellStyle = { 
                          backgroundColor: color,
                          border: '1px solid white',
                          padding: '0px',
                          width: '30px',
                          height: '24px',
                          minWidth: '30px',
                          maxWidth: '30px'
                        };
                      }
                      
                      return (
                        <td 
                          key={cell.id} 
                          className={`text-sm ${borderClass}`}
                          style={{
                            ...cellStyle,
                            height: '24px',
                            lineHeight: '24px',
                            verticalAlign: 'middle',
                            padding: isRankColumn ? '0px' : '3px 5px',
                            textAlign: isRankColumn ? 'center' : 'left'
                          }}
                        >
                          {isRankColumn ? (
                            <div 
                              className="w-full h-full flex items-center justify-center"
                              title={`Rank: ${cell.getValue()}`}
                            />
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Column Visibility Popup Portal */}
          {showColumnVisibility && columnVisibilityPosition && (
            <div 
              data-column-visibility-popup
              className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2"
              style={{
                left: `${columnVisibilityPosition.x}px`,
                top: `${columnVisibilityPosition.y}px`,
                maxHeight: '400px',
                overflow: 'hidden',
                minWidth: '200px',
                maxWidth: '250px'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-900">Column Visibility</span>
                <X 
                  className="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => {
                    setShowColumnVisibility(false);
                    setColumnVisibilityPosition(null);
                  }}
                />
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {Object.entries(workingColumnVisibility).map(([columnId, isVisible]) => {
                  const columnNames: Record<string, string> = {
                    'TF Symbol': 'Gene Name',
                    'sort_disease_ot_ard_aging_overall_rank': 'Overall Rank',
                    'sort_disease_ot_total_assoc_score_rank': 'All Diseases Rank',
                    'sort_disease_ot_ard_total_assoc_count_score_rank': 'ARDs Rank',
                    'disease_ot_ard_strongest_linked_disease': 'Strongest Linked ARD',
                    'sort_aging_summary_total_db_entries_count_rank': 'Aging Rank',
                    'aging_summary_human': 'Human Link',
                    'aging_summary_mm_influence': 'M. musculus Link',
                    'aging_summary_ce_influence': 'C. elegans Link',
                    'aging_summary_dm_influence': 'D. melanogaster Link',
                    'dev_summary_dev_level_category': 'Development Level',
                    'dev_pharos_tcrd_tdl': 'Pharos TDL'
                  };
                  
                  const isRequired = columnId === 'TF Symbol' || columnId === 'sort_disease_ot_ard_aging_overall_rank';
                  
                                      return (
                      <label key={columnId} className={`flex items-center space-x-2 text-xs px-1 py-0.5 rounded ${
                        isRequired ? 'cursor-default bg-gray-50' : 'cursor-default bg-gray-50'
                      }`}>
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => toggleColumnVisibility(columnId)}
                          disabled={isRequired}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                        />
                        <span className={`flex-1 truncate ${isRequired ? 'text-gray-500' : 'text-gray-900'}`} title={columnNames[columnId] || columnId}>
                          {columnNames[columnId] || columnId}
                          {isRequired && <span className="text-gray-400 ml-1">(Required)</span>}
                        </span>
                        {isVisible ? (
                          <Eye className="w-3 h-3 text-green-600" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        )}
                      </label>
                    );
                })}
              </div>
              <div className="mt-2 pt-1 border-t border-gray-200 flex justify-between">
                <button
                  onClick={resetColumnVisibility}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={applyColumnVisibility}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

                     {/* Pagination Controls - Bottom */}
           <div className="mt-1 p-1 bg-white border-2 border-gray-300 rounded-md">
             <div className="flex items-center justify-between">
               <div className="text-xs text-gray-600 pl-2" style={{ width: '120px', flexShrink: 0 }}>
                 {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
               </div>
              <div className="flex items-center space-x-3 flex-nowrap">
                {/* Page Size Selector */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <span className="text-xs text-gray-700">Page Size:</span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                      const newPageSize = Number(e.target.value);
                      table.setPageSize(newPageSize);
                      handlePageSizeChange(newPageSize);
                    }}
                    className="h-6 px-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[20, 50, 100].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center space-x-1 flex-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      table.setPageIndex(0);
                      handlePageChange(0);
                    }}
                    disabled={!table.getCanPreviousPage()}
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronFirst className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      table.previousPage();
                      handlePageChange(table.getState().pagination.pageIndex - 1);
                    }}
                    disabled={!table.getCanPreviousPage()}
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-medium px-1 whitespace-nowrap" style={{ width: '60px', textAlign: 'center', minWidth: '60px' }}>
                    {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      table.nextPage();
                      handlePageChange(table.getState().pagination.pageIndex + 1);
                    }}
                    disabled={!table.getCanNextPage()}
                    className="h-6 px-2 text-xs"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      table.setPageIndex(table.getPageCount() - 1);
                      handlePageChange(table.getPageCount() - 1);
                    }}
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

// Main component with Suspense boundary
export default function DatabasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #eff6ff 0%, #eff6ff 60%, #ffffff 100%)' }}>
        <div className="container mx-auto px-4 pt-4 pb-0 mb-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Loading database...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <DatabaseContent />
    </Suspense>
  );
} 