
import React, { useState } from 'react';
import { CartItem, Product, Contact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Plus, UserPlus, CreditCard, Trash2, Save, Pause, Check } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface CartProps {
  items: CartItem[];
  onItemUpdate: (productId: string, quantity: number) => void;
  onItemRemove: (productId: string) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onItemUpdate,
  onItemRemove,
  onClearCart,
}) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', isDriver: false });
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [showOrderComplete, setShowOrderComplete] = useState(false);

  // Sample contacts for demo
  const contacts: Contact[] = [
    { id: 'contact1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', isDriver: false },
    { id: 'contact2', name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', isDriver: false },
    { id: 'contact3', name: 'Mike Driver', email: 'mike@example.com', phone: '345-678-9012', isDriver: true },
  ];

  const calculateSubtotal = () => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  
  // Delivery fee only if a driver is selected
  const hasDriver = selectedContacts.some(contact => contact.isDriver);
  const deliveryFee = hasDriver ? 5 : 0;
  
  // Tax and discount are hidden as per requirements
  const total = subtotal + deliveryFee;

  const formatCurrency = (amount: number) => {
    const usd = `$${amount.toFixed(2)}`;
    const riel = `៛${Math.round(amount * 4100)}`; // Assuming 1 USD = 4100 Riel
    return `${usd} (${riel})`;
  };

  const handleAddContact = () => {
    // In a real app, you would save this to your database
    const newContactWithId = {
      ...newContact,
      id: `contact${Date.now()}` // Simple ID generation for demo
    };
    
    setSelectedContacts([...selectedContacts, newContactWithId]);
    setNewContact({ name: '', email: '', phone: '', isDriver: false });
    setIsContactDialogOpen(false);
    
    toast.success('Contact added successfully');
  };

  const handleSelectContact = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact && !selectedContacts.some(c => c.id === contactId)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(contact => contact.id !== contactId));
  };

  const handleSaveCart = () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    // In a real app, this would save to your database
    console.log('Saving cart', { items, contacts: selectedContacts, status: 'new order' });
    toast.success('Cart saved as new order');
    onClearCart();
  };

  const handleHoldCart = () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    if (selectedContacts.length === 0) {
      toast.error('Please add at least one contact');
      return;
    }
    
    // In a real app, this would save to your database
    console.log('Holding cart', { items, contacts: selectedContacts, status: 'processing' });
    toast.success('Cart saved as processing');
    onClearCart();
  };

  const handleCompleteCart = () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    // In a real app, this would save to your database and create order/transaction records
    console.log('Completing cart', { items, contacts: selectedContacts, status: 'completed' });
    setShowOrderComplete(true);
  };

  const handlePrint = () => {
    console.log('Printing receipt');
    toast.success('Receipt sent to printer');
    onClearCart();
    setShowOrderComplete(false);
  };

  const handleSend = () => {
    console.log('Sending receipt');
    toast.success('Receipt sent to customer');
    onClearCart();
    setShowOrderComplete(false);
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 dark:text-white">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">Cart</h2>
          <Button 
            variant="ghost" 
            size="icon"
            className="ml-2"
            onClick={() => setIsContactDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-1 items-center">
          {selectedContacts.map(contact => (
            <div key={contact.id} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
              <span>{contact.name}{contact.isDriver ? ' (Driver)' : ''}</span>
              <button onClick={() => handleRemoveContact(contact.id)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(item.product.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => onItemUpdate(item.product.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-2 py-1">{item.quantity}</span>
                    <button
                      onClick={() => onItemUpdate(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onItemRemove(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="ml-4 text-right font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart totals */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          {hasDriver && (
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Cart actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2">
        {showOrderComplete ? (
          <div className="space-y-2">
            <h3 className="text-center font-medium text-green-600 dark:text-green-400 mb-2">
              Order Completed
            </h3>
            <div className="flex gap-2">
              <Button 
                className="flex-1 gap-2"
                onClick={handleSend}
              >
                <span>Send</span>
              </Button>
              <Button 
                variant="outline"
                className="flex-1 gap-2"
                onClick={handlePrint}
              >
                <span>Print</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={handleSaveCart}
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2"
              onClick={handleHoldCart}
            >
              <Pause className="h-4 w-4" />
              <span>Hold</span>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-2 text-red-500 hover:text-red-600"
              onClick={onClearCart}
            >
              <Trash2 className="h-4 w-4" />
              <span>Void</span>
            </Button>
            <Button 
              className="justify-start gap-2"
              onClick={handleCompleteCart}
            >
              <Check className="h-4 w-4" />
              <span>Paid</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Existing Contact</Label>
              <Select onValueChange={handleSelectContact}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} {contact.isDriver ? '(Driver)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-center my-2">
              <span className="text-sm text-gray-500">Or</span>
            </div>
            
            <div className="grid gap-4">
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
                  type="tel"
                  value={newContact.phone} 
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
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
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleAddContact}
              disabled={!newContact.name}
            >
              Add New Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
