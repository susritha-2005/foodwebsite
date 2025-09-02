export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string | null;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          address?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string | null;
          role?: 'customer' | 'admin';
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image: string;
          is_veg: boolean;
          is_available: boolean;
          ingredients: string[];
          spice_level: 'mild' | 'medium' | 'spicy';
          preparation_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image: string;
          is_veg?: boolean;
          is_available?: boolean;
          ingredients: string[];
          spice_level: 'mild' | 'medium' | 'spicy';
          preparation_time: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image?: string;
          is_veg?: boolean;
          is_available?: boolean;
          ingredients?: string[];
          spice_level?: 'mild' | 'medium' | 'spicy';
          preparation_time?: number;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: any[];
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
          order_time: string;
          estimated_delivery_time: string;
          delivery_address: string;
          payment_status: 'pending' | 'completed' | 'failed';
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          items: any[];
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
          order_time?: string;
          estimated_delivery_time: string;
          delivery_address: string;
          payment_status?: 'pending' | 'completed' | 'failed';
          payment_method: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          items?: any[];
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
          order_time?: string;
          estimated_delivery_time?: string;
          delivery_address?: string;
          payment_status?: 'pending' | 'completed' | 'failed';
          payment_method?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          is_bot: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          is_bot?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          is_bot?: boolean;
        };
      };
    };
  };
}