import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock Supabase client
const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  })),
  rpc: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with no user', () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.authUser).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: {},
    };

    const mockSession = {
      user: mockUser,
      access_token: 'token-123',
    };

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: {
        user_id: 'user-123',
        roles: [{ role: 'client' }],
      },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.signIn('test@example.com', 'password');
      expect(loginResult.success).toBe(true);
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should handle login error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.signIn('test@example.com', 'wrong-password');
      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Invalid credentials');
    });
  });

  it('should handle successful registration', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'newuser@example.com',
      user_metadata: {},
    };

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null,
    });

    mockSupabase.from().maybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const registerResult = await result.current.signUp('newuser@example.com', 'password', 'John', 'Doe');
      expect(registerResult.success).toBe(true);
    });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password',
      options: {
        data: {
          first_name: 'John',
          last_name: 'Doe',
        },
      },
    });
  });

  it('should handle logout', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  it('should check if user is admin', () => {
    const { result } = renderHook(() => useAuth());

    // Mock user with admin role
    act(() => {
      result.current.authUser = {
        id: 'user-123',
        email: 'admin@example.com',
        roles: [{ role: 'admin' }],
      } as any;
    });

    expect(result.current.isAdmin()).toBe(true);
  });

  it('should check if user is vendor', () => {
    const { result } = renderHook(() => useAuth());

    // Mock user with vendor role
    act(() => {
      result.current.authUser = {
        id: 'user-123',
        email: 'vendor@example.com',
        roles: [{ role: 'vendor' }],
      } as any;
    });

    expect(result.current.isVendor()).toBe(true);
  });

  it('should check if user is client', () => {
    const { result } = renderHook(() => useAuth());

    // Mock user with client role
    act(() => {
      result.current.authUser = {
        id: 'user-123',
        email: 'client@example.com',
        roles: [{ role: 'client' }],
      } as any;
    });

    expect(result.current.isClient()).toBe(true);
  });
});
