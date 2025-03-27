
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SalesSummary from '@/components/dashboard/SalesSummary';
import { SalesSummary as SalesSummaryType, DailySales } from '@/lib/types';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample data for sales summary
  const salesSummaryData: SalesSummaryType = {
    totalSales: 15420.75,
    totalOrders: 423,
    averageOrder: 36.46,
    topProducts: [
      { product: 'Coffee - Latte', quantity: 187, revenue: 841.50 },
      { product: 'Croissant', quantity: 145, revenue: 435.00 },
      { product: 'Ham and Cheese Sandwich', quantity: 98, revenue: 637.00 },
      { product: 'Turkey Club Sandwich', quantity: 87, revenue: 652.50 },
      { product: 'Espresso Shot', quantity: 85, revenue: 212.50 },
    ],
    periodComparison: {
      current: 15420.75,
      previous: 14356.22,
      percentageChange: 7.4,
    },
  };

  // Sample data for sales chart
  const dailySalesData: DailySales[] = [
    { date: 'Mon', total: 1890.50, orders: 52 },
    { date: 'Tue', total: 2250.75, orders: 63 },
    { date: 'Wed', total: 2105.25, orders: 58 },
    { date: 'Thu', total: 1945.00, orders: 55 },
    { date: 'Fri', total: 2850.75, orders: 78 },
    { date: 'Sat', total: 2720.50, orders: 72 },
    { date: 'Sun', total: 1658.00, orders: 45 },
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-pos-dark">Dashboard</h1>
              <p className="text-gray-500">Overview of your business performance</p>
            </div>
            
            <div className="mb-6">
              <h2 className="section-title">Sales Summary</h2>
              <SalesSummary data={salesSummaryData} chartData={dailySalesData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
