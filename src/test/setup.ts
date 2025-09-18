import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Supabase client (shape matching usage in hooks/pages)
vi.mock('@/integrations/supabase/client', () => {
  const mockSelect = vi.fn(() => Promise.resolve({ data: [], error: null }));
  const mockFrom = vi.fn(() => ({ select: mockSelect, eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) }));

  return {
    supabase: {
      from: mockFrom,
      rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
      auth: {
        onAuthStateChange: vi.fn((cb?: (event: string, session: unknown) => void) => {
          const subscription = { unsubscribe: vi.fn() };
          // Immediately invoke callback with no session for deterministic tests
          if (cb) cb('INITIAL', null);
          return { data: { subscription } } as { data: { subscription: { unsubscribe: () => void } } };
        }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
        signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    },
  };
});

// Mock React Router (preserve actual exports like MemoryRouter)
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ slug: 'test-product' }),
    Link: ({ children, to, ...props }: { children?: React.ReactNode; to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      return React.createElement('a', { href: to, ...props }, children);
    },
  };
});

// Mock hooks
vi.mock('@/hooks/use-toast', () => {
  return {
    useToast: () => ({ toast: vi.fn() }),
    toast: vi.fn(),
  } as const;
});

// Mock window.matchMedia for responsive hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
  },
  writable: true,
});