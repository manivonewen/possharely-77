
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ShoppingBag, ExternalLink, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { SavedCart } from '@/lib/types';

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [tickets, setTickets] = useState<SavedCart[]>([
    {
      id: 'ticket-001',
      items: [],
      subtotal: 42.99,
      tax: 3.87,
      discount: 0,
      total: 46.86,
      status: 'new order',
      createdAt: new Date('2023-10-15T14:30:00'),
      customerInfo: {
        name: 'John Doe',
        id: 'CUST-001',
      }
    },
    {
      id: 'ticket-002',
      items: [],
      subtotal: 89.50,
      tax: 8.06,
      discount: 10,
      total: 87.56,
      status: 'processing',
      createdAt: new Date('2023-10-16T09:45:00'),
      customerInfo: {
        name: 'Jane Smith',
        id: 'CUST-002',
      }
    },
    {
      id: 'ticket-003',
      items: [],
      subtotal: 33.25,
      tax: 2.99,
      discount: 0,
      total: 36.24,
      status: 'completed',
      createdAt: new Date('2023-10-16T16:15:00'),
      customerInfo: {
        name: 'Mark Wilson',
        id: 'CUST-003',
      }
    },
    {
      id: 'ticket-004',
      items: [],
      subtotal: 124.75,
      tax: 11.23,
      discount: 15,
      total: 121.98,
      status: 'cancelled',
      createdAt: new Date('2023-10-17T11:20:00'),
      customerInfo: {
        name: 'Sarah Johnson',
        id: 'CUST-004',
      }
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const searchValue = searchTerm.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(searchValue) ||
      ticket.status.toLowerCase().includes(searchValue) ||
      ticket.customerInfo?.name?.toLowerCase().includes(searchValue) ||
      ticket.customerInfo?.id?.toLowerCase().includes(searchValue) ||
      ticket.total.toString().includes(searchValue)
    );
  });

  const handleResume = (ticketId: string) => {
    // Logic to resume the cart (would typically load the cart into the active session)
    console.log(`Resuming ticket ${ticketId}`);
  };

  const handleDelete = (ticketId: string) => {
    setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
  };

  const formatCurrency = (amount: number) => {
    const usd = `$${amount.toFixed(2)}`;
    const riel = `៛${Math.round(amount * 4100)}`; // Assuming 1 USD = 4100 Riel
    return `${usd} (${riel})`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'new order':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold dark:text-white">Open Tickets</h1>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.customerInfo?.id || 'Guest'}</TableCell>
                    <TableCell>{format(ticket.createdAt, 'dd/MM/yy')}</TableCell>
                    <TableCell>{format(ticket.createdAt, 'HH:mm')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(ticket.total)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleResume(ticket.id)}
                          disabled={ticket.status === 'cancelled'}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Resume</span>
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No open tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
