import React from 'react';
import { MenuItem } from '../types';
import { Plus, Ban } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MenuGridProps {
  items: MenuItem[];
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  const { addToCart, cart } = useStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <p>No items found in this category.</p>
      </div>
    );
  }

  const getCartQuantity = (itemId: string) => {
      return cart.find(c => c.id === itemId)?.quantity || 0;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 pb-24">
      {items.map((item) => {
        const isSoldOut = !item.available || item.stock === 0;
        const cartQty = getCartQuantity(item.id);
        const remainingStock = item.stock - cartQty;

        return (
        <div
          key={item.id}
          className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col ${
            isSoldOut ? 'opacity-60' : ''
          }`}
        >
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rounded rotate-12">
                  SOLD OUT
                </span>
              </div>
            )}
            {!isSoldOut && (
              <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm text-amber-500 font-bold px-3 py-1 rounded-full text-sm">
                ${item.price.toFixed(2)}
              </div>
            )}
             {!isSoldOut && item.stock < 10 && (
                <div className="absolute bottom-2 right-2 bg-red-600/90 text-white font-bold px-2 py-0.5 rounded text-xs">
                    Only {item.stock} left
                </div>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-white leading-tight">
                {item.name}
              </h3>
            </div>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
              {item.description}
            </p>

            <button
              onClick={() => !isSoldOut && remainingStock > 0 && addToCart(item)}
              disabled={isSoldOut || remainingStock <= 0}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                !isSoldOut && remainingStock > 0
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {!isSoldOut && remainingStock > 0 ? (
                <>
                  <Plus size={18} /> Add to Order
                </>
              ) : (
                <>
                  <Ban size={18} /> {isSoldOut ? 'Unavailable' : 'Max Added'}
                </>
              )}
            </button>
          </div>
        </div>
      )}}
    </div>
  );
};
