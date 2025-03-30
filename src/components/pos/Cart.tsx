import React, { useState } from 'react';
import { CartItem, Contact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';

interface CartProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  onRemoveItem,
  onQuantityChange,
  onClearCart,
}) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    isDriver: false,
  });
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [showOrderComplete, setShowOrderComplete] = useState(false);
  const { settings } = useSettings();

  // Sample contacts for demo
  const contacts: Contact[] = [
    {
      id: 'contact1',
      name: 'John Doe',
      category: 'Client',
    },
    {
      id: 'contact2',
      name: 'Jane Smith',
      category: 'Supplier',
    },
    {
      id: 'contact3',
      name: 'Mike Driver',
      category: 'Driver',
    },
  ];

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();

  // Delivery fee only if a driver is selected
  const hasDriver = selectedContacts.some((contact) => contact.isDriver);
  const deliveryFee = hasDriver ? 5 : 0;

  // Tax and discount are hidden as per requirements
  const total = subtotal + deliveryFee;

  const formatCurrency = (amount: number) => {
    const usd = `$${amount.toFixed(2)}`;
    return `${usd}`;
  };

  const handleAddContact = () => {
    // In a real app, you would save this to your database
    const newContactWithId: Contact = {
      ...newContact,
      id: `contact${Date.now()}`, // Simple ID generation for demo
    };

    setSelectedContacts([...selectedContacts, newContactWithId]);
    setNewContact({ name: '', email: '', phone: '', isDriver: false });
    setIsContactDialogOpen(false);

    toast.success('Contact added successfully');
  };

  const handleSelectContact = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact && !selectedContacts.some((c) => c.id === contactId)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(
      selectedContacts.filter((contact) => contact.id !== contactId)
    );
  };

  const handleSaveCart = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // In a real app, this would save to your database
    console.log('Saving cart', {
      cartItems,
      contacts: selectedContacts,
      status: 'new order',
    });
    toast.success('Cart saved as new order');
    onClearCart();
  };

  const handleHoldCart = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (selectedContacts.length === 0) {
      toast.error('Please add at least one contact');
      return;
    }

    // In a real app, this would save to your database
    console.log('Holding cart', {
      cartItems,
      contacts: selectedContacts,
      status: 'processing',
    });
    toast.success('Cart saved as processing');
    onClearCart();
  };

  const handleCompleteCart = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // In a real app, this would save to your database and create order/transaction records
    console.log('Completing cart', {
      cartItems,
      contacts: selectedContacts,
      status: 'completed',
    });
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
      <div className="border-b border-gray-200 dark:border-gray-700 p-1 flex items-center">
        <h2 className="text-xl font-bold flex-1">Cart</h2>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setIsContactDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-auto p-4">
        {cartItems.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
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
                      onClick={() =>
                        onQuantityChange(
                          item.product.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-2 py-1">{item.quantity}</span>
                    <button
                      onClick={() =>
                        onQuantityChange(item.product.id, item.quantity + 1)
                      }
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
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
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {showOrderComplete ? (
          <div className="space-y-2">
            <h3 className="text-center font-medium text-green-600 dark:text-green-400 mb-2">
              Order Completed
            </h3>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSend}>
                Send
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleSaveCart}
            >
              Save
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleHoldCart}
            >
              Hold
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-red-500 hover:text-red-600"
              onClick={onClearCart}
            >
              Void
            </Button>
            <Button className="flex-1" onClick={handleCompleteCart}>
              Paid
            </Button>
          </div>
        )}
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 absolute top-2 right-2"
              onClick={() => setIsContactDialogOpen(false)}
            >
              <X size={16} />
            </Button>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Existing Contact</Label>
              <Select onValueChange={handleSelectContact}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
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
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isDriver"
                  type="checkbox"
                  checked={newContact.isDriver}
                  onChange={(e) =>
                    setNewContact({ ...newContact, isDriver: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isDriver">This contact is a driver</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAddContact} disabled={!newContact.name}>
              Add New Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
