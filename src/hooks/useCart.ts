import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/lib/types';
import { useAuth } from './useAuth';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Module-level shared store so all hook instances stay in sync
let sharedCartItems: CartItem[] = [];
let sharedShowNotification = false;
let sharedLastAddedProduct = '';
let sharedShowBadgeNotification = false;
let sharedChangeAmount = 0;
let currentCartKeyGlobal = '';
const subscribers = new Set<() => void>();

const notifySubscribers = () => {
  subscribers.forEach((cb) => cb());
};

export const useCart = () => {
  const { authUser } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>(sharedCartItems);
  const [showNotification, setShowNotification] = useState(sharedShowNotification);
  const [lastAddedProduct, setLastAddedProduct] = useState<string>(sharedLastAddedProduct);
  const [showBadgeNotification, setShowBadgeNotification] = useState(sharedShowBadgeNotification);
  const [changeAmount, setChangeAmount] = useState(sharedChangeAmount);
  const [cartReady, setCartReady] = useState(false);

  // Get cart key based on user ID or use default for anonymous users
  const getCartKey = useMemo(() => {
    return authUser ? `cart_${authUser.id}` : 'cart_anonymous';
  }, [authUser]);

  useEffect(() => {
    // Subscribe to shared store updates
    const onChange = () => {
      setCartItems([...sharedCartItems]);
      setShowNotification(sharedShowNotification);
      setLastAddedProduct(sharedLastAddedProduct);
      setShowBadgeNotification(sharedShowBadgeNotification);
      setChangeAmount(sharedChangeAmount);
    };
    subscribers.add(onChange);

    // Load from storage when cart key changes
    const cartKey = getCartKey;
    if (currentCartKeyGlobal !== cartKey) {
      currentCartKeyGlobal = cartKey;
      const savedCart = localStorage.getItem(cartKey);
      try {
        sharedCartItems = savedCart ? JSON.parse(savedCart) : [];
      } catch {
        sharedCartItems = [];
      }
      notifySubscribers();
    } else if (cartItems.length === 0 && sharedCartItems.length > 0) {
      // Sync initial state if store already populated
      onChange();
    }

    // Mark cart as ready after initial sync
    setCartReady(true);

    return () => {
      subscribers.delete(onChange);
    };
  }, [getCartKey]);

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string, quantity: number = 1) => {
    const existingItemIndex = cartItems.findIndex(
      item => 
        item.product.product_id === product.product_id && 
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        selectedSize,
        selectedColor
      };
      updatedCart = [...cartItems, newItem];
    }

    sharedCartItems = updatedCart;
    localStorage.setItem(getCartKey, JSON.stringify(updatedCart));

    // Show notification animation
    sharedLastAddedProduct = product.name;
    sharedShowNotification = true;

    // Show badge notification
    sharedChangeAmount = quantity;
    sharedShowBadgeNotification = true;
    // Notify listeners (e.g., header) about cart count change
    try {
      const total = sharedCartItems.reduce((sum, i) => sum + i.quantity, 0);
      window.dispatchEvent(new CustomEvent('cart:changed', { detail: { key: getCartKey, total } }));
    } catch (e) {
      // ignore dispatch errors in non-DOM environments (tests)
    }
    notifySubscribers();
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    const itemToRemove = cartItems.find(
      item => 
        item.product.product_id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    
    const updatedCart = cartItems.filter(
      item => !(
        item.product.product_id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      )
    );
    
    sharedCartItems = updatedCart;
    localStorage.setItem(getCartKey, JSON.stringify(updatedCart));

    // Show badge notification for removal
    if (itemToRemove) {
      sharedChangeAmount = -itemToRemove.quantity;
      sharedShowBadgeNotification = true;
    }
    try {
      const total = sharedCartItems.reduce((sum, i) => sum + i.quantity, 0);
      window.dispatchEvent(new CustomEvent('cart:changed', { detail: { key: getCartKey, total } }));
    } catch (e) {
      // ignore
    }
    notifySubscribers();
  };

  const updateQuantity = (productId: string, newQuantity: number, selectedSize?: string, selectedColor?: string) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    const currentItem = cartItems.find(item => 
      item.product.product_id === productId && 
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    const updatedCart = cartItems.map(item => {
      if (
        item.product.product_id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      ) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    sharedCartItems = updatedCart;
    localStorage.setItem(getCartKey, JSON.stringify(updatedCart));

    // Show badge notification for quantity change
    if (currentItem) {
      const difference = newQuantity - currentItem.quantity;
      if (difference !== 0) {
        sharedChangeAmount = difference;
        sharedShowBadgeNotification = true;
      }
    }
    try {
      const total = sharedCartItems.reduce((sum, i) => sum + i.quantity, 0);
      window.dispatchEvent(new CustomEvent('cart:changed', { detail: { key: getCartKey, total } }));
    } catch (e) {
      // ignore
    }
    notifySubscribers();
  };

  const clearCart = () => {
    sharedCartItems = [];
    localStorage.removeItem(getCartKey);
    try {
      window.dispatchEvent(new CustomEvent('cart:changed', { detail: { key: getCartKey, total: 0 } }));
    } catch (e) {
      // ignore
    }
    notifySubscribers();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product.price);
      return total + (price * item.quantity);
    }, 0);
  };

  const hideNotification = () => {
    sharedShowNotification = false;
    notifySubscribers();
  };

  const hideBadgeNotification = () => {
    sharedShowBadgeNotification = false;
    notifySubscribers();
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    showNotification,
    lastAddedProduct,
    hideNotification,
    showBadgeNotification,
    changeAmount,
    hideBadgeNotification,
    cartReady
  };
};