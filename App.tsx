import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { CustomerApp } from './components/CustomerApp';
import { AdminDashboard } from './components/AdminDashboard';
import { ChefHat, Smartphone } from 'lucide-react';

const App: React.FC = () => {
  // Simple view state management
  const [view, setView] = useState<'customer' | 'admin'>('customer');

  return (
    <StoreProvider>
      <div className="relative">
        {view === 'customer' ? <CustomerApp /> : <AdminDashboard />}
        
        {/* Toggle Button for Demo Purposes */}
        <div className="fixed bottom-4 left-4 z-50 opacity-30 hover:opacity-100 transition-opacity">
            <button 
                onClick={() => setView(view === 'customer' ? 'admin' : 'customer')}
                className="bg-slate-800/80 backdrop-blur text-white p-2 rounded-full border border-slate-600 shadow-lg"
                title="Toggle View (Demo)"
            >
                {view === 'customer' ? <ChefHat size={20} /> : <Smartphone size={20} />}
            </button>
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
