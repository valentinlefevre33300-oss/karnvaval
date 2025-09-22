import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromoCodeManagement } from '../PromoCodeManagement';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn(),
    delete: vi.fn(),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
  toast: vi.fn(),
}));

describe('PromoCodeManagement', () => {
  const mockPromoCodes = [
    {
      id: '1',
      code: 'SAVE20',
      discount_type: 'percent',
      discount_value: 20,
      max_uses: 100,
      uses_count: 50,
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
    },
    {
      id: '2',
      code: 'FIXED10',
      discount_type: 'fixed',
      discount_value: 10,
      max_uses: null,
      uses_count: 25,
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
    },
    {
      id: '3',
      code: 'EXPIRED',
      discount_type: 'percent',
      discount_value: 15,
      max_uses: 50,
      uses_count: 30,
      valid_from: '2024-01-01',
      valid_until: '2023-12-31', // Expired
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API calls
    mockSupabase.from().select.mockResolvedValue({
      data: mockPromoCodes,
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render promo code management interface', async () => {
    render(<PromoCodeManagement />);

    expect(screen.getByText('Gestion des codes promo')).toBeInTheDocument();
    expect(screen.getByText('Créer un code promo')).toBeInTheDocument();
  });

  it('should display promo codes list', async () => {
    render(<PromoCodeManagement />);

    await waitFor(() => {
      expect(screen.getByText('SAVE20')).toBeInTheDocument();
      expect(screen.getByText('FIXED10')).toBeInTheDocument();
      expect(screen.getByText('EXPIRED')).toBeInTheDocument();
    });
  });

  it('should show correct discount values', async () => {
    render(<PromoCodeManagement />);

    await waitFor(() => {
      expect(screen.getByText('20%')).toBeInTheDocument();
      expect(screen.getByText('10€')).toBeInTheDocument();
      expect(screen.getByText('15%')).toBeInTheDocument();
    });
  });

  it('should show correct status badges', async () => {
    render(<PromoCodeManagement />);

    await waitFor(() => {
      // Active codes should show "Actif" with green styling
      expect(screen.getByText('Actif')).toBeInTheDocument();
      // Expired codes should show "Expiré"
      expect(screen.getByText('Expiré')).toBeInTheDocument();
    });
  });

  it('should open create promo code form', async () => {
    const user = userEvent.setup();
    render(<PromoCodeManagement />);

    const createButton = screen.getByText('Créer un code promo');
    await user.click(createButton);

    expect(screen.getByText('Créer un nouveau code promo')).toBeInTheDocument();
    expect(screen.getByLabelText('Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Type de réduction')).toBeInTheDocument();
    expect(screen.getByLabelText('Valeur de réduction')).toBeInTheDocument();
  });

  it('should create a new promo code successfully', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().insert.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<PromoCodeManagement />);

    // Open create form
    await user.click(screen.getByText('Créer un code promo'));

    // Fill form
    await user.type(screen.getByLabelText('Code'), 'NEWCODE');
    await user.type(screen.getByLabelText('Valeur de réduction'), '25');
    await user.type(screen.getByLabelText('Utilisations max'), '50');

    // Select discount type
    const typeSelect = screen.getByDisplayValue('percent');
    await user.click(typeSelect);
    await user.click(screen.getByText('Montant fixe'));

    // Submit form
    await user.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        code: 'NEWCODE',
        discount_type: 'fixed',
        discount_value: 25,
        max_uses: 50,
        valid_from: expect.any(String),
        valid_until: expect.any(String),
      });
    });
  });

  it('should handle promo code creation error', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().insert.mockResolvedValue({
      data: null,
      error: { message: 'Code already exists' },
    });

    render(<PromoCodeManagement />);

    // Open create form
    await user.click(screen.getByText('Créer un code promo'));

    // Fill form
    await user.type(screen.getByLabelText('Code'), 'EXISTING');
    await user.type(screen.getByLabelText('Valeur de réduction'), '20');

    // Submit form
    await user.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(screen.getByText(/Code already exists/)).toBeInTheDocument();
    });
  });

  it('should delete promo code', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().delete.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<PromoCodeManagement />);

    await waitFor(() => {
      expect(screen.getByText('SAVE20')).toBeInTheDocument();
    });

    // Find and click delete button for first promo code
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

    render(<PromoCodeManagement />);

    expect(screen.getByText('Chargement des codes promo...')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockSupabase.from().select.mockResolvedValue({
      data: null,
      error: { message: 'API Error' },
    });

    render(<PromoCodeManagement />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors du chargement des codes promo/)).toBeInTheDocument();
    });
  });

  it('should validate form inputs', async () => {
    const user = userEvent.setup();
    render(<PromoCodeManagement />);

    // Open create form
    await user.click(screen.getByText('Créer un code promo'));

    // Try to submit without filling required fields
    await user.click(screen.getByText('Créer'));

    // Should show validation errors
    expect(screen.getByText('Le code est requis')).toBeInTheDocument();
    expect(screen.getByText('La valeur de réduction est requise')).toBeInTheDocument();
  });

  it('should handle empty promo codes list', async () => {
    mockSupabase.from().select.mockResolvedValue({
      data: [],
      error: null,
    });

    render(<PromoCodeManagement />);

    await waitFor(() => {
      expect(screen.getByText('Aucun code promo trouvé')).toBeInTheDocument();
    });
  });

  it('should display usage statistics correctly', async () => {
    render(<PromoCodeManagement />);

    await waitFor(() => {
      // Should show usage count and max uses
      expect(screen.getByText('50 / 100')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument(); // No max uses
    });
  });

  it('should format dates correctly', async () => {
    render(<PromoCodeManagement />);

    await waitFor(() => {
      // Should show formatted dates
      expect(screen.getByText(/Début:/)).toBeInTheDocument();
      expect(screen.getByText(/Fin:/)).toBeInTheDocument();
    });
  });
});
