
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
      status: 'pending',
      createdAt: new Date('2023-10-15T14:30:00'),
      customerInfo: {
        name: 'John Doe',
      }
    },
    {
      id: 'ticket-002',
      items: [],
      subtotal: 89.50,
      tax: 8.06,
      discount: 10,
      total: 87.56,
      status: 'pending',
      createdAt: new Date('2023-10-16T09:45:00'),
      customerInfo: {
        name: 'Jane Smith',
      }
    },
    {
      id: 'ticket-003',
      items: [],
      subtotal: 33.25,
      tax: 2.99,
      discount: 0,
      total: 36.24,
      status: 'paid',
      createdAt: new Date('2023-10-16T16:15:00'),
      customerInfo: {
        name: 'Mark Wilson',
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
      }
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const searchValue = searchTerm.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(searchValue) ||
      ticket.status.toLowerCase().includes(searchValue) ||
      ticket.customerInfo?.name?.toLowerCase().includes(searchValue) ||
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

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Open Tickets</h1>
          
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
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Customer</TableHead>
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
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.customerInfo?.name || 'Guest'}</TableCell>
                    <TableCell>{format(ticket.createdAt, 'dd/MM/yy')}</TableCell>
                    <TableCell>{format(ticket.createdAt, 'HH:mm')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'paid' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>${ticket.total.toFixed(2)}</TableCell>
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
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
