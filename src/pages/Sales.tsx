import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Order } from '@/lib/types';
import { Search, Calendar, Filter, ChevronDown, FileText } from 'lucide-react';
import { format } from 'date-fns';

const Orders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      status: 'refunded',
      createdAt: new Date('2023-04-17T16:45:00'),
      customerInfo: {
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
    },
    {
      id: 'ORD-0006',
      items: [],
      subtotal: 22.00,
      tax: 2.20,
      discount: 2.00,
      total: 22.20,
      paymentMethod: 'card',
      status: 'voided',
      createdAt: new Date('2023-04-16T13:25:00'),
      customerInfo: {
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
      order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    const orderDate = order.createdAt;
    let matchesDateRange = true;
    
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      matchesDateRange = orderDate >= fromDate && orderDate <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'refunded':
        return 'bg-amber-100 text-amber-800';
      case 'voided':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDateTime = (date: Date) => {
    const formattedDate = format(date, 'dd/MM/yy');
    const formattedTime = format(date, 'HH:mm');
    return `${formattedDate} ${formattedTime}`;
  };

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
              <h1 className="text-2xl font-bold text-pos-dark">Orders</h1>
              <p className="text-gray-500">View and manage your order transactions</p>
            </div>
            
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full pl-10"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">From:</span>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">To:</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="input-field"
                  />
                </div>
                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="input-field"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                  <option value="voided">Voided</option>
                </select>
              </div>
            </div>
            
            <div className="card-container overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-pos-border">
                  <thead className="bg-pos-gray">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pos-border bg-white">
                    {filteredSales.map((order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {order.customerInfo?.name || 'Walk-in Customer'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {order.paymentMethod === 'card' ? 'Credit Card' : 'Cash'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <button className="flex items-center gap-1 text-pos-blue hover:text-pos-blue/80 button-transition">
                            <FileText size={16} />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredSales.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <p>No orders found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
