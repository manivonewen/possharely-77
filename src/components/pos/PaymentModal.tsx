
import React, { useState } from 'react';
import { X, CreditCard, Mail, Share2 } from 'lucide-react';
import { CartItem } from '@/lib/types';
import ReceiptShare from './ReceiptShare';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: CartItem[];
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  items,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  
  const handlePayment = () => {
    // Here you would process the payment
    console.log('Processing payment:', {
      method: paymentMethod,
      total,
      cashAmount: cashAmount ? parseFloat(cashAmount) : null,
    });
    
    // In a real application, you'd communicate with a payment processor
    
    // Instead of sending email, open share dialog
    setShareOpen(true);
  };

  const handleShareComplete = () => {
    setShareOpen(false);
    onPaymentComplete();
  };

  if (!isOpen) return null;

  // Calculate change if paying with cash
  const cashAmountNum = cashAmount ? parseFloat(cashAmount) : 0;
  const change = cashAmountNum > total ? cashAmountNum - total : 0;

  // Quick cash buttons
  const quickCashAmounts = [10, 20, 50, 100];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container max-w-md mx-4" 
        onClick={(e) => e.stopPropagation()}
      >
        {shareOpen ? (
          <ReceiptShare 
            items={items} 
            total={total} 
            onClose={handleShareComplete}
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-pos-border p-4">
              <h2 className="text-xl font-semibold text-pos-dark">Payment</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-pos-gray button-transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex justify-center">
                <span className="text-3xl font-bold text-pos-dark">${total.toFixed(2)}</span>
              </div>

              <div className="mb-6">
                <p className="mb-2 text-sm font-medium text-gray-700">Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 button-transition ${
                      paymentMethod === 'cash'
                        ? 'border-pos-blue bg-pos-blue/10 text-pos-blue'
                        : 'border-pos-border text-gray-700 hover:bg-pos-gray'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <span className="font-medium">Cash</span>
                  </button>
                  <button
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 button-transition ${
                      paymentMethod === 'card'
                        ? 'border-pos-blue bg-pos-blue/10 text-pos-blue'
                        : 'border-pos-border text-gray-700 hover:bg-pos-gray'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={18} />
                    <span className="font-medium">Card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-gray-700">Cash Amount</p>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="input-field w-full mb-3"
                  />
                  
                  <div className="grid grid-cols-4 gap-2">
                    {quickCashAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCashAmount(amount.toString())}
                        className="secondary-button py-2 px-3"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  {change > 0 && (
                    <div className="mt-3 rounded-lg bg-pos-lightBlue p-3">
                      <p className="text-sm font-medium text-pos-dark">
                        Change: ${change.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handlePayment}
                className="primary-button w-full py-3"
                disabled={paymentMethod === 'cash' && (cashAmountNum < total)}
              >
                Complete Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
