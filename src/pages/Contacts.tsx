
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Edit, Trash, FileText, MessageSquare, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contact } from '@/lib/types';
import { format } from 'date-fns';

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      category: 'client',
      telegramId: '123456789',
      phone: '+1234567890',
      orders: [
        {
          id: 'ord1',
          items: [],
          subtotal: 25.99,
          tax: 2.60,
          discount: 0,
          total: 28.59,
          paymentMethod: 'cash',
          status: 'completed',
          createdAt: new Date('2023-10-15T14:30:00')
        },
        {
          id: 'ord2',
          items: [],
          subtotal: 34.50,
          tax: 3.45,
          discount: 5,
          total: 32.95,
          paymentMethod: 'card',
          status: 'completed',
          createdAt: new Date('2023-11-02T10:15:00')
        }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      category: 'supplier',
      email: 'jane@example.com',
      phone: '+9876543210',
      orders: []
    },
    {
      id: '3',
      name: 'Mike Johnson',
      category: 'team',
      telegramId: '987654321',
      orders: []
    },
    {
      id: '4',
      name: 'Sarah Driver',
      category: 'driver',
      phone: '+1122334455',
      telegramId: '456789123',
      orders: []
    }
  ]);

  const [newContact, setNewContact] = useState<{
    name: string;
    category: 'team' | 'client' | 'supplier' | 'driver';
    telegramId?: string;
    email?: string;
    phone?: string;
  }>({
    name: '',
    category: 'client',
  });

  const handleAddContact = () => {
    const contact: Contact = {
      id: Math.random().toString(36).substring(2, 9),
      name: newContact.name,
      category: newContact.category,
      telegramId: newContact.telegramId,
      email: newContact.email,
      phone: newContact.phone,
      orders: []
    };
    
    setContacts(prev => [...prev, contact]);
    setNewContact({
      name: '',
      category: 'client',
    });
    setIsAddContactOpen(false);
  };

  const openContactProfile = (contact: Contact) => {
    setSelectedContact(contact);
    setIsProfileOpen(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            contact.telegramId?.includes(searchTerm) ||
                            contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contact.phone?.includes(searchTerm);
    
    const matchesCategory = !selectedCategory || contact.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const openTelegramChat = (telegramId?: string) => {
    if (telegramId) {
      window.open(`https://t.me/${telegramId}`, '_blank');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select onValueChange={setSelectedCategory} value={selectedCategory || ''}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="gap-1" onClick={() => setIsAddContactOpen(true)}>
              <UserPlus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.category === 'team' ? 'bg-blue-100 text-blue-800' :
                        contact.category === 'client' ? 'bg-green-100 text-green-800' :
                        contact.category === 'supplier' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {contact.category}
                      </span>
                    </TableCell>
                    <TableCell>{contact.phone || contact.email || '-'}</TableCell>
                    <TableCell>{contact.telegramId || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openContactProfile(contact)}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open</span>
                        </Button>
                        <Button size="icon" variant="ghost">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Documents</span>
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => openTelegramChat(contact.telegramId)}
                          disabled={!contact.telegramId}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="sr-only">Chat</span>
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No contacts found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Add Contact Dialog */}
        <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={newContact.name} 
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="id">Telegram ID</Label>
                <Input 
                  id="id" 
                  placeholder="Without @ prefix" 
                  value={newContact.telegramId || ''} 
                  onChange={(e) => setNewContact({...newContact, telegramId: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newContact.email || ''} 
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={newContact.phone || ''} 
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newContact.category} 
                  onValueChange={(value: 'team' | 'client' | 'supplier' | 'driver') => 
                    setNewContact({...newContact, category: value})
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>Cancel</Button>
              <Button onClick={handleAddContact} disabled={!newContact.name}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Contact Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Profile</DialogTitle>
            </DialogHeader>
            {selectedContact && (
              <div className="grid gap-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold">{selectedContact.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedContact.category}</p>
                    {selectedContact.phone && <p className="text-sm">{selectedContact.phone}</p>}
                    {selectedContact.email && <p className="text-sm">{selectedContact.email}</p>}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Order History</h4>
                  {selectedContact.orders && selectedContact.orders.length > 0 ? (
                    <div className="space-y-2">
                      {selectedContact.orders.slice(0, 3).map(order => (
                        <div key={order.id} className="border rounded p-3 flex justify-between">
                          <div>
                            <div className="text-sm font-medium">Order #{order.id}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(order.createdAt, 'dd/MM/yy HH:mm')}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'refunded' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                            <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No order history available</p>
                  )}
                </div>
                
                <div className="flex gap-2 justify-between">
                  <Button variant="outline" className="flex-1" size="sm">
                    Send Location
                  </Button>
                  {selectedContact.telegramId && (
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      size="sm"
                      onClick={() => openTelegramChat(selectedContact.telegramId)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
