
import React from 'react';
import { Product } from '@/lib/types';
import { Grid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    return `$${amount.toFixed(2)}`;
  };

  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
              {showSku && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">SKU</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {products.map((product) => (
              <tr 
                key={product.id} 
                onClick={() => onProductSelect(product)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatCurrency(product.price)}</td>
                {showSku && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                )}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.map((product) => (
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
      ))}
    </div>
  );
};

export default ProductGrid;
