import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

export interface IntelligenceTableColumn<T extends Record<string, unknown>> {
  header: string;
  accessorKey: keyof T & string;
  className?: string;
  cell?: (row: T) => ReactNode;
}

export interface IntelligenceTableProps<T extends Record<string, unknown>> {
  columns: IntelligenceTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export default function IntelligenceTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: IntelligenceTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead key={idx} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className={col.className}>
                    {col.cell ? col.cell(row) : (row[col.accessorKey] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
