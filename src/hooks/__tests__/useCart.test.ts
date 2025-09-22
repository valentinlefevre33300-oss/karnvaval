import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';
import { Product } from '@/lib/types';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useCart', () => {
  const mockProduct: Product = {
    product_id: '1',
    name: 'Test Sneaker',
    brand: 'Nike',
    description: 'A test sneaker',
    price: '100',
    sizes: ['40', '41', '42'],
    image_url: 'test-image.jpg',
    stock_quantity: '10',
    category: 'sneakers',
    colors_general: 'white',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should load cart from localStorage on initialization', () => {
    const savedCart = [
      {
        product: mockProduct,
        size: '41',
        quantity: 2,
      },
    ];

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedCart));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual(savedCart);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(200);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, '41', 1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      product: mockProduct,
      size: '41',
      quantity: 1,
    });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(100);
  });

  it('should update quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, '41', 1);
      result.current.addToCart(mockProduct, '41', 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(300);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, '41', 2);
      result.current.removeFromCart(mockProduct.product_id, '41');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, '41', 2);
      result.current.updateQuantity(mockProduct.product_id, '41', 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
    expect(result.current.totalPrice).toBe(500);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, '41', 2);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should save cart to localStorage when items change', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, '41', 1);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{
        product: mockProduct,
        size: '41',
        quantity: 1,
      }])
    );
  });

  it('should handle invalid localStorage data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('should calculate correct totals with multiple items', () => {
    const product2: Product = {
      ...mockProduct,
      product_id: '2',
      name: 'Test Sneaker 2',
      price: '150',
    };

    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, '41', 2);
      result.current.addToCart(product2, '42', 1);
    });

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(350); // (100 * 2) + (150 * 1)
  });
});