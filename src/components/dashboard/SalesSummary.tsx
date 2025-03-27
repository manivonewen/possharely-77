
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { SalesSummary as SalesSummaryType, DailySales } from '@/lib/types';

interface SalesSummaryProps {
  data: SalesSummaryType;
  chartData: DailySales[];
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ data, chartData }) => {
  const { totalSales, totalOrders, averageOrder, topProducts, periodComparison } = data;
  
  const isPositive = periodComparison.percentageChange >= 0;
  
  const statsCards = [
    {
      title: 'Total Sales',
      value: `$${totalSales.toFixed(2)}`,
      icon: <DollarSign className="text-emerald-500" />,
      trend: periodComparison.percentageChange,
      trendLabel: 'vs last period',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingBag className="text-blue-500" />,
    },
    {
      title: 'Average Order',
      value: `$${averageOrder.toFixed(2)}`,
      icon: <TrendingUp className="text-violet-500" />,
    },
  ];
  
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Stats Cards */}
      <div className="grid gap-4 lg:col-span-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((card, index) => (
            <div key={index} className="card-container p-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{card.value}</h3>
                  
                  {card.trend !== undefined && (
                    <div className="mt-1 flex items-center">
                      <span
                        className={`flex items-center text-xs font-medium ${
                          card.trend >= 0 ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {card.trend >= 0 ? (
                          <ArrowUp size={14} className="mr-1" />
                        ) : (
                          <ArrowDown size={14} className="mr-1" />
                        )}
                        {Math.abs(card.trend).toFixed(1)}%
                      </span>
                      <span className="ml-1 text-xs text-gray-500">{card.trendLabel}</span>
                    </div>
                  )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sales Chart */}
      <div className="card-container p-5 lg:col-span-2">
        <h3 className="mb-4 text-lg font-semibold">Sales Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#0EA5E9" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Products */}
      <div className="card-container p-5">
        <h3 className="mb-4 text-lg font-semibold">Top Products</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{ top: 5, right: 20, bottom: 5, left: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={(value) => `$${value}`} />
              <YAxis 
                type="category" 
                dataKey="product" 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
