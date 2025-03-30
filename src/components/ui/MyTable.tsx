// filepath: src/components/MyTable.tsx
import React, { useState } from 'react';
import {
  useTable,
  ColumnDef,
  flexRender,
  CellContext,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import MyTable from '@/components/ui/MyTable';

interface MyTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

function MyTable<T extends object>({ data, columns }: MyTableProps<T>) {
  const [showFullDate, setShowFullDate] = useState(false);

  const toggleDateFormat = () => {
    setShowFullDate(!showFullDate);
  };

  const table = useTable({
    data,
    columns,
    globalFilter: true, // Enable global filter
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} onClick={header.column.id === 'createdAt' ? toggleDateFormat : header.column.getToggleSortingHandler()}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {/* Add sorting indicator */}
                {header.column.getIsSorted()
                  ? header.column.getIsSorted() === 'desc'
                    ? ' 🔽'
                    : ' 🔼'
                  : ''}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MyTable;