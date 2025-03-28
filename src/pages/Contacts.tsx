
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Edit, Trash2, Mail, Phone, Tag, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Contact } from '@/lib/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  
  const [newContact, setNewContact] = useState<{
    name: string;
    email: string;
    phone: string;
    category: string;
    isDriver: boolean;
  }>({
    name: '',
    email: '',
    phone: '',
    category: 'client',
    isDriver: false
  });
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      category: 'client',
      isDriver: false
    },
    {
      id: 'contact2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '234-567-8901',
      category: 'supplier',
      isDriver: false
    },
    {
      id: 'contact3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '345-678-9012',
      category: 'driver',
      isDriver: true
    },
    {
      id: 'contact4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '456-789-0123',
      category: 'team',
      isDriver: false
    }
  ]);

  const categories = ['client', 'supplier', 'driver', 'team'];

  const handleAddContact = () => {
    const contact: Contact = {
      id: `contact${Date.now()}`,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      category: newContact.category as Contact['category'],
      isDriver: newContact.isDriver
    };
    
    setContacts(prev => [...prev, contact]);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      category: 'client',
      isDriver: false
    });
    setIsAddContactOpen(false);
    toast.success('Contact added successfully');
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !selectedContactId) return;
    
    // In a real app, this would add a tag to the contact
    // For now, we'll just show a toast
    toast.success(`Tag "${newTag}" added to contact`);
    setNewTag('');
    setIsTagModalOpen(false);
  };

  const handleTagContact = (contactId: string) => {
    setSelectedContactId(contactId);
    setIsTagModalOpen(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    
    const matchesCategory = !selectedCategory || contact.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch(category) {
      case 'client':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'supplier':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'driver':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'team':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(contact.category || 'client')}`}>
                        {contact.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      {contact.isDriver ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                          Yes
                        </Badge>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => toast.info(`Edit ${contact.name}`)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleTagContact(contact.id)}>
                          <Tag className="h-4 w-4" />
                          <span className="sr-only">Tag</span>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => toast.info(`Delete ${contact.name}`)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
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
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newContact.email} 
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={newContact.phone} 
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newContact.category}
                  onValueChange={(value) => setNewContact({...newContact, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  id="isDriver" 
                  type="checkbox"
                  checked={newContact.isDriver}
                  onChange={(e) => setNewContact({...newContact, isDriver: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isDriver">This contact is a driver</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddContact} 
                disabled={!newContact.name}
              >
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Tag Dialog */}
        <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Tag</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddTag} className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
