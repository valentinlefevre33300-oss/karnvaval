import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  shipping_cost: number;
  total: number;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_method: string;
  payment_method: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  promo_code_used?: string;
  discount_amount?: number;
  promo_code_id?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_brand?: string;
  product_category?: string;
  product_image_url?: string;
  price: number;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  total: number;
  created_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!authUser) {
      console.log('No authUser, cannot fetch orders');
      return;
    }
    
    setLoading(true);
    try {
      console.log('[useOrders] fetchOrders start');
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders fetch error:', ordersError);
        throw ordersError;
      }
      console.log('[useOrders] fetchOrders success', { count: ordersData?.length || 0 });
      setOrders(ordersData || []);
    } catch (error) {
      console.error('[useOrders] Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  const fetchUserOrders = useCallback(async () => {
    if (!authUser) {
      console.log('No authUser, cannot fetch user orders');
      return;
    }
    
    setLoading(true);
    try {
      console.log('[useOrders] fetchUserOrders start', { userId: authUser.id });
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('User orders fetch error:', ordersError);
        throw ordersError;
      }
      console.log('[useOrders] fetchUserOrders success', { count: ordersData?.length || 0 });
      setOrders(ordersData || []);
    } catch (error) {
      console.error('[useOrders] Error fetching user orders:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'user_id'>, orderItems: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]) => {
    if (!authUser) throw new Error('User not authenticated');

    try {
      console.log('[useOrders] createOrder start', { items: orderItems.length });
      // Generate order number
      const { data: orderNumber, error: numberError } = await supabase
        .rpc('generate_order_number');

      if (numberError) throw numberError;
      console.log('[useOrders] got order number', { orderNumber });

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          order_number: orderNumber,
          user_id: authUser.id,
        })
        .select()
        .single();

      if (orderError) throw orderError;
      console.log('[useOrders] order inserted', { id: order.id });

      // Create order items
      const itemsToInsert = orderItems.map(item => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
      console.log('[useOrders] items inserted', { count: itemsToInsert.length });

      // Send order confirmation email
      try {
        console.log('[useOrders] invoking function send-order-confirmation');
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            order: {
              ...order,
              order_number: orderNumber,
            },
            items: itemsToInsert.map(item => ({
              product_name: item.product_name,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              selected_color: item.selected_color,
              selected_size: item.selected_size,
            })),
            promo_info: order.promo_code_used ? {
              code: order.promo_code_used,
              discount_amount: order.discount_amount,
              original_subtotal: order.subtotal + order.discount_amount
            } : null,
          },
        });
        console.log('[useOrders] function invoked ok');
      } catch (emailError) {
        console.error('[useOrders] Error sending order confirmation email:', emailError);
        // Don't throw error for email failure, order is still created
      }

      return order;
    } catch (error) {
      console.error('[useOrders] Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
    try {
      const updateData: Partial<Pick<Order, 'status' | 'notes'>> = { status };
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  // Don't auto-fetch orders on mount, let components control when to fetch
  // useEffect(() => {
  //   if (authUser) {
  //     fetchUserOrders();
  //   }
  // }, [authUser, fetchUserOrders]);

  return {
    orders,
    loading,
    fetchOrders,
    fetchUserOrders,
    createOrder,
    updateOrderStatus,
  };
};