import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, StoreContextType } from '../types';
import { INITIAL_MENU } from '../services/mockData';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from local storage or defaults
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // Check stock limit
        if (existing.quantity >= item.stock) return prev;
        
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const itemInMenu = menuItems.find(m => m.id === itemId);
          const maxStock = itemInMenu ? itemInMenu.stock : i.quantity;
          
          const newQuantity = i.quantity + delta;
          
          // Ensure quantity doesn't exceed stock
          if (newQuantity > maxStock) return i;

          return { ...i, quantity: Math.max(0, newQuantity) };
        }
        return i;
      }).filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  // Order Logic
  const placeOrder = async (details: { tableNumber: string; name: string; phone: string }) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          tableNumber: details.tableNumber,
          customerName: details.name,
          phoneNumber: details.phone,
          items: [...cart],
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: OrderStatus.PENDING,
          timestamp: Date.now(),
        };

        // Decrement Stock
        setMenuItems(prevMenu => prevMenu.map(menuItem => {
            const cartItem = cart.find(c => c.id === menuItem.id);
            if (cartItem) {
                const newStock = Math.max(0, menuItem.stock - cartItem.quantity);
                return {
                    ...menuItem,
                    stock: newStock,
                    available: newStock > 0 // Auto mark unavailable if stock hits 0
                };
            }
            return menuItem;
        }));

        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        resolve();
      }, 1500); // Simulate network delay
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Menu Management Logic
  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteMenuItem = (id: string) => {
      setMenuItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <StoreContext.Provider
      value={{
        menuItems,
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        toggleItemAvailability,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
