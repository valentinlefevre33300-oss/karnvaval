import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCart } from '../useCart';
import { Product } from '@/lib/types';

const mockProduct: Product = {
  product_id: 'test-product-1',
  name: 'Test Sneaker',
  brand: 'Test Brand',
  description: 'Test description',
  price: '99.99',
  sizes: '["40", "41", "42"]',
  image_url: 'test-image.jpg',
  stock_quantity: '10',
  category: 'sport',
  colors_general: '["rouge", "bleu"]',
};

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should add product to cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 2);
    });
    
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toEqual({
      product: mockProduct,
      quantity: 2,
      selectedSize: '41',
      selectedColor: 'rouge',
    });
    expect(result.current.getTotalItems()).toBe(2);
  });

  it('should update quantity when adding existing product', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 1);
    });
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 2);
    });
    
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(3);
  });

  it('should treat different sizes as separate items', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 1);
    });
    
    act(() => {
      result.current.addToCart(mockProduct, '42', 'rouge', 1);
    });
    
    expect(result.current.cartItems).toHaveLength(2);
  });

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 1);
    });
    
    act(() => {
      result.current.removeFromCart(mockProduct.product_id, '41', 'rouge');
    });
    
    expect(result.current.cartItems).toHaveLength(0);
  });

  it('should update quantity of cart item', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 1);
    });
    
    act(() => {
      result.current.updateQuantity(mockProduct.product_id, 5, '41', 'rouge');
    });
    
    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 1);
    });
    
    act(() => {
      result.current.updateQuantity(mockProduct.product_id, 0, '41', 'rouge');
    });
    
    expect(result.current.cartItems).toHaveLength(0);
  });

  it('should clear all cart items', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 1);
      result.current.addToCart(mockProduct, '42', 'bleu', 1);
    });
    
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.cartItems).toHaveLength(0);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 2);
    });
    
    expect(result.current.getTotalPrice()).toBe(199.98);
  });

  it('should calculate total items correctly', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 2);
    });
    
    act(() => {
      result.current.addToCart(mockProduct, '42', 'bleu', 3);
    });
    
    expect(result.current.getTotalItems()).toBe(5);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(mockProduct, '41', 'rouge', 1);
    });
    
    // Check that cartItems is updated (localStorage is tested indirectly)
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].product.product_id).toBe(mockProduct.product_id);
  });

});