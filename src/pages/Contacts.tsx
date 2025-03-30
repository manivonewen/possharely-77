import React, { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Contact } from '@/lib/types';
import { Edit, FileText, UserPlus, Trash, X, Check } from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact-001',
      name: 'John Doe',
      category: 'client',

    },
    {
      id: 'contact-002',
      name: 'Jane Smith',
      category: 'supplier',
    },
    {
      id: 'contact-003',
      name: 'Mike Johnson',
      category: 'team',
    },
    {
      id: 'contact-004',
      name: 'Emily Davis',
      category: 'client',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const handleSaveContact = () => {
    if (currentContact) {
      setContacts((prev) =>
        prev.some((contact) => contact.id === currentContact.id)
          ? prev.map((contact) =>
              contact.id === currentContact.id ? currentContact : contact
            )
          : [...prev, currentContact]
      );
      setCurrentContact(null);
      setIsModalOpen(false);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const handleConfirmAction = (contactId: string, action: () => void) => {
    if (confirmingAction === contactId) {
      action();
      setConfirmingAction(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      setConfirmingAction(contactId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setConfirmingAction(null);
        timeoutRef.current = null;
      }, 3000); // Confirm icon visible for 3 seconds only
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // Reset subcategory when parent category changes
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  const renderSubCategoryPills = () => {
    if (selectedCategory === 'supplier') {
      return (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSubCategorySelect('company')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedSubCategory === 'company'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }`}
          >
            Company
          </button>
          <button
            onClick={() => handleSubCategorySelect('retail')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedSubCategory === 'retail'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }`}
          >
            Retail
          </button>
        </div>
      );
    } else if (selectedCategory === 'client') {
      return (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSubCategorySelect('online')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedSubCategory === 'online'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => handleSubCategorySelect('in-store')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedSubCategory === 'in-store'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
          >
            In-Store
          </button>
        </div>
      );
    } else if (selectedCategory === 'team') {
      return (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSubCategorySelect('driver')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedSubCategory === 'driver'
                ? 'bg-cyan-500 text-white'
                : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
            }`}
          >
            Driver
          </button>
          <button
            onClick={() => handleSubCategorySelect('manager')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedSubCategory === 'manager'
                ? 'bg-cyan-500 text-white'
                : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
            }`}
          >
            Manager
          </button>
          <button
            onClick={() => handleSubCategorySelect('staff')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedSubCategory === 'staff'
                ? 'bg-cyan-500 text-white'
                : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
            }`}
          >
            Staff
          </button>
        </div>
      );
    }
    return null;
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (id: string) => {
    setSelectedContactId(id === selectedContactId ? null : id);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-4">
          <div className="relative w-1/2 sm:w-1/3 lg:w-1/4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  onClick={() => handleRowClick(contact.id)}
                  className={`cursor-pointer ${
                    selectedContactId === contact.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.id}</TableCell>
                  <TableCell>
                    {contact.category ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.category === 'supplier'
                            ? 'bg-orange-100 text-orange-600'
                            : contact.category === 'client'
                            ? 'bg-purple-100 text-purple-600'
                            : contact.category === 'team'
                            ? 'bg-cyan-100 text-cyan-600'
                            : ''
                        }`}
                      >
                        {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {selectedContactId === contact.id && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                          onClick={() => handleEditContact(contact)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                          onClick={() => console.log('View contact details', contact)}
                        >
                          <FileText size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`p-2 rounded-full ${
                            confirmingAction === contact.id
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          onClick={() =>
                            handleConfirmAction(contact.id, () => handleDeleteContact(contact.id))
                          }
                        >
                          {confirmingAction === contact.id ? <Check size={16} /> : <Trash size={16} />}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No contacts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentContact ? 'Edit Contact' : 'Add Contact'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 absolute top-2 right-2"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={16} />
              </Button>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Contact Tag</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCategorySelect('supplier')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === 'supplier'
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                  >
                    Supplier
                  </button>
                  <button
                    onClick={() => handleCategorySelect('client')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === 'client'
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                  >
                    Client
                  </button>
                  <button
                    onClick={() => handleCategorySelect('team')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === 'team'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                    }`}
                  >
                    Team
                  </button>
                </div>
                {renderSubCategoryPills()}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={currentContact?.name || ''}
                  onChange={(e) =>
                    setCurrentContact((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="id">ID</Label>
                <Input
                  id="id"
                  value={currentContact?.id || ''}
                  onChange={(e) =>
                    setCurrentContact((prev) => ({
                      ...prev,
                      id: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                onClick={handleSaveContact}
              >
                <Check size={16} />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Floating Add Contact Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Add Contact"
        >
          <UserPlus className="h-6 w-6" />
        </button>
      </div>
    </Layout>
  );
};

export default Contacts;
