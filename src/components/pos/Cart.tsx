
import React, { useState } from 'react';
import { Minus, Plus, Trash, Receipt, X, UserPlus, Check, Ban, Save, Clock, CreditCard, Plus as PlusIcon } from 'lucide-react';
import { CartItem } from '@/lib/types';
import PaymentModal from './PaymentModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CartProps {
  items: CartItem[];
  onItemUpdate: (id: string, quantity: number) => void;
  onItemRemove: (id: string) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onItemUpdate, onItemRemove, onClearCart }) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contacts, setContacts] = useState<{id: string, name: string, type: string}[]>([
    { id: '1', name: 'John Doe', type: 'client' },
    { id: '2', name: 'Jane Smith', type: 'client' },
    { id: '3', name: 'Delivery Guy', type: 'driver' }
  ]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState({ name: '', type: 'client' });
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const hasDriverContact = selectedContacts.some(id => 
    contacts.find(c => c.id === id)?.type === 'driver'
  );

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  const tax = subtotal * 0.1; // 10% tax rate example
  const deliveryFee = hasDriverContact ? 5 : 0; // $5 delivery fee
  const total = subtotal + tax + deliveryFee;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      onItemUpdate(id, newQuantity);
    }
  };

  const handleAddContact = () => {
    if (newContact.name.trim() === '') return;
    
    const newContactId = `contact-${Date.now()}`;
    setContacts([...contacts, { 
      id: newContactId, 
      name: newContact.name, 
      type: newContact.type 
    }]);
    setSelectedContacts([...selectedContacts, newContactId]);
    setNewContact({ name: '', type: 'client' });
    toast.success('Contact added');
  };

  const handleSaveCart = () => {
    // In a real app, you would save the cart to a database
    toast.success('Cart saved as a new order');
    onClearCart();
  };

  const handleHoldCart = () => {
    if (selectedContacts.length === 0) {
      toast.error('Please add at least one contact');
      return;
    }
    
    // In a real app, you would save the cart with processing status
    toast.success('Order is now processing');
    onClearCart();
  };

  const handleCompletePayment = () => {
    setPaymentComplete(true);
    // In a real app, you would add to transactions table
    toast.success('Payment completed');
  };

  const handlePrintReceipt = () => {
    // In a real app, you would print the receipt
    toast.success('Receipt printed');
    onClearCart();
    setPaymentComplete(false);
  };

  const handleSendReceipt = () => {
    // In a real app, you would send the receipt
    toast.success('Receipt sent');
    onClearCart();
    setPaymentComplete(false);
  };

  const toggleContactSelection = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 dark:text-white">
      <div className="border-b border-pos-border p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-pos-dark dark:text-white">Current Sale</h2>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-pos-gray text-pos-dark hover:bg-pos-gray/80 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-sm text-red-500 hover:text-red-600 button-transition"
            >
              Clear All
            </button>
          )}
        </div>
        
        {selectedContacts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedContacts.map(id => {
              const contact = contacts.find(c => c.id === id);
              if (!contact) return null;
              
              return (
                <div 
                  key={id} 
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                    contact.type === 'driver' 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}
                >
                  <span>{contact.name}</span>
                  <button 
                    onClick={() => toggleContactSelection(id)}
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {items.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="mb-3 flex items-center gap-3 rounded-lg border border-pos-border p-3 dark:border-gray-700"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-pos-dark line-clamp-1 dark:text-white">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-pos-gray text-pos-dark hover:bg-pos-gray/80 button-transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-pos-gray text-pos-dark hover:bg-pos-gray/80 button-transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => onItemRemove(item.product.id)}
                    className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-pos-danger/10 text-pos-danger hover:bg-pos-danger/20 button-transition"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-pos-border p-4 dark:border-gray-700">
            <div className="mb-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="mb-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {hasDriverContact && (
              <div className="mb-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="mb-4 flex justify-between text-lg font-semibold text-pos-dark dark:text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {paymentComplete ? (
              <div className="flex gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 primary-button flex items-center justify-center gap-2 py-3"
                >
                  <Receipt size={20} />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleSendReceipt}
                  className="flex-1 secondary-button flex items-center justify-center gap-2 py-3"
                >
                  <Receipt size={20} />
                  <span>Send</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleCompletePayment}
                  className="primary-button flex items-center justify-center gap-2 py-3"
                >
                  <Check size={20} />
                  <span>Paid ${total.toFixed(2)}</span>
                </button>
                
                <button
                  onClick={handleSaveCart}
                  className="secondary-button flex items-center justify-center gap-2 py-3"
                >
                  <Save size={20} />
                  <span>Save</span>
                </button>
                
                <button
                  onClick={handleHoldCart}
                  className="secondary-button flex items-center justify-center gap-2 py-3"
                  disabled={selectedContacts.length === 0}
                >
                  <Clock size={20} />
                  <span>Hold</span>
                </button>
                
                <button
                  onClick={onClearCart}
                  className="secondary-button flex items-center justify-center gap-2 py-3 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  <Ban size={20} />
                  <span>Void</span>
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-pos-gray dark:bg-gray-700">
            <Receipt size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-pos-dark dark:text-white">Cart is Empty</h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Add items from the product list</p>
        </div>
      )}

      {/* Contact Selection Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Contacts</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                    selectedContacts.includes(contact.id) 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => toggleContactSelection(contact.id)}
                >
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{contact.type}</p>
                  </div>
                  {selectedContacts.includes(contact.id) && (
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-2">Add New Contact</h4>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="contactName">Name</Label>
                <Input 
                  id="contactName" 
                  value={newContact.name} 
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="contactType">Type</Label>
                <select
                  id="contactType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newContact.type}
                  onChange={(e) => setNewContact({...newContact, type: e.target.value})}
                >
                  <option value="client">Client</option>
                  <option value="team">Team Member</option>
                  <option value="supplier">Supplier</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsContactModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddContact} disabled={!newContact.name.trim()}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
