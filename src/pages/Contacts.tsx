
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Search, Plus, Edit, Trash2, ExternalLink, FileText, MessageSquare, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

interface Contact {
  id: string;
  name: string;
  telegramId?: string;
  email?: string;
  phone?: string;
  category: 'team' | 'client' | 'supplier' | 'driver';
  orders?: {
    id: string;
    date: Date;
    status: 'completed' | 'pending' | 'cancelled';
    total: number;
  }[];
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  telegramId: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  category: z.enum(['team', 'client', 'supplier', 'driver'], {
    required_error: "Please select a category",
  }),
});

// Sample contacts data
const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    telegramId: '12345678',
    email: 'john@example.com',
    phone: '+1234567890',
    category: 'client',
    orders: [
      {
        id: 'ORD-0011',
        date: new Date('2023-11-25T14:30:00'),
        status: 'completed',
        total: 42.50,
      },
      {
        id: 'ORD-0008',
        date: new Date('2023-11-20T09:15:00'),
        status: 'completed',
        total: 28.75,
      },
    ],
  },
  {
    id: '2',
    name: 'Alice Smith',
    telegramId: '87654321',
    email: 'alice@example.com',
    category: 'team',
    orders: [],
  },
  {
    id: '3',
    name: 'Acme Supplies',
    email: 'orders@acme.com',
    phone: '+1987654321',
    category: 'supplier',
    orders: [],
  },
  {
    id: '4',
    name: 'Bob Johnson',
    telegramId: '56781234',
    phone: '+1122334455',
    category: 'driver',
    orders: [
      {
        id: 'ORD-0010',
        date: new Date('2023-11-22T16:45:00'),
        status: 'completed',
        total: 35.20,
      },
    ],
  },
];

const categoryOptions = [
  { value: 'team', label: 'Team' },
  { value: 'client', label: 'Client' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'driver', label: 'Driver' },
];

const Contacts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      telegramId: '',
      email: '',
      phone: '',
      category: undefined,
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter contacts based on search and category
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.telegramId?.includes(searchTerm) || 
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.phone?.includes(searchTerm);
    
    const matchesCategory = selectedCategory ? contact.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    const newContact: Contact = {
      id: (contacts.length + 1).toString(),
      ...data,
      orders: [],
    };
    
    setContacts([...contacts, newContact]);
    setIsAddContactOpen(false);
    form.reset();
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const openContactProfile = (contact: Contact) => {
    setActiveContact(contact);
    setIsProfileOpen(true);
  };

  const handleTelegramChat = (telegramId?: string) => {
    if (telegramId) {
      window.open(`https://t.me/${telegramId}`, '_blank');
    }
  };

  const handleSendLocation = (contactId: string) => {
    console.log(`Send location to contact ${contactId}`);
    // Implement location sharing functionality
  };

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
              <h1 className="text-2xl font-bold text-pos-dark">Contacts</h1>
              <p className="text-gray-500">Manage your team, clients, suppliers and drivers</p>
            </div>
            
            <div className="mb-4 flex flex-col gap-4 sm:flex-row justify-between">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full pl-10"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <span>Category: {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'All'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                      All
                    </DropdownMenuItem>
                    {categoryOptions.map((category) => (
                      <DropdownMenuItem 
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        {category.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={16} />
                      <span>Add Contact</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new contact.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="telegramId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID (Telegram)</FormLabel>
                              <FormControl>
                                <Input placeholder="Telegram ID" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter Telegram ID without prefix
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone number (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Email address (optional)" 
                                  type="email" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Used if Telegram ID is not available
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    {categoryOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit">Add Contact</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="card-container overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-pos-border">
                  <thead className="bg-pos-gray">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pos-border bg-white">
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id}>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {contact.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {contact.telegramId || contact.email || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {contact.phone || contact.email || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className="capitalize">{contact.category}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openContactProfile(contact)}
                          >
                            <ExternalLink size={16} className="text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                          >
                            <FileText size={16} className="text-green-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleTelegramChat(contact.telegramId)}
                            disabled={!contact.telegramId}
                          >
                            <MessageSquare size={16} className="text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredContacts.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <p>No contacts found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Contact Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {activeContact && (
            <>
              <DialogHeader>
                <DialogTitle>Contact Profile</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{activeContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium capitalize">{activeContact.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="font-medium">{activeContact.telegramId || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{activeContact.email || '-'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{activeContact.phone || '-'}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Order History</h3>
                  {activeContact.orders && activeContact.orders.length > 0 ? (
                    <div className="rounded border divide-y">
                      {activeContact.orders.slice(0, 3).map(order => (
                        <div key={order.id} className="px-4 py-2 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-500">{formatDateTime(order.date)}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                              order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No orders found</p>
                  )}
                </div>
                
                {activeContact.category === 'driver' && (
                  <div className="pt-2">
                    <Button 
                      onClick={() => handleSendLocation(activeContact.id)}
                      className="w-full"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Send Location
                    </Button>
                  </div>
                )}
                
                {activeContact.telegramId && (
                  <div>
                    <Button 
                      onClick={() => handleTelegramChat(activeContact.telegramId)}
                      variant="outline"
                      className="w-full"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Open Telegram Chat
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
