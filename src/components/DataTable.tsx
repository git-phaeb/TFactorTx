"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DataTableToolbar } from "@/components/data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onGeneClick?: (geneName: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onGeneClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    meta: {
      onGeneClick,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />

      {/* Sorting status indicator */}
      {sorting.length > 0 && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-700">
            Sorted by:{" "}
            {sorting
              .map((s) => `${s.id} (${s.desc ? "Z→A" : "A→Z"})`)
              .join(", ")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSorting([])}
            className="ml-auto h-6 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            Clear sorting
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50/50 hover:bg-gray-50/80 transition-colors"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50/50 transition-colors duration-150 border-b border-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-400">📊</span>
                    </div>
                    <span className="font-medium">No results found</span>
                    <span className="text-sm">
                      Try adjusting your filters or search terms
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4 px-4 bg-gray-50/50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {table.getFilteredRowModel().rows.length} of{" "}
            {table.getCoreRowModel().rows.length} results
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
          >
            ← Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
