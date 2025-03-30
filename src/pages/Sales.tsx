import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, FileText, Trash, Check, Archive } from 'lucide-react';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setSelectedOrderId(null); // Reset to initial state
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const orders: Order[] = [
    {
      id: 'ORD-0001',
      items: [],
      subtotal: 15.5,
      tax: 1.55,
      discount: 0,
      total: 17.05,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: new Date('2023-04-18T10:15:00'),
    },
    {
      id: 'ORD-0002',
      items: [],
      subtotal: 27.0,
      tax: 2.7,
      discount: 0,
      total: 29.7,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: new Date('2023-04-18T11:30:00'),
    },
    {
      id: 'ORD-0003',
      items: [],
      subtotal: 42.5,
      tax: 4.25,
      discount: 5.0,
      total: 41.75,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: new Date('2023-04-17T14:20:00'),
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
      subtotal: 22.0,
      tax: 2.2,
      discount: 2.0,
      total: 22.2,
      paymentMethod: 'card',
      status: 'archived',
      createdAt: new Date('2023-04-16T13:25:00'),
    },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handleConfirmAction = (orderId: string, action: () => void) => {
    if (confirmingAction === orderId) {
      action();
      setConfirmingAction(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      setConfirmingAction(orderId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setConfirmingAction(null);
        timeoutRef.current = null;
      }, 3000); // Confirm icon visible for 3 seconds only
    }
  };

  const handleDeleteOrder = (id: string) => {
    console.log('Delete order', id);
  };

  const handleRowClick = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleArchiveOrder = (id: string) => {
    console.log('Archive order', id);
  };

  const handleViewDocuments = (id: string) => {
    console.log('View documents for order', id); // Placeholder for viewing documents
  };

  return (
    <Layout>
      <div className="p-6 overflow-y-hidden" style={{ marginTop: '-5.3rem' }}>
        <div className="mb-4 flex items-center gap-4">
          <div className="relative w-1/2 sm:w-1/3 lg:w-1/4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <button
            onClick={() => console.log('Add Order')}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label="Add Order"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="card-container overflow-hidden" ref={tableRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => handleRowClick(order.id)}
                  className={`cursor-pointer ${
                    selectedOrderId === order.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    {order.status === 'completed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                  </TableCell>
                  {selectedOrderId === order.id && (
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                          onClick={() => handleArchiveOrder(order.id)}
                        >
                          <Archive size={16} />
                        </button>
                        <button
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                          onClick={() => handleViewDocuments(order.id)}
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          className={`p-2 rounded-full ${
                            confirmingAction === order.id
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          onClick={() =>
                            handleConfirmAction(order.id, () => handleDeleteOrder(order.id))
                          }
                        >
                          {confirmingAction === order.id ? <Check size={16} /> : <Trash size={16} />}
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <p>No orders found</p>
                </div>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
