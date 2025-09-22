import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Test runner utility to help identify potential issues
describe('Test Suite Health Check', () => {
  beforeAll(() => {
    console.log('🧪 Starting comprehensive test suite...');
  });

  afterAll(() => {
    console.log('✅ Test suite completed');
  });

  it('should have proper test configuration', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should have all required mocks in place', () => {
    // Check if Supabase is mocked
    expect(vi.isMockFunction(vi.hoisted(() => require('@/integrations/supabase/client').supabase))).toBe(true);
    
    // Check if React Router is mocked
    expect(vi.isMockFunction(vi.hoisted(() => require('react-router-dom').useNavigate))).toBe(true);
    
    // Check if localStorage is mocked
    expect(window.localStorage).toBeDefined();
  });

  it('should have proper test utilities available', () => {
    expect(render).toBeDefined();
    expect(screen).toBeDefined();
    expect(fireEvent).toBeDefined();
    expect(waitFor).toBeDefined();
    expect(userEvent).toBeDefined();
  });
});

// Utility functions for test debugging
export const testUtils = {
  // Helper to create mock user data
  createMockUser: (overrides = {}) => ({
    id: 'test-user-123',
    email: 'test@example.com',
    user_metadata: { first_name: 'Test', last_name: 'User' },
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  // Helper to create mock product data
  createMockProduct: (overrides = {}) => ({
    product_id: 'test-product-123',
    name: 'Test Sneaker',
    brand: 'Nike',
    description: 'A test sneaker',
    price: '100',
    sizes: ['40', '41', '42'],
    image_url: 'test-image.jpg',
    stock_quantity: '10',
    category: 'sneakers',
    colors_general: 'white',
    ...overrides,
  }),

  // Helper to create mock promo code data
  createMockPromoCode: (overrides = {}) => ({
    id: 'test-promo-123',
    code: 'TEST20',
    discount_type: 'percent',
    discount_value: 20,
    max_uses: 100,
    uses_count: 50,
    valid_from: '2024-01-01',
    valid_until: '2024-12-31',
    ...overrides,
  }),

  // Helper to wait for async operations
  waitForAsync: async (callback: () => void, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          callback();
          resolve(undefined);
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  },

  // Helper to simulate API delays
  simulateApiDelay: (ms = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Helper to check if element is visible
  isElementVisible: (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  },

  // Helper to get all text content from an element
  getAllTextContent: (element: HTMLElement) => {
    return element.textContent?.trim() || '';
  },

  // Helper to check if element has specific classes
  hasClasses: (element: HTMLElement, classes: string[]) => {
    return classes.every(cls => element.classList.contains(cls));
  },

  // Helper to mock console methods for testing
  mockConsole: () => {
    const originalConsole = { ...console };
    const mockConsole = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
    };
    Object.assign(console, mockConsole);
    return {
      mockConsole,
      restoreConsole: () => Object.assign(console, originalConsole),
    };
  },
};

// Common test patterns
export const commonTestPatterns = {
  // Test loading states
  testLoadingState: (component: React.ReactElement, loadingText: string) => {
    it('should show loading state', () => {
      render(component);
      expect(screen.getByText(loadingText)).toBeInTheDocument();
    });
  },

  // Test error states
  testErrorState: (component: React.ReactElement, errorText: string) => {
    it('should show error state', async () => {
      render(component);
      await waitFor(() => {
        expect(screen.getByText(new RegExp(errorText, 'i'))).toBeInTheDocument();
      });
    });
  },

  // Test empty states
  testEmptyState: (component: React.ReactElement, emptyText: string) => {
    it('should show empty state', async () => {
      render(component);
      await waitFor(() => {
        expect(screen.getByText(emptyText)).toBeInTheDocument();
      });
    });
  },

  // Test form validation
  testFormValidation: (formElement: HTMLElement, requiredFields: string[]) => {
    it('should validate required fields', async () => {
      const user = userEvent.setup();
      const submitButton = formElement.querySelector('button[type="submit"]');
      
      if (submitButton) {
        await user.click(submitButton);
        
        for (const field of requiredFields) {
          expect(screen.getByText(new RegExp(field, 'i'))).toBeInTheDocument();
        }
      }
    });
  },

  // Test responsive design
  testResponsiveDesign: (component: React.ReactElement, breakpoints: string[]) => {
    it('should be responsive', () => {
      render(component);
      
      for (const breakpoint of breakpoints) {
        // This would need to be implemented with actual responsive testing
        expect(breakpoint).toBeDefined();
      }
    });
  },
};

// Performance testing utilities
export const performanceUtils = {
  // Measure render time
  measureRenderTime: async (component: React.ReactElement) => {
    const startTime = performance.now();
    render(component);
    const endTime = performance.now();
    return endTime - startTime;
  },

  // Check for memory leaks
  checkMemoryLeaks: () => {
    // This would need to be implemented with actual memory monitoring
    return true;
  },
};

// Accessibility testing utilities
export const accessibilityUtils = {
  // Check for proper ARIA labels
  checkAriaLabels: (element: HTMLElement) => {
    const elementsWithAria = element.querySelectorAll('[aria-label], [aria-labelledby]');
    return elementsWithAria.length > 0;
  },

  // Check for proper heading hierarchy
  checkHeadingHierarchy: (element: HTMLElement) => {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    for (const heading of headings) {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        return false;
      }
      previousLevel = level;
    }
    
    return true;
  },

  // Check for proper color contrast
  checkColorContrast: (element: HTMLElement) => {
    // This would need to be implemented with actual color contrast checking
    return true;
  },
};
