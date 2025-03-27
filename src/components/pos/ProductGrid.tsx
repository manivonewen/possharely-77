
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map((product) => product.category)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
        <div className="relative">
          <button className="secondary-button flex items-center gap-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto py-1">
        <button
          className={`rounded-full px-4 py-1.5 text-sm font-medium button-transition ${
            selectedCategory === null
              ? 'bg-pos-blue text-white'
              : 'bg-pos-gray text-pos-dark hover:bg-pos-gray/80'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap button-transition ${
              selectedCategory === category
                ? 'bg-pos-blue text-white'
                : 'bg-pos-gray text-pos-dark hover:bg-pos-gray/80'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto pr-1 pb-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-item animate-fade-in flex flex-col"
            onClick={() => onProductSelect(product)}
          >
            <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-pos-gray">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-pos-gray text-gray-400">
                  No image
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
            <div className="mt-auto flex items-end justify-between pt-2">
              <span className="text-sm font-semibold text-pos-blue">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full flex h-40 flex-col items-center justify-center text-center text-gray-500">
            <p className="mt-2">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
