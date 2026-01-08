export enum Category {
  STARTERS = 'Starters',
  MAINS = 'Mains',
  DRINKS = 'Drinks',
  SPECIALS = 'Specials',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
  stock: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName?: string;
  phoneNumber?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
}

export interface StoreContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (details: { tableNumber: string; name: string; phone: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleItemAvailability: (itemId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
}
