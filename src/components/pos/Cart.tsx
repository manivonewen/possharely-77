
import React, { useState } from 'react';
import { Minus, Plus, Trash, Receipt, X } from 'lucide-react';
import { CartItem } from '@/lib/types';
import PaymentModal from './PaymentModal';

interface CartProps {
  items: CartItem[];
  onItemUpdate: (id: string, quantity: number) => void;
  onItemRemove: (id: string) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onItemUpdate, onItemRemove, onClearCart }) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  const tax = subtotal * 0.1; // 10% tax rate example
  const total = subtotal + tax;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      onItemUpdate(id, newQuantity);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    onClearCart();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-pos-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-pos-dark">Current Sale</h2>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-sm text-red-500 hover:text-red-600 button-transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {items.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="mb-3 flex items-center gap-3 rounded-lg border border-pos-border p-3"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-pos-dark line-clamp-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-pos-gray text-pos-dark hover:bg-pos-gray/80 button-transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-pos-gray text-pos-dark hover:bg-pos-gray/80 button-transition"
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

          <div className="border-t border-pos-border p-4">
            <div className="mb-1 flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="mb-3 flex justify-between text-sm text-gray-500">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="mb-4 flex justify-between text-lg font-semibold text-pos-dark">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setPaymentModalOpen(true)}
              className="w-full primary-button flex items-center justify-center gap-2 py-3"
            >
              <Receipt size={20} />
              <span>Charge ${total.toFixed(2)}</span>
            </button>
          </div>

          <PaymentModal
            isOpen={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            total={total}
            items={items}
            onPaymentComplete={handlePaymentComplete}
          />
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-pos-gray">
            <Receipt size={24} className="text-gray-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-pos-dark">Cart is Empty</h3>
          <p className="mb-4 text-sm text-gray-500">Add items from the product list</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
