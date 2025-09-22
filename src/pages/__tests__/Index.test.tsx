import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Index from '../Index';
import { Product } from '@/lib/types';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    limit: vi.fn(),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock useAuth hook
const mockUseAuth = {
  authUser: null,
  isAdmin: vi.fn(() => false),
  isVendor: vi.fn(() => false),
  isClient: vi.fn(() => false),
};

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock HomeCarousel component
vi.mock('@/components/HomeCarousel', () => ({
  default: () => <div data-testid="home-carousel">Home Carousel</div>,
}));

// Mock OptimizedImage component
vi.mock('@/components/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('Index', () => {
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
      stock_quantity: '3',
      category: 'sneakers',
      colors_general: 'black',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API calls
    mockSupabase.from().limit.mockResolvedValue({
      data: mockProducts,
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the home page', () => {
    render(<Index />);

    expect(screen.getByTestId('home-carousel')).toBeInTheDocument();
  });

  it('should display the about banner', () => {
    render(<Index />);

    expect(screen.getByText('À propos de Karnaval')).toBeInTheDocument();
    expect(screen.getByText('La révolution des sneakers')).toBeInTheDocument();
    expect(screen.getByText(/Philippine Pujol/)).toBeInTheDocument();
  });

  it('should display statistics in the banner', () => {
    render(<Index />);

    expect(screen.getByText('12 000+')).toBeInTheDocument();
    expect(screen.getByText('140T')).toBeInTheDocument();
    expect(screen.getByText('18€')).toBeInTheDocument();
  });

  it('should display mission in the banner', () => {
    render(<Index />);

    expect(screen.getByText('Notre mission')).toBeInTheDocument();
    expect(screen.getByText(/Reconditionner.*upcycler.*remettre sur le marché/)).toBeInTheDocument();
  });

  it('should display features section', () => {
    render(<Index />);

    expect(screen.getByText('Pourquoi nous choisir ?')).toBeInTheDocument();
    expect(screen.getByText('Authenticité garantie')).toBeInTheDocument();
    expect(screen.getByText('Prix compétitifs')).toBeInTheDocument();
    expect(screen.getByText('Communauté passionnée')).toBeInTheDocument();
  });

  it('should display featured products section', async () => {
    render(<Index />);

    await waitFor(() => {
      expect(screen.getByText('Produits en vedette')).toBeInTheDocument();
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
      expect(screen.getByText('Adidas Ultraboost')).toBeInTheDocument();
    });
  });

  it('should display product information correctly', async () => {
    render(<Index />);

    await waitFor(() => {
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
      expect(screen.getByText('120€')).toBeInTheDocument();
      expect(screen.getByText('Adidas Ultraboost')).toBeInTheDocument();
      expect(screen.getByText('180€')).toBeInTheDocument();
    });
  });

  it('should display statistics section', () => {
    render(<Index />);

    expect(screen.getByText('Aujourd\'hui, Karnaval c\'est déjà :')).toBeInTheDocument();
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('5K+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
  });

  it('should display call-to-action section', () => {
    render(<Index />);

    expect(screen.getByText('Rejoignez l\'aventure Karnaval')).toBeInTheDocument();
    expect(screen.getByText('Découvrez notre sélection de sneakers reconditionnées')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    // Mock loading state
    mockSupabase.from().limit.mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<Index />);

    expect(screen.getByText('Chargement des produits...')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockSupabase.from().limit.mockResolvedValue({
      data: null,
      error: { message: 'API Error' },
    });

    render(<Index />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors du chargement des produits/)).toBeInTheDocument();
    });
  });

  it('should display empty state when no products', async () => {
    mockSupabase.from().limit.mockResolvedValue({
      data: [],
      error: null,
    });

    render(<Index />);

    await waitFor(() => {
      expect(screen.getByText('Aucun produit en vedette pour le moment')).toBeInTheDocument();
    });
  });

  it('should have proper responsive design', () => {
    render(<Index />);

    // Check for responsive classes
    const heroSection = screen.getByTestId('home-carousel').closest('div');
    expect(heroSection).toHaveClass('container', 'mx-auto', 'px-4');
  });

  it('should display feature descriptions', () => {
    render(<Index />);

    expect(screen.getByText(/Tous nos produits sont vérifiés par nos experts/)).toBeInTheDocument();
    expect(screen.getByText(/Les meilleurs prix du marché pour des sneakers premium/)).toBeInTheDocument();
    expect(screen.getByText(/Rejoignez des milliers de sneakerheads comme vous/)).toBeInTheDocument();
  });

  it('should display proper badges and labels', () => {
    render(<Index />);

    expect(screen.getByText('À propos de Karnaval')).toBeInTheDocument();
    expect(screen.getByText('Nos résultats')).toBeInTheDocument();
    expect(screen.getByText('Notre mission')).toBeInTheDocument();
  });

  it('should display impact information', () => {
    render(<Index />);

    expect(screen.getByText('Paires sauvées')).toBeInTheDocument();
    expect(screen.getByText('CO₂ évitées')).toBeInTheDocument();
    expect(screen.getByText('Économie moyenne')).toBeInTheDocument();
  });
});