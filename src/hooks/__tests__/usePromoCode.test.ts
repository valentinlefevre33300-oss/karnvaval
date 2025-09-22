import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePromoCode } from '../usePromoCode';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('usePromoCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with no applied promo code', () => {
    const { result } = renderHook(() => usePromoCode());

    expect(result.current.appliedPromoCode).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should apply valid promo code successfully', async () => {
    const mockPromoCode = {
      id: '1',
      code: 'SAVE20',
      discount_type: 'percent',
      discount_value: 20,
      max_uses: 100,
      uses_count: 50,
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
    };

    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: mockPromoCode,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());

    await act(async () => {
      const promoResult = await result.current.applyPromoCode('SAVE20');
      expect(promoResult.success).toBe(true);
      expect(promoResult.discount_type).toBe('percent');
      expect(promoResult.discount_value).toBe(20);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('promo_codes');
  });

  it('should handle invalid promo code', async () => {
    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());

    await act(async () => {
      const promoResult = await result.current.applyPromoCode('INVALID');
      expect(promoResult.success).toBe(false);
      expect(promoResult.error).toBe('Code promo invalide');
    });
  });

  it('should handle expired promo code', async () => {
    const expiredPromoCode = {
      id: '1',
      code: 'EXPIRED',
      discount_type: 'percent',
      discount_value: 20,
      max_uses: 100,
      uses_count: 50,
      valid_from: '2024-01-01',
      valid_until: '2023-12-31', // Expired
    };

    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: expiredPromoCode,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());

    await act(async () => {
      const promoResult = await result.current.applyPromoCode('EXPIRED');
      expect(promoResult.success).toBe(false);
      expect(promoResult.error).toBe('Code promo expiré');
    });
  });

  it('should handle max uses reached', async () => {
    const maxUsesPromoCode = {
      id: '1',
      code: 'MAXUSED',
      discount_type: 'percent',
      discount_value: 20,
      max_uses: 100,
      uses_count: 100, // Max uses reached
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
    };

    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: maxUsesPromoCode,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());

    await act(async () => {
      const promoResult = await result.current.applyPromoCode('MAXUSED');
      expect(promoResult.success).toBe(false);
      expect(promoResult.error).toBe('Code promo épuisé');
    });
  });

  it('should handle database error', async () => {
    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const { result } = renderHook(() => usePromoCode());

    await act(async () => {
      const promoResult = await result.current.applyPromoCode('ERROR');
      expect(promoResult.success).toBe(false);
      expect(promoResult.error).toBe('Erreur lors de la vérification du code promo');
    });
  });

  it('should remove applied promo code', () => {
    const { result } = renderHook(() => usePromoCode());

    // First apply a promo code
    act(() => {
      result.current.appliedPromoCode = {
        success: true,
        discount_type: 'percent',
        discount_value: 20,
      };
    });

    // Then remove it
    act(() => {
      result.current.removePromoCode();
    });

    expect(result.current.appliedPromoCode).toBeNull();
  });

  it('should calculate discount amount correctly for percentage', () => {
    const { result } = renderHook(() => usePromoCode());

    act(() => {
      result.current.appliedPromoCode = {
        success: true,
        discount_type: 'percent',
        discount_value: 20,
      };
    });

    const discountAmount = result.current.getDiscountAmount(100);
    expect(discountAmount).toBe(20);
  });

  it('should calculate discount amount correctly for fixed amount', () => {
    const { result } = renderHook(() => usePromoCode());

    act(() => {
      result.current.appliedPromoCode = {
        success: true,
        discount_type: 'fixed',
        discount_value: 15,
      };
    });

    const discountAmount = result.current.getDiscountAmount(100);
    expect(discountAmount).toBe(15);
  });

  it('should return 0 discount when no promo code applied', () => {
    const { result } = renderHook(() => usePromoCode());

    const discountAmount = result.current.getDiscountAmount(100);
    expect(discountAmount).toBe(0);
  });

  it('should handle case-insensitive promo codes', async () => {
    const mockPromoCode = {
      id: '1',
      code: 'SAVE20',
      discount_type: 'percent',
      discount_value: 20,
      max_uses: 100,
      uses_count: 50,
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
    };

    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: mockPromoCode,
      error: null,
    });

    const { result } = renderHook(() => usePromoCode());

    await act(async () => {
      const promoResult = await result.current.applyPromoCode('save20');
      expect(promoResult.success).toBe(true);
    });
  });
});