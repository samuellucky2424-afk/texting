import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import { MenuGrid } from './MenuGrid';
import { CartDrawer } from './CartDrawer';
import { UtensilsCrossed } from 'lucide-react';

export const CustomerApp: React.FC = () => {
  const { menuItems } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category>(Category.STARTERS);

  const filteredItems = useMemo(() => 
    menuItems.filter((item) => item.category === activeCategory),
  [menuItems, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-amber-600 p-2 rounded-lg text-white">
                    <UtensilsCrossed size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white leading-none">GourmetFlow</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Table Ordering</p>
                </div>
            </div>
            <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-400">
                Table 04
            </div>
        </div>

        {/* Category Tabs - Scrollable on mobile */}
        <div className="max-w-4xl mx-auto px-4 pb-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 min-w-max pb-3">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-6">
          <div className="px-4 mb-4">
            <h2 className="text-2xl font-bold text-white">{activeCategory}</h2>
            <p className="text-slate-400 text-sm">Select items to add to your order.</p>
          </div>
        <MenuGrid items={filteredItems} />
      </main>

      <CartDrawer />
    </div>
  );
};
