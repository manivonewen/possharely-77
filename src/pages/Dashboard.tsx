import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { SalesSummary as SalesSummaryType } from '@/lib/types';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Switch } from '@/components/ui/switch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
  const [topProductsView, setTopProductsView] = useState<'chart' | 'pie'>('chart');

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
  };

  // Sample data for widgets
  const totalCustomers = { supplier: 50, client: 1000, team: 150 };
  const totalRevenue = { inStore: 10250.75, online: 5170.00 };
  const totalExpenses = { fees: 1230.50, products: 4000.00 };
  const netProfit = totalRevenue.inStore + totalRevenue.online - (totalExpenses.fees + totalExpenses.products);
  const globalMargin = ((netProfit / (totalRevenue.inStore + totalRevenue.online)) * 100).toFixed(2);

  // Expense ratios
  const feesRatio = ((totalExpenses.fees / (totalExpenses.fees + totalExpenses.products)) * 100).toFixed(2);
  const productsRatio = ((totalExpenses.products / (totalExpenses.fees + totalExpenses.products)) * 100).toFixed(2);

  // Colors for the top products chart
  const productColors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];

  // Close sidebar on small screens when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`flex h-screen flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-pos-gray text-black'}`}>
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

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
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Overview of your business performance</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setTimeFilter('day')}
                className={`px-3 py-1 rounded-full text-sm ${
                  timeFilter === 'day' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-3 py-1 rounded-full text-sm ${
                  timeFilter === 'week' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-3 py-1 rounded-full text-sm ${
                  timeFilter === 'month' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                Month
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="text-sm text-muted-foreground mb-1">Contacts</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalCustomers.supplier + totalCustomers.client + totalCustomers.team}
                </div>
                <div className="text-sm mt-2">
                  Suppliers: {totalCustomers.supplier}, Clients: {totalCustomers.client}, Team: {totalCustomers.team}
                </div>
              </div>
              <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-900/20">
                <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${(totalRevenue.inStore + totalRevenue.online).toFixed(2)}
                </div>
                <div className="text-sm mt-2">
                  In-Store: ${totalRevenue.inStore.toFixed(2)}, Online: ${totalRevenue.online.toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="text-sm text-muted-foreground mb-1">Net Profit</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  ${netProfit.toFixed(2)}
                </div>
                <div className="text-sm mt-2">Margin: {globalMargin}%</div>
              </div>
              <div className="rounded-lg border p-4 bg-red-50 dark:bg-red-900/20">
                <div className="text-sm text-muted-foreground mb-1">Expenses</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${(totalExpenses.fees + totalExpenses.products).toFixed(2)}
                </div>
                <div className="text-sm mt-2">
                  Fees: {feesRatio}%, Products: {productsRatio}%
                </div>
              </div>
            </div>

            {/* Top Products Chart */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="section-title">Top Products</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Chart</span>
                  <Switch
                    checked={topProductsView === 'pie'}
                    onCheckedChange={(checked) => setTopProductsView(checked ? 'pie' : 'chart')}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pie</span>
                </div>
              </div>
              {topProductsView === 'chart' ? (
                <Bar
                  data={{
                    labels: salesSummaryData.topProducts.map((product) => product.product),
                    datasets: [
                      {
                        label: 'Revenue',
                        data: salesSummaryData.topProducts.map((product) => product.revenue),
                        backgroundColor: productColors,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              ) : (
                <Pie
                  data={{
                    labels: salesSummaryData.topProducts.map((product) => product.product),
                    datasets: [
                      {
                        data: salesSummaryData.topProducts.map((product) => product.revenue),
                        backgroundColor: productColors,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
