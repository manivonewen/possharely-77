import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import InventoryOverview from '@/components/dashboard/InventoryOverview';
import { InventoryItem } from '@/lib/types';

const Inventory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen flex-col bg-pos-gray overflow-hidden">
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
              <h2 className="text-lg font-semibold text-pos-dark">Inventory Overview</h2>
              <InventoryOverview items={inventoryData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
