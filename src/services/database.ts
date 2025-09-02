import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { User, MenuItem, Order, CartItem } from '../types';

type Tables = Database['public']['Tables'];

// User operations
export const userService = {
  async createUser(userData: Omit<User, 'id'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        role: userData.role
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role
    };
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role
    };
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        address: updates.address,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: data.role
    };
  }
};

// Menu operations
export const menuService = {
  async getAllMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isVeg: item.is_veg,
      isAvailable: item.is_available,
      ingredients: item.ingredients,
      spiceLevel: item.spice_level,
      preparationTime: item.preparation_time
    }));
  },

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching menu items by category:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isVeg: item.is_veg,
      isAvailable: item.is_available,
      ingredients: item.ingredients,
      spiceLevel: item.spice_level,
      preparationTime: item.preparation_time
    }));
  },

  async updateMenuItemAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('menu_items')
      .update({ 
        is_available: isAvailable,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating menu item availability:', error);
      return false;
    }

    return true;
  }
};

// Order operations
export const orderService = {
  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        items: orderData.items,
        total_amount: orderData.totalAmount,
        status: orderData.status,
        order_time: orderData.orderTime.toISOString(),
        estimated_delivery_time: orderData.estimatedDeliveryTime.toISOString(),
        delivery_address: orderData.deliveryAddress,
        payment_status: orderData.paymentStatus,
        payment_method: orderData.paymentMethod
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      items: data.items,
      totalAmount: data.total_amount,
      status: data.status,
      orderTime: new Date(data.order_time),
      estimatedDeliveryTime: new Date(data.estimated_delivery_time),
      deliveryAddress: data.delivery_address,
      paymentStatus: data.payment_status,
      paymentMethod: data.payment_method
    };
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }

    return data.map(order => ({
      id: order.id,
      userId: order.user_id,
      items: order.items,
      totalAmount: order.total_amount,
      status: order.status,
      orderTime: new Date(order.order_time),
      estimatedDeliveryTime: new Date(order.estimated_delivery_time),
      deliveryAddress: order.delivery_address,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method
    }));
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }

    return data.map(order => ({
      id: order.id,
      userId: order.user_id,
      items: order.items,
      totalAmount: order.total_amount,
      status: order.status,
      orderTime: new Date(order.order_time),
      estimatedDeliveryTime: new Date(order.estimated_delivery_time),
      deliveryAddress: order.delivery_address,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method
    }));
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  }
};

// Chat operations
export const chatService = {
  async saveChatMessage(userId: string, message: string, isBot: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message,
        is_bot: isBot
      });

    if (error) {
      console.error('Error saving chat message:', error);
      return false;
    }

    return true;
  },

  async getUserChatHistory(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }

    return data.map(msg => ({
      id: msg.id,
      text: msg.message,
      isBot: msg.is_bot,
      timestamp: new Date(msg.created_at)
    }));
  }
};