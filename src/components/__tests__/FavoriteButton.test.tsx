import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { FavoriteButton } from '../FavoriteButton';
import * as useFavoritesModule from '@/hooks/useFavorites';
import { Product } from '@/lib/types';

// Mock the useFavorites hook
vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: vi.fn((id: string) => id === 'favorite-product'),
    toggleFavorite: vi.fn(),
  }),
}));

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

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render heart icon', () => {
    render(<FavoriteButton product={mockProduct} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    const heartIcon = button.querySelector('svg');
    expect(heartIcon).toBeInTheDocument();
  });

  it('should show unfilled heart for non-favorite product', () => {
    render(<FavoriteButton product={mockProduct} />);
    
    const button = screen.getByRole('button');
    const heartIcon = button.querySelector('svg');
    
    expect(heartIcon).not.toHaveClass('fill-current');
    expect(button).not.toHaveClass('text-red-500');
  });

  it('should show filled heart for favorite product', () => {
    const favoriteProduct = { ...mockProduct, product_id: 'favorite-product' };
    render(<FavoriteButton product={favoriteProduct} />);
    
    const button = screen.getByRole('button');
    const heartIcon = button.querySelector('svg');
    
    expect(heartIcon).toHaveClass('fill-current');
    expect(button).toHaveClass('text-red-500');
  });

  it('should call toggleFavorite when clicked', () => {
    const mockToggleFavorite = vi.fn();
    vi.spyOn(useFavoritesModule, 'useFavorites').mockReturnValue({
      isFavorite: vi.fn(() => false),
      toggleFavorite: mockToggleFavorite,
      favorites: [],
      loading: false,
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      fetchFavorites: vi.fn(),
    });

    render(<FavoriteButton product={mockProduct} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockProduct);
  });

  it('should prevent event propagation when clicked', () => {
    render(<FavoriteButton product={mockProduct} />);
    
    const button = screen.getByRole('button');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
    
    fireEvent(button, clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<FavoriteButton product={mockProduct} className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should handle different sizes', () => {
    render(<FavoriteButton product={mockProduct} size="lg" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
  });

  it('should handle different variants', () => {
    render(<FavoriteButton product={mockProduct} variant="outline" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });
});