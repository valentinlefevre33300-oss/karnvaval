import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductManagement } from '../ProductManagement';
import { Product } from '@/lib/types';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock useAuth hook
const mockUseAuth = {
  authUser: { id: 'vendor-1' },
  isAdmin: vi.fn(() => false),
  isVendor: vi.fn(() => true),
  isClient: vi.fn(() => false),
};

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
  toast: vi.fn(),
}));

describe('ProductManagement', () => {
  const mockProducts: Product[] = [
    {
      product_id: '1',
      name: 'Nike Air Max 90',
      brand: 'Nike',
      description: 'Classic sneaker',
      price: '120',
      sizes: ['40', '41', '42'],
      image_url: 'nike-air-max-90.jpg',
      stock_quantity: '5',
      category: 'sneakers',
      colors_general: 'white',
    },
    {
      product_id: '2',
      name: 'Adidas Ultraboost',
      brand: 'Adidas',
      description: 'Running shoe',
      price: '180',
      sizes: ['41', '42', '43'],
      image_url: 'adidas-ultraboost.jpg',
      stock_quantity: '0',
      category: 'sneakers',
      colors_general: 'black',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API calls
    mockSupabase.from().select.mockResolvedValue({
      data: mockProducts,
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render product management interface', async () => {
    render(<ProductManagement />);

    expect(screen.getByText('Gestion des produits')).toBeInTheDocument();
  });

  it('should display products list', async () => {
    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
      expect(screen.getByText('Adidas Ultraboost')).toBeInTheDocument();
    });
  });

  it('should show stock status correctly', async () => {
    render(<ProductManagement />);

    await waitFor(() => {
      // Product with stock should show "En stock"
      expect(screen.getByText('En stock')).toBeInTheDocument();
      // Product without stock should show "Rupture"
      expect(screen.getByText('Rupture')).toBeInTheDocument();
    });
  });

  it('should toggle stock status', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().update.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
    });

    // Find and click the stock toggle button for the first product
    const stockButtons = screen.getAllByText('En stock');
    await user.click(stockButtons[0]);

    await waitFor(() => {
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        stock_quantity: '0',
      });
    });
  });

  it('should delete product', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().delete.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
    });

    // Find and click delete button for first product
    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockSupabase.from().delete).toHaveBeenCalled();
    });
  });

  it('should handle loading states', () => {
    // Mock loading state
    mockSupabase.from().select.mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<ProductManagement />);

    expect(screen.getByText('Chargement des produits...')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockSupabase.from().select.mockResolvedValue({
      data: null,
      error: { message: 'API Error' },
    });

    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors du chargement des produits/)).toBeInTheDocument();
    });
  });

  it('should show add button when showAddButton is true', () => {
    render(<ProductManagement showAddButton={true} />);

    expect(screen.getByText('Ajouter un produit')).toBeInTheDocument();
  });

  it('should not show add button when showAddButton is false', () => {
    render(<ProductManagement showAddButton={false} />);

    expect(screen.queryByText('Ajouter un produit')).not.toBeInTheDocument();
  });

  it('should display product information correctly', async () => {
    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
      expect(screen.getByText('Nike • 120€')).toBeInTheDocument();
      expect(screen.getByText('Stock: 5 unités')).toBeInTheDocument();
    });
  });

  it('should handle empty products list', async () => {
    mockSupabase.from().select.mockResolvedValue({
      data: [],
      error: null,
    });

    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText('Aucun produit trouvé')).toBeInTheDocument();
    });
  });

  it('should handle stock update error', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().update.mockResolvedValue({
      data: null,
      error: { message: 'Update failed' },
    });

    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
    });

    // Try to toggle stock
    const stockButtons = screen.getAllByText('En stock');
    await user.click(stockButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors de la mise à jour du stock/)).toBeInTheDocument();
    });
  });

  it('should handle delete error', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().delete.mockResolvedValue({
      data: null,
      error: { message: 'Delete failed' },
    });

    render(<ProductManagement />);

    await waitFor(() => {
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
    });

    // Try to delete product
    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors de la suppression du produit/)).toBeInTheDocument();
    });
  });
});
