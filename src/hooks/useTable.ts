// filepath: src/hooks/useTable.ts
import { useState } from 'react';
import { format } from 'date-fns';

interface UseTableOptions {
  initialSortColumn?: string;
  initialSortDirection?: 'asc' | 'desc';
}

const useTable = <T>(data: T[], options?: UseTableOptions) => {
  const [sortColumn, setSortColumn] = useState<string | null>(options?.initialSortColumn || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(options?.initialSortDirection || 'asc');
  const [showFullDate, setShowFullDate] = useState(false);

  const toggleDateFormat = () => {
    setShowFullDate(!showFullDate);
  };

  const formatDate = (date: Date) => {
    return showFullDate ? format(date, 'dd/MM/yyyy HH:mm') : format(date, 'dd/MM/yyyy');
  };

  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return {
    sortedData,
    handleSort,
    formatDate,
    toggleDateFormat,
    showFullDate,
  };
};

export default useTable;