import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, X, Minus, Plus, CreditCard, ChevronRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, updateCartQuantity, clearCart, placeOrder } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [tableNumber, setTableNumber] = useState('04'); // Mock auto-fill
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0 && !isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await placeOrder({ tableNumber, name: customerName, phone: phoneNumber });
    setIsProcessing(false);
    setStep('success');
  };

  const closeCart = () => {
    setIsOpen(false);
    // Reset state after animation finishes
    setTimeout(() => {
        setStep('cart');
        setCustomerName('');
        setPhoneNumber('');
    }, 300);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-amber-600 text-white p-4 rounded-full shadow-2xl shadow-amber-900/50 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag />
            <span className="font-bold text-lg">{totalItems}</span>
            <span className="bg-amber-700/50 px-2 py-1 rounded text-sm">
              ${total.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out transform max-h-[90vh] flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={closeCart}>
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {step === 'cart' && 'Your Order'}
            {step === 'checkout' && 'Checkout'}
            {step === 'success' && 'Order Placed'}
          </h2>
          <button onClick={closeCart} className="text-slate-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {step === 'cart' && (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-800" />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{item.name}</h4>
                    <p className="text-amber-500 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-800 rounded-full px-3 py-1">
                    <button onClick={() => updateCartQuantity(item.id, -1)} className="text-slate-400 hover:text-white p-1">
                      <Minus size={16} />
                    </button>
                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, 1)} className="text-slate-400 hover:text-white p-1">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center text-slate-500 py-10">Your cart is empty</div>
              )}
            </div>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Table Number</label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name (Optional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg mt-4 border border-slate-800">
                <div className="flex justify-between mb-2 text-slate-400">
                   <span>Subtotal</span>
                   <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-lg">
                   <span>Total</span>
                   <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
              <p className="text-slate-400">The kitchen has received your order for Table {tableNumber}.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 pb-10 md:pb-6">
          {step === 'cart' && cart.length > 0 && (
            <button
              onClick={() => setStep('checkout')}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Checkout <ChevronRight />
            </button>
          )}

          {step === 'checkout' && (
             <div className="space-y-3">
                 <button
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                    {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)} & Order`}
                </button>
                <button
                    onClick={() => setStep('cart')}
                    disabled={isProcessing}
                    className="w-full text-slate-400 py-2 font-medium"
                >
                    Back to Cart
                </button>
             </div>
          )}

          {step === 'success' && (
            <button
              onClick={closeCart}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
            >
              Start New Order
            </button>
          )}
        </div>
      </div>
    </>
  );
};
