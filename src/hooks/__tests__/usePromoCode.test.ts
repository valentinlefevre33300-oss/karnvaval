import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePromoCode } from '../usePromoCode';

// Mock Supabase
const mockRpc = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: mockRpc,
  },
}));

// Mock toast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  toast: mockToast,
}));

describe('usePromoCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with no applied promo code', () => {
    const { result } = renderHook(() => usePromoCode());
    
    expect(result.current.appliedPromoCode).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should load applied promo code from localStorage', () => {
    const storedPromoData = {
      success: true,
      promo_code_id: 'promo-123',
      discount_amount: 10,
      discount_type: 'percentage',
      discount_value: 10,
    };
    
    localStorage.setItem('appliedPromoCodeData', JSON.stringify(storedPromoData));
    
    const { result } = renderHook(() => usePromoCode());
    
    expect(result.current.appliedPromoCode).toEqual(storedPromoData);
  });

  it('should validate successful promo code', async () => {
    const mockResponse = {
      success: true,
      promo_code_id: 'promo-123',
      discount_amount: 15.50,
      discount_type: 'percentage',
      discount_value: 10,
    };

    mockRpc.mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());
    
    let validationResult;
    await act(async () => {
      validationResult = await result.current.validatePromoCode('SAVE10', 155);
    });
    
    expect(mockRpc).toHaveBeenCalledWith('apply_promo_code', {
      p_code: 'SAVE10',
      p_order_total: 155,
    });
    
    expect(validationResult).toEqual(mockResponse);
    expect(result.current.appliedPromoCode).toEqual(mockResponse);
    expect(mockToast).toHaveBeenCalledWith({
      title: "Code promo appliqué !",
      description: "Vous économisez 15,50€",
    });
  });

  it('should handle invalid promo code', async () => {
    const mockResponse = {
      success: false,
      error: 'Code promo invalide ou expiré',
    };

    mockRpc.mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());
    
    let validationResult;
    await act(async () => {
      validationResult = await result.current.validatePromoCode('INVALID', 100);
    });
    
    expect(validationResult).toEqual(mockResponse);
    expect(result.current.appliedPromoCode).toBeNull();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Code promo invalide",
      description: 'Code promo invalide ou expiré',
      variant: "destructive",
    });
  });

  it('should handle API errors', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: new Error('Network error'),
    });

    const { result } = renderHook(() => usePromoCode());
    
    let validationResult;
    await act(async () => {
      validationResult = await result.current.validatePromoCode('SAVE10', 100);
    });
    
    expect(validationResult).toEqual({
      success: false,
      error: 'Erreur lors de la validation du code promo',
    });
    expect(mockToast).toHaveBeenCalledWith({
      title: "Erreur",
      description: 'Erreur lors de la validation du code promo',
      variant: "destructive",
    });
  });

  it('should convert promo code to uppercase', async () => {
    mockRpc.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());
    
    await act(async () => {
      await result.current.validatePromoCode('save10', 100);
    });
    
    expect(mockRpc).toHaveBeenCalledWith('apply_promo_code', {
      p_code: 'SAVE10',
      p_order_total: 100,
    });
  });

  it('should remove promo code', () => {
    const storedPromoData = {
      success: true,
      promo_code_id: 'promo-123',
      discount_amount: 10,
    };
    
    localStorage.setItem('appliedPromoCodeData', JSON.stringify(storedPromoData));
    localStorage.setItem('appliedPromoCode', 'SAVE10');
    
    const { result } = renderHook(() => usePromoCode());
    
    act(() => {
      result.current.removePromoCode();
    });
    
    expect(result.current.appliedPromoCode).toBeNull();
    expect(localStorage.getItem('appliedPromoCode')).toBeNull();
    expect(localStorage.getItem('appliedPromoCodeData')).toBeNull();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Code promo retiré",
      description: "Le code promo a été retiré de votre commande",
    });
  });

  it('should increment promo code usage', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());
    
    await act(async () => {
      await result.current.incrementPromoCodeUsage('promo-123');
    });
    
    expect(mockRpc).toHaveBeenCalledWith('increment_promo_code_usage', {
      p_promo_code_id: 'promo-123',
    });
  });

  it('should handle errors when incrementing usage', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockRpc.mockResolvedValue({
      data: null,
      error: new Error('Database error'),
    });

    const { result } = renderHook(() => usePromoCode());
    
    await act(async () => {
      await result.current.incrementPromoCodeUsage('promo-123');
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Error incrementing promo code usage:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should set loading state during validation', async () => {
    mockRpc.mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve({ data: { success: true }, error: null }), 100)
      )
    );

    const { result } = renderHook(() => usePromoCode());
    
    expect(result.current.loading).toBe(false);
    
    act(() => {
      result.current.validatePromoCode('SAVE10', 100);
    });
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });
    
    expect(result.current.loading).toBe(false);
  });
});