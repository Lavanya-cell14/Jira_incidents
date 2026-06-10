import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

export default function IntelligenceTable({ columns, data, onRowClick }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                className={onRowClick ? "cursor-pointer hover:bg-gray-50/80" : ""}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className={col.className}>
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
