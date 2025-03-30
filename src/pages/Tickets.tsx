import React, { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SavedCart } from '@/lib/types';
import { Search, Edit, Trash, DollarSign, RefreshCw, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([
    {
      id: 'cart-001',
      items: [],
      subtotal: 45.5,
      tax: 4.55,
      discount: 0,
      total: 50.05,
      status: 'new order',
      createdAt: new Date('2023-10-15T14:30:00'),
      customerInfo: { name: 'John Doe' },
    },
    {
      id: 'cart-002',
      items: [],
      subtotal: 30.0,
      tax: 3.0,
      discount: 0,
      total: 33.0,
      status: 'processing',
      createdAt: new Date('2023-10-16T09:45:00'),
      customerInfo: { name: 'Jane Smith' },
    },
  ]);
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredCarts = savedCarts.filter(cart =>
    cart.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmAction = (cartId: string, action: () => void) => {
    if (confirmingAction === cartId) {
      action();
      setConfirmingAction(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      setConfirmingAction(cartId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setConfirmingAction(null);
        timeoutRef.current = null;
      }, 3000); // Confirm icon visible for 3 seconds only
    }
  };

  const handleMarkAsProcessing = (cartId: string) => {
    setSavedCarts(prev =>
      prev.map(cart =>
        cart.id === cartId ? { ...cart, status: 'processing' } : cart
      )
    );
    toast.success('Cart marked as processing.');
  };

  const handleMarkAsCompleted = (cartId: string) => {
    setSavedCarts(prev =>
      prev.map(cart =>
        cart.id === cartId ? { ...cart, status: 'completed' } : cart
      )
    );
    toast.success('Cart marked as completed.');
  };

  const handleDeleteCart = (cartId: string) => {
    setSavedCarts(prev => prev.filter(cart => cart.id !== cartId));
    toast.success('Cart deleted successfully.');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'new order':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-6" style={{ marginTop: '-5.3rem', marginBottom: 'calc(6rem + var(--existing-margin))' }}>
        <div className="mb-4 flex items-center gap-4">
          <div className="relative w-1/2 sm:w-1/3 lg:w-1/4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <button
            onClick={() => console.log('Add Ticket')}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label="Add Ticket"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts.map(cart => (
                <TableRow key={cart.id}>
                  <TableCell>{cart.customerInfo?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                        cart.status
                      )}`}
                    >
                      {cart.status.charAt(0).toUpperCase() + cart.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>${cart.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {cart.status !== 'processing' && cart.status !== 'completed' && (
                        <button
                          className={`p-2 rounded-full ${
                            confirmingAction === cart.id
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                          onClick={() =>
                            handleConfirmAction(cart.id, () => handleMarkAsProcessing(cart.id))
                          }
                        >
                          {confirmingAction === cart.id ? <Check size={16} /> : <RefreshCw size={16} />}
                        </button>
                      )}
                      {cart.status !== 'completed' && (
                        <button
                          className={`p-2 rounded-full ${
                            confirmingAction === cart.id
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          onClick={() =>
                            handleConfirmAction(cart.id, () => handleMarkAsCompleted(cart.id))
                          }
                        >
                          {confirmingAction === cart.id ? <Check size={16} /> : <DollarSign size={16} />}
                        </button>
                      )}
                      <button
                        className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        disabled={cart.status === 'completed'}
                        onClick={() => console.log('Edit cart', cart)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={`p-2 rounded-full ${
                          confirmingAction === cart.id
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        onClick={() =>
                          handleConfirmAction(cart.id, () => handleDeleteCart(cart.id))
                        }
                      >
                        {confirmingAction === cart.id ? <Check size={16} /> : <Trash size={16} />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCarts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No tickets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Tickets;