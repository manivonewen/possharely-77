import React from 'react';
import { Product } from '@/lib/types';
import { Grid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange?: (mode: string) => void;
  showSku?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductSelect,
  viewMode,
  onViewModeChange,
  showSku = true,
}) => {
  const formatCurrency = (amount: number) => {
    const usd = `$${amount.toFixed(2)}`;
    return `${usd}`;
  };

  if (viewMode === 'table') {
    return (
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              {showSku && (
                <TableHead>SKU</TableHead>
              )}
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showSku ? 4 : 3} className="text-center h-32">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow 
                  key={product.id} 
                  onClick={() => onProductSelect(product)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="font-medium w-3/4">{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  {showSku && (
                    <TableCell>{product.sku}</TableCell>
                  )}
                  <TableCell>{product.category}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
          No products found
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductSelect(product)}
            className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 h-32 w-full rounded-md bg-gray-100 dark:bg-gray-700"></div>
            <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(product.price)}
            </p>
            {showSku && (
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{product.sku}</p>
            )}
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{product.category}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductGrid;
