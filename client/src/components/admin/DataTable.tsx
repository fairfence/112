import { ReactNode, useState, useMemo } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, MoveHorizontal as MoreHorizontal, Search, Filter, Download, Plus, ArrowUpDown } from "lucide-react";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
  description?: string; // For screen readers
}

export interface DataTableAction<T> {
  label: string;
  icon?: any;
  onClick: (row: T) => void;
  variant?: "default" | "destructive" | "outline";
  disabled?: (row: T) => boolean;
  description?: string; // For screen readers
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  searchable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  title?: string;
  description?: string;
  onCreate?: () => void;
  createLabel?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  caption?: string; // Table caption for accessibility
  ariaLabel?: string; // Custom aria-label for the table
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  searchable = true,
  selectable = false,
  onSelectionChange,
  title,
  description,
  onCreate,
  createLabel = "Add New",
  loading = false,
  emptyMessage = "No data available",
  className = "",
  caption,
  ariaLabel
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [announceText, setAnnounceText] = useState("");

  // Generate row IDs
  const dataWithIds = useMemo(() => 
    data.map((row, index) => ({
      ...row,
      __rowId: row.id || `row-${index}`
    }))
  , [data]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return dataWithIds;
    
    return dataWithIds.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [dataWithIds, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: keyof T) => {
    const column = columns.find(col => col.key === key);
    const columnLabel = column?.label || String(key);
    
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      setAnnounceText(`Table sorted by ${columnLabel} in ${sortDirection === "asc" ? "descending" : "ascending"} order`);
    } else {
      setSortKey(key);
      setSortDirection("asc");
      setAnnounceText(`Table sorted by ${columnLabel} in ascending order`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, key: keyof T) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSort(key);
    }
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedData.map(row => row.__rowId));
      setSelectedRows(newSelected);
      onSelectionChange?.(paginatedData);
      setAnnounceText(`All ${paginatedData.length} rows selected`);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
      setAnnounceText("All rows deselected");
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
      setAnnounceText("Row selected");
    } else {
      newSelected.delete(rowId);
      setAnnounceText("Row deselected");
    }
    setSelectedRows(newSelected);
    
    const selectedData = dataWithIds.filter(row => newSelected.has(row.__rowId));
    onSelectionChange?.(selectedData);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(row.__rowId));
  const isIndeterminate = paginatedData.some(row => selectedRows.has(row.__rowId)) && !isAllSelected;

  // Generate table caption
  const tableCaption = caption || `${title || 'Data table'} with ${data.length} ${data.length === 1 ? 'row' : 'rows'}${sortKey ? `, sorted by ${columns.find(col => col.key === sortKey)?.label} ${sortDirection}` : ''}`;

  // Generate aria-label
  const tableAriaLabel = ariaLabel || `${title || 'Data table'} - ${data.length} rows, ${columns.length} columns`;
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 bg-muted animate-pulse rounded" />
              <div className="h-9 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        )}
        <div className="border rounded-lg" role="status" aria-label="Loading table data">
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                {columns.map((col, j) => (
                  <div key={j} className="h-4 bg-muted animate-pulse rounded flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announceText}
      </div>

      {/* Header */}
      {(title || onCreate) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold" id="table-title">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <Badge variant="secondary" aria-live="polite">
                {selectedRows.size} selected
              </Badge>
            )}
            {onCreate && (
              <Button 
                onClick={onCreate} 
                data-testid="button-create-new"
                aria-describedby={title ? "table-title" : undefined}
              >
                <Plus className="h-4 w-4 mr-2" />
                {createLabel}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4" role="toolbar" aria-label="Table controls">
        {searchable && (
          <div className="relative flex-1">
            <Label htmlFor="table-search" className="sr-only">
              Search {title || 'table'}
            </Label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="table-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setAnnounceText(`Searching for: ${e.target.value}`);
              }}
              className="pl-10"
              data-testid="input-search"
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Search across all table columns. Results update as you type.
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Label htmlFor="page-size-select" className="sr-only">
            Rows per page
          </Label>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => {
              setPageSize(Number(value));
              setAnnounceText(`Showing ${value} rows per page`);
            }}
          >
          <SelectTrigger 
            className="w-32" 
            data-testid="select-page-size"
            id="page-size-select"
            aria-label="Rows per page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 rows</SelectItem>
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="25">25 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg" role="region" aria-labelledby={title ? "table-title" : undefined}>
        <Table 
          role="table" 
          aria-label={tableAriaLabel}
          aria-rowcount={data.length}
          aria-describedby={description ? "table-description" : undefined}
        >
          {/* Table Caption */}
          <caption className="sr-only">
            {tableCaption}
          </caption>
          
          <TableHeader>
            <TableRow role="row">
              {selectable && (
                <TableHead 
                  className="w-12" 
                  scope="col"
                  role="columnheader"
                  aria-label="Select all rows"
                >
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(ref) => {
                      if (ref && 'indeterminate' in ref) {
                        (ref as any).indeterminate = isIndeterminate;
                      }
                    }}
                    data-testid="checkbox-select-all"
                    aria-label={`Select all ${paginatedData.length} rows`}
                    aria-describedby="select-all-help"
                  />
                  <div id="select-all-help" className="sr-only">
                    {isAllSelected ? "All rows selected" : isIndeterminate ? "Some rows selected" : "No rows selected"}
                  </div>
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)} 
                  className={column.width ? `w-${column.width}` : ""}
                  scope="col"
                  role="columnheader"
                  aria-sort={
                    sortKey === column.key 
                      ? sortDirection === "asc" ? "ascending" : "descending"
                      : column.sortable ? "none" : undefined
                  }
                >
                  {column.sortable ? (
                    <React.Fragment>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => handleSort(column.key)}
                        onKeyDown={(e) => handleKeyDown(e, column.key)}
                        data-testid={`button-sort-${String(column.key)}`}
                        aria-label={`Sort by ${column.label}${
                          sortKey === column.key 
                            ? `, currently sorted ${sortDirection === "asc" ? "ascending" : "descending"}` 
                            : ""
                        }`}
                        aria-describedby={column.description ? `col-desc-${String(column.key)}` : undefined}
                      >
                        {column.label}
                        {sortKey === column.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="ml-2 h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="ml-2 h-3 w-3" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" aria-hidden="true" />
                        )}
                      </Button>
                      {column.description && (
                        <div id={`col-desc-${String(column.key)}`} className="sr-only">
                          {column.description}
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span aria-describedby={column.description ? `col-desc-${String(column.key)}` : undefined}>
                        {column.label}
                      </span>
                      {column.description && (
                        <div id={`col-desc-${String(column.key)}`} className="sr-only">
                          {column.description}
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead 
                  className="w-16 text-right" 
                  scope="col"
                  role="columnheader"
                  aria-label="Row actions"
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow role="row">
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} 
                  className="h-24 text-center"
                  role="gridcell"
                  aria-colspan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow 
                  key={row.__rowId} 
                  data-testid={`table-row-${row.__rowId}`}
                  role="row"
                  aria-rowindex={rowIndex + 2} // +2 because header is row 1
                  aria-selected={selectedRows.has(row.__rowId)}
                >
                  {selectable && (
                    <TableCell role="gridcell" aria-describedby="select-cell-help">
                      <Checkbox
                        checked={selectedRows.has(row.__rowId)}
                        onCheckedChange={(checked) => handleSelectRow(row.__rowId, checked as boolean)}
                        data-testid={`checkbox-select-row-${row.__rowId}`}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                      <div id="select-cell-help" className="sr-only">
                        Select this row for bulk actions
                      </div>
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell 
                      key={String(column.key)}
                      role="gridcell"
                      aria-describedby={`cell-${String(column.key)}-${row.__rowId}`}
                    >
                      <div id={`cell-${String(column.key)}-${row.__rowId}`} className="sr-only">
                        {column.label}: 
                      </div>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="text-right" role="gridcell">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            data-testid={`button-actions-${row.__rowId}`}
                            aria-label={`Actions for row ${rowIndex + 1}`}
                            aria-haspopup="menu"
                            aria-expanded="false"
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">More actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" role="menu" aria-label="Row actions menu">
                          {actions.map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              role="menuitem"
                              onClick={() => action.onClick(row)}
                              disabled={action.disabled?.(row)}
                              data-testid={`action-${action.label.toLowerCase().replace(/\s+/g, '-')}-${row.__rowId}`}
                              aria-label={action.description || action.label}
                            >
                              {action.icon && <action.icon className="h-4 w-4 mr-2" aria-hidden="true" />}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav 
          className="flex items-center justify-between" 
          role="navigation" 
          aria-label="Table pagination"
        >
          <div className="text-sm text-muted-foreground" aria-live="polite">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = Math.max(1, currentPage - 1);
                setCurrentPage(newPage);
                setAnnounceText(`Moved to page ${newPage}`);
              }}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
              aria-label="Go to previous page"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(page);
                      setAnnounceText(`Moved to page ${page}`);
                    }}
                    data-testid={`button-page-${page}`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = Math.min(totalPages, currentPage + 1);
                setCurrentPage(newPage);
                setAnnounceText(`Moved to page ${newPage}`);
              }}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
              aria-label="Go to next page"
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}