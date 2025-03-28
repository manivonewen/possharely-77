
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Order } from '@/lib/types';
import { Search, Calendar, Filter, ChevronDown, FileText, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Sample sales data
  const salesData: Order[] = [
    {
      id: 'ORD-0001',
      items: [],
      subtotal: 15.50,
      tax: 1.55,
      discount: 0,
      total: 17.05,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: new Date('2023-04-18T10:15:00'),
      customerInfo: {
        id: 'CUST-001',
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    {
      id: 'ORD-0002',
      items: [],
      subtotal: 27.00,
      tax: 2.70,
      discount: 0,
      total: 29.70,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: new Date('2023-04-18T11:30:00'),
      customerInfo: {
        id: 'CUST-002'
      },
    },
    {
      id: 'ORD-0003',
      items: [],
      subtotal: 42.50,
      tax: 4.25,
      discount: 5.00,
      total: 41.75,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: new Date('2023-04-17T14:20:00'),
      customerInfo: {
        id: 'CUST-003',
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
    },
    {
      id: 'ORD-0004',
      items: [],
      subtotal: 18.75,
      tax: 1.88,
      discount: 0,
      total: 20.63,
      paymentMethod: 'card',
      status: 'archived',
      createdAt: new Date('2023-04-17T16:45:00'),
      customerInfo: {
        id: 'CUST-004',
        name: 'Michael Johnson',
      },
    },
    {
      id: 'ORD-0005',
      items: [],
      subtotal: 33.25,
      tax: 3.33,
      discount: 0,
      total: 36.58,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: new Date('2023-04-16T09:10:00'),
      customerInfo: {
        id: 'CUST-005'
      },
    },
    {
      id: 'ORD-0006',
      items: [],
      subtotal: 22.00,
      tax: 2.20,
      discount: 2.00,
      total: 22.20,
      paymentMethod: 'card',
      status: 'archived',
      createdAt: new Date('2023-04-16T13:25:00'),
      customerInfo: {
        id: 'CUST-006',
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
      },
    },
  ];

  // Filter sales based on search, status, and date range
  const filteredSales = salesData.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    const orderDate = order.createdAt;
    let matchesDateRange = true;
    
    if (dateRange.from && dateRange.to) {
      matchesDateRange = orderDate >= dateRange.from && orderDate <= dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  }).filter(order => statusFilter !== 'archived' ? order.status !== 'archived' : true);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDateTime = (date: Date) => {
    return format(date, 'dd/MM/yy HH:mm');
  };

  const formatCurrency = (amount: number) => {
    const usd = `$${amount.toFixed(2)}`;
    const riel = `៛${Math.round(amount * 4100)}`; // Assuming 1 USD = 4100 Riel
    return `${usd} (${riel})`;
  };

  const handleArchiveOrder = (orderId: string) => {
    // In a real app, this would update the database
    console.log(`Archiving order ${orderId}`);
    // For demo purposes, we'll just update our local data
    // setOrders(prevOrders => 
    //   prevOrders.map(order => 
    //     order.id === orderId ? { ...order, status: 'archived' } : order
    //   )
    // );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-pos-dark dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage your order transactions</p>
        </div>
        
        <div className="mb-4 flex flex-col gap-4 sm:flex-row items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by contact ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{dateRange.from && dateRange.to ? `${format(dateRange.from, 'dd/MM/yy')} - ${format(dateRange.to, 'dd/MM/yy')}` : 'Select dates'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        
        <div className="card-container overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-pos-border dark:divide-gray-700">
              <thead className="bg-pos-gray dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Contact ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pos-border bg-white dark:divide-gray-700 dark:bg-gray-800">
                {filteredSales.map((order) => (
                  <tr key={order.id} className="dark:text-white">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {order.customerInfo?.id || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm flex gap-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-pos-blue hover:text-pos-blue/80">
                        <FileText size={16} />
                        <span>Open</span>
                      </Button>
                      {order.status !== 'archived' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-amber-600 hover:text-amber-500"
                          onClick={() => handleArchiveOrder(order.id)}
                        >
                          <Archive size={16} />
                          <span>Archive</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSales.length === 0 && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
