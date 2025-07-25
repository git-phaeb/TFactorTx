import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("font-semibold text-gray-700", className)}>
        {title}
      </div>
    );
  }

  const isSorted = column.getIsSorted();
  const sortDirection = column.getIsSorted();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting()}
        className={cn(
          "group relative h-8 -ml-3 px-2 py-1 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm",
          "border border-transparent hover:border-gray-200",
          "rounded-lg font-medium text-gray-700 hover:text-gray-900",
          isSorted && "bg-blue-50 border-blue-200 text-blue-900 shadow-sm"
        )}
      >
        <div className="flex items-center space-x-1">
          <span className="truncate">{title}</span>

          {/* Simple sorting indicator */}
          <div className="relative ml-1">
            {sortDirection === "desc" ? (
              <ArrowDownIcon className="h-4 w-4 text-blue-600" />
            ) : sortDirection === "asc" ? (
              <ArrowUpIcon className="h-4 w-4 text-blue-600" />
            ) : (
              <CaretSortIcon className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </Button>
    </div>
  );
}
