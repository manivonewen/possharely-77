
import React from 'react';
import { InventoryItem } from '@/lib/types';

interface InventoryOverviewProps {
  items: InventoryItem[];
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({ items }) => {
  // Calculate inventory overview stats
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.costPrice || 0) * item.inStock, 0);
  const lowStockItems = items.filter(item => 
    item.reorderPoint !== undefined && item.inStock <= item.reorderPoint
  );
  
  // Sort low stock items by stock level (ascending)
  const sortedLowStockItems = [...lowStockItems].sort((a, b) => {
    // Calculate percentage of stock relative to reorder point
    const aPercentage = a.reorderPoint ? a.inStock / a.reorderPoint : 0;
    const bPercentage = b.reorderPoint ? b.inStock / b.reorderPoint : 0;
    return aPercentage - bPercentage;
  }).slice(0, 5); // Take top 5 lowest stock items
  
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="grid gap-4 grid-cols-3 lg:col-span-3">
        <div className="card-container p-5">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="mt-1 text-2xl font-semibold">{totalItems}</p>
        </div>
        
        <div className="card-container p-5">
          <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
          <p className="mt-1 text-2xl font-semibold">${totalValue.toFixed(2)}</p>
        </div>
        
        <div className="card-container p-5">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="mt-1 text-2xl font-semibold">{lowStockItems.length}</p>
        </div>
      </div>
      
      <div className="card-container p-5 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
        </div>
        
        {sortedLowStockItems.length > 0 ? (
          <div className="divide-y divide-pos-border">
            {sortedLowStockItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">SKU: {item.sku || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-medium">{item.inStock} left</p>
                      <p className="text-xs text-gray-500">
                        Reorder at: {item.reorderPoint}
                      </p>
                    </div>
                    <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          item.inStock <= (item.reorderPoint || 0) * 0.5 
                            ? 'bg-pos-danger'
                            : 'bg-amber-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (item.inStock / (item.reorderPoint || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No low stock items to display</p>
          </div>
        )}
      </div>
      
      <div className="card-container p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Inventory Status</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">In Stock</span>
            <span className="text-sm font-medium">
              {items.filter(item => item.inStock > 0).length} items
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Out of Stock</span>
            <span className="text-sm font-medium">
              {items.filter(item => item.inStock === 0).length} items
            </span>
          </div>
          
          <div className="pt-3 border-t border-pos-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Stock Health</span>
              <span className="text-xs text-gray-500">
                {Math.round(
                  (items.filter(item => item.inStock > 0).length / totalItems) * 100
                )}% in stock
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pos-blue"
                style={{ 
                  width: `${
                    (items.filter(item => item.inStock > 0).length / totalItems) * 100
                  }%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
