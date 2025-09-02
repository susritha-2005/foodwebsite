export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'customer' | 'admin';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  ingredients: string[];
  spiceLevel: 'mild' | 'medium' | 'spicy';
  preparationTime: number; // in minutes
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  orderTime: Date;
  estimatedDeliveryTime: Date;
  deliveryAddress: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  totalMenuItems: number;
}