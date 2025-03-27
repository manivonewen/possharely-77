
import React from 'react';
import { X, Share2 } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface ReceiptShareProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
}

const ReceiptShare: React.FC<ReceiptShareProps> = ({ items, total, onClose }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const tax = total - subtotal;
  const date = new Date();
  
  const receiptData = {
    items,
    subtotal,
    tax,
    total,
    date: date.toLocaleString(),
    orderNumber: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  };
  
  const receiptText = `
Order #: ${receiptData.orderNumber}
Date: ${receiptData.date}

ITEMS
${items.map(item => `${item.product.name} x${item.quantity} $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${subtotal.toFixed(2)}
Tax: $${tax.toFixed(2)}
Total: $${total.toFixed(2)}

Thank you for your purchase!
  `.trim();
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt #${receiptData.orderNumber}`,
          text: receiptText,
        });
        console.log('Receipt shared successfully');
        onClose();
      } catch (error) {
        console.error('Error sharing receipt:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(receiptText);
        alert('Receipt copied to clipboard');
        onClose();
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };
  
  return (
    <div className="h-full">
      <div className="flex items-center justify-between border-b border-pos-border p-4">
        <h2 className="text-xl font-semibold text-pos-dark">Receipt</h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-pos-gray button-transition"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="mb-6 rounded-lg border border-pos-border bg-white p-4">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-pos-dark">Loyverse POS</h3>
            <p className="text-sm text-gray-500">Receipt #{receiptData.orderNumber}</p>
            <p className="text-sm text-gray-500">{receiptData.date}</p>
          </div>
          
          <div className="mb-4">
            <div className="mb-2 border-b border-pos-border pb-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Item</span>
                <span>Total</span>
              </div>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="mb-2 flex justify-between py-1 text-sm">
                <div>
                  <p>{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    ${item.product.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-pos-border pt-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
        
        <button
          onClick={handleShare}
          className="primary-button flex w-full items-center justify-center gap-2 py-3"
        >
          <Share2 size={18} />
          <span>Share Receipt</span>
        </button>
      </div>
    </div>
  );
};

export default ReceiptShare;
