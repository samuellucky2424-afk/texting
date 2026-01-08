import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus, Category, MenuItem } from '../types';
import { 
  ClipboardList, 
  ChefHat, 
  CheckCircle, 
  Clock, 
  LayoutDashboard, 
  Menu as MenuIcon,
  ToggleLeft,
  ToggleRight,
  Trash2,
  PlusCircle,
  X,
  XCircle,
  AlertTriangle,
  Pencil,
  Box
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'orders' | 'menu'>('orders');
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-xl flex items-center gap-2">
            <span className="text-amber-500">Admin</span> Dashboard
        </h1>
        <div className="flex bg-slate-800 rounded-lg p-1">
            <button 
                onClick={() => setTab('orders')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${tab === 'orders' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                <LayoutDashboard size={16} /> Live Orders
            </button>
            <button 
                onClick={() => setTab('menu')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${tab === 'menu' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                <MenuIcon size={16} /> Menu Manager
            </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {tab === 'orders' ? <OrdersView /> : <MenuManager />}
      </main>
    </div>
  );
};

const OrdersView: React.FC = () => {
    const { orders, updateOrderStatus } = useStore();
    
    // Sort orders: Pending first, then Preparing, then Completed (newest first)
    const sortedOrders = [...orders].sort((a, b) => {
        if (a.status === b.status) return b.timestamp - a.timestamp;
        const priority = { [OrderStatus.PENDING]: 0, [OrderStatus.PREPARING]: 1, [OrderStatus.COMPLETED]: 2, [OrderStatus.CANCELLED]: 3 };
        return priority[a.status] - priority[b.status];
    });

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case OrderStatus.PREPARING: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case OrderStatus.COMPLETED: return 'bg-green-500/10 text-green-500 border-green-500/20';
            case OrderStatus.CANCELLED: return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedOrders.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-500">
                    <ClipboardList className="mx-auto mb-4 opacity-50" size={48} />
                    <p>No orders yet.</p>
                </div>
            )}
            {sortedOrders.map(order => (
                <div key={order.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
                        <div>
                            <div className="text-2xl font-bold text-white">Table {order.tableNumber}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                <Clock size={12} /> {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                {order.customerName && <span className="ml-2 border-l border-slate-700 pl-2">{order.customerName}</span>}
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 mb-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-10 h-10 rounded-md object-cover bg-slate-800 border border-slate-800"
                                    />
                                    <span className="text-slate-300">
                                        <span className="font-bold text-white mr-1">{item.quantity}x</span> 
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-slate-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-800 flex justify-between items-center gap-2">
                        <div className="font-bold text-white">${order.total.toFixed(2)}</div>
                        <div className="flex gap-2">
                            {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PREPARING) && (
                                <button 
                                    onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                    title="Cancel Order"
                                >
                                    <XCircle size={16} /> <span className="hidden xl:inline">Cancel</span>
                                </button>
                            )}

                            {order.status === OrderStatus.PENDING && (
                                <button 
                                    onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    <ChefHat size={16} /> Cook
                                </button>
                            )}
                            {order.status === OrderStatus.PREPARING && (
                                <button 
                                    onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    <CheckCircle size={16} /> Complete
                                </button>
                            )}
                             {order.status === OrderStatus.COMPLETED && (
                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                    <CheckCircle size={16} /> Done
                                </span>
                            )}
                            {order.status === OrderStatus.CANCELLED && (
                                <span className="text-red-500 text-sm flex items-center gap-1">
                                    <XCircle size={16} /> Cancelled
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MenuManager: React.FC = () => {
    const { menuItems, toggleItemAvailability, deleteMenuItem, addMenuItem, updateMenuItem } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: Category.STARTERS, image: '', stock: '20'
    });

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name,
                description: editingItem.description,
                price: editingItem.price.toString(),
                category: editingItem.category,
                image: editingItem.image,
                stock: editingItem.stock.toString()
            });
            setIsFormOpen(true);
        }
    }, [editingItem]);

    const openAddForm = () => {
        setEditingItem(null);
        setFormData({ name: '', description: '', price: '', category: Category.STARTERS, image: '', stock: '20' });
        setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.image || `https://picsum.photos/400/300?random=${Math.random()}`,
            stock: parseInt(formData.stock),
            available: parseInt(formData.stock) > 0
        };

        if (editingItem) {
            updateMenuItem(editingItem.id, payload);
        } else {
            addMenuItem({
                ...payload,
                available: true
            });
        }
        
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteMenuItem(itemToDelete);
            setItemToDelete(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-red-500 mb-2">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-bold text-white">Delete Item?</h3>
                        </div>
                        <p className="text-slate-400 mb-6">
                            Are you sure you want to delete this menu item? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setItemToDelete(null)}
                                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold">Menu Items ({menuItems.length})</h2>
                 <button 
                    onClick={openAddForm}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                >
                    <PlusCircle size={18} /> Add Item
                 </button>
            </div>

            {isFormOpen && (
                <div className="mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold">{editingItem ? 'Edit Item' : 'New Item'}</h3>
                        <button onClick={() => setIsFormOpen(false)}><X size={20} className="text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs text-slate-400 mb-1">Item Name</label>
                                <input 
                                    placeholder="e.g. Burger" 
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Price ($)</label>
                                <input 
                                    placeholder="0.00" 
                                    type="number" step="0.01" 
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stock Qty</label>
                                <input 
                                    placeholder="Qty" 
                                    type="number" step="1" 
                                    required
                                    value={formData.stock}
                                    onChange={e => setFormData({...formData, stock: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                />
                            </div>
                        </div>
                        
                        <div>
                             <label className="block text-xs text-slate-400 mb-1">Image URL</label>
                             <input 
                                placeholder="https://..." 
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                            />
                        </div>

                        <div>
                             <label className="block text-xs text-slate-400 mb-1">Description</label>
                            <textarea 
                                placeholder="Ingredients, taste, etc." 
                                required
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white h-20" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Category</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
                            >
                                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-medium">
                            {editingItem ? 'Update Item' : 'Save Item'}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                {menuItems.map(item => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center gap-4 group">
                         <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover bg-slate-800" />
                         <div className="flex-1">
                             <div className="font-medium text-white">{item.name}</div>
                             <div className="text-xs text-slate-500 flex items-center gap-3">
                                <span>${item.price.toFixed(2)} • {item.category}</span>
                                <span className={`flex items-center gap-1 ${item.stock === 0 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                    <Box size={12} /> {item.stock} left
                                </span>
                             </div>
                         </div>
                         
                         <div className="flex gap-1">
                            <button 
                                onClick={() => setEditingItem(item)}
                                className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                title="Edit Item"
                            >
                                <Pencil size={20} />
                            </button>
                            <button 
                                onClick={() => toggleItemAvailability(item.id)}
                                className={`p-2 rounded-lg transition-colors ${item.available && item.stock > 0 ? 'text-green-500 hover:bg-green-500/10' : 'text-slate-600 hover:bg-slate-800'}`}
                                title="Toggle Availability"
                            >
                                {item.available && item.stock > 0 ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            </button>
                            <button 
                                onClick={() => setItemToDelete(item.id)}
                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete Item"
                            >
                                <Trash2 size={20} />
                            </button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
