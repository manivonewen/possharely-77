
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import InventoryOverview from '@/components/dashboard/InventoryOverview';
import { InventoryItem } from '@/lib/types';
import { Search, Filter, Plus, Edit, Trash } from 'lucide-react';

const Inventory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample inventory data
  const inventoryData: InventoryItem[] = [
    {
      id: '1',
      name: 'Coffee - Americano',
      price: 3.5,
      category: 'Beverages',
      inStock: 25,
      sku: 'BVRG-001',
      costPrice: 1.2,
      reorderPoint: 10,
      supplier: 'Coffee Suppliers Inc.',
      lastRestocked: new Date('2023-04-15'),
    },
    {
      id: '2',
      name: 'Coffee - Latte',
      price: 4.5,
      category: 'Beverages',
      inStock: 8,
      sku: 'BVRG-002',
      costPrice: 1.5,
      reorderPoint: 15,
      supplier: 'Coffee Suppliers Inc.',
      lastRestocked: new Date('2023-04-15'),
    },
    {
      id: '3',
      name: 'Espresso Shot',
      price: 2.5,
      category: 'Beverages',
      inStock: 30,
      sku: 'BVRG-003',
      costPrice: 0.8,
      reorderPoint: 20,
      supplier: 'Coffee Suppliers Inc.',
      lastRestocked: new Date('2023-04-10'),
    },
    {
      id: '4',
      name: 'Croissant',
      price: 3.0,
      category: 'Bakery',
      inStock: 12,
      sku: 'BKY-001',
      costPrice: 1.1,
      reorderPoint: 15,
      supplier: 'City Bakery',
      lastRestocked: new Date('2023-04-18'),
    },
    {
      id: '5',
      name: 'Chocolate Muffin',
      price: 3.5,
      category: 'Bakery',
      inStock: 5,
      sku: 'BKY-002',
      costPrice: 1.3,
      reorderPoint: 10,
      supplier: 'City Bakery',
      lastRestocked: new Date('2023-04-18'),
    },
    {
      id: '6',
      name: 'Bagel with Cream Cheese',
      price: 4.0,
      category: 'Bakery',
      inStock: 4,
      sku: 'BKY-003',
      costPrice: 1.5,
      reorderPoint: 8,
      supplier: 'City Bakery',
      lastRestocked: new Date('2023-04-16'),
    },
    {
      id: '7',
      name: 'Ham and Cheese Sandwich',
      price: 6.5,
      category: 'Food',
      inStock: 0,
      sku: 'FOOD-001',
      costPrice: 2.8,
      reorderPoint: 5,
      supplier: 'Fresh Foods Co.',
      lastRestocked: new Date('2023-04-12'),
    },
    {
      id: '8',
      name: 'Turkey Club Sandwich',
      price: 7.5,
      category: 'Food',
      inStock: 3,
      sku: 'FOOD-002',
      costPrice: 3.2,
      reorderPoint: 5,
      supplier: 'Fresh Foods Co.',
      lastRestocked: new Date('2023-04-12'),
    },
    {
      id: '9',
      name: 'Caesar Salad',
      price: 8.0,
      category: 'Food',
      inStock: 2,
      sku: 'FOOD-003',
      costPrice: 3.5,
      reorderPoint: 3,
      supplier: 'Fresh Foods Co.',
      lastRestocked: new Date('2023-04-14'),
    },
  ];

  // Get unique categories
  const categories = Array.from(new Set(inventoryData.map(item => item.category)));

  // Filter inventory items based on search and category
  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Close sidebar on small screens when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial sidebar state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-pos-gray">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <main
          className={`flex flex-1 flex-col overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : ''
          }`}
        >
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-pos-dark">Inventory Management</h1>
              <p className="text-gray-500">Manage your products and inventory</p>
            </div>
            
            <div className="mb-6">
              <h2 className="section-title">Inventory Overview</h2>
              <InventoryOverview items={inventoryData} />
            </div>
            
            <div className="mt-8">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="section-title mb-0">Product Inventory</h2>
                <button className="primary-button flex items-center gap-2">
                  <Plus size={18} />
                  <span>Add Product</span>
                </button>
              </div>
              
              <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, SKU or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field w-full pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="card-container overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-pos-border">
                    <thead className="bg-pos-gray">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pos-border bg-white">
                      {filteredItems.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium">{item.name}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.sku}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center">
                              <span className={`mr-2 inline-block h-2 w-2 rounded-full ${
                                item.inStock <= 0 
                                  ? 'bg-pos-danger' 
                                  : item.inStock <= item.reorderPoint! 
                                    ? 'bg-amber-500' 
                                    : 'bg-emerald-500'
                              }`}></span>
                              <span className="font-medium">{item.inStock}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-pos-blue/10 text-pos-blue hover:bg-pos-blue/20 button-transition">
                                <Edit size={16} />
                              </button>
                              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-pos-danger/10 text-pos-danger hover:bg-pos-danger/20 button-transition">
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredItems.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
