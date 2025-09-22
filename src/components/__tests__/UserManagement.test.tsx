import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserManagement } from '../UserManagement';

// Mock Supabase client
const mockSupabase = {
  auth: {
    admin: {
      listUsers: vi.fn(),
      generateLink: vi.fn(),
    },
    signUp: vi.fn(),
    resetPasswordForEmail: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock useAuth hook
const mockUseAuth = {
  authUser: null,
  isAdmin: vi.fn(() => true),
  isVendor: vi.fn(() => false),
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

describe('UserManagement', () => {
  const mockUsers = [
    {
      id: 'user-1',
      email: 'admin@example.com',
      user_metadata: { first_name: 'Admin', last_name: 'User' },
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'user-2',
      email: 'vendor@example.com',
      user_metadata: { first_name: 'Vendor', last_name: 'User' },
      created_at: '2024-01-02T00:00:00Z',
    },
  ];

  const mockProfiles = [
    {
      user_id: 'user-1',
      roles: [{ role: 'admin' }],
    },
    {
      user_id: 'user-2',
      roles: [{ role: 'vendor' }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API calls
    mockSupabase.auth.admin.listUsers.mockResolvedValue({
      data: { users: mockUsers },
      error: null,
    });

    mockSupabase.from().select.mockResolvedValue({
      data: mockProfiles,
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render user management interface', async () => {
    render(<UserManagement />);

    expect(screen.getByText('Gestion des utilisateurs')).toBeInTheDocument();
    expect(screen.getByText('Créer un utilisateur')).toBeInTheDocument();
  });

  it('should display users list', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('vendor@example.com')).toBeInTheDocument();
    });
  });

  it('should open create user form', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    const createButton = screen.getByText('Créer un utilisateur');
    await user.click(createButton);

    expect(screen.getByText('Créer un nouvel utilisateur')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('should create a new user successfully', async () => {
    const user = userEvent.setup();
    
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'new-user', email: 'new@example.com' } },
      error: null,
    });

    mockSupabase.from().insert.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<UserManagement />);

    // Open create form
    await user.click(screen.getByText('Créer un utilisateur'));

    // Fill form
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.type(screen.getByLabelText('Prénom'), 'New');
    await user.type(screen.getByLabelText('Nom'), 'User');

    // Select role
    const roleSelect = screen.getByDisplayValue('client');
    await user.click(roleSelect);
    await user.click(screen.getByText('admin'));

    // Submit form
    await user.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: {
            first_name: 'New',
            last_name: 'User',
          },
        },
      });
    });
  });

  it('should handle user creation error', async () => {
    const user = userEvent.setup();
    
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'Email already registered' },
    });

    render(<UserManagement />);

    // Open create form
    await user.click(screen.getByText('Créer un utilisateur'));

    // Fill form
    await user.type(screen.getByLabelText('Email'), 'existing@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.type(screen.getByLabelText('Prénom'), 'Existing');
    await user.type(screen.getByLabelText('Nom'), 'User');

    // Submit form
    await user.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(screen.getByText(/Email already registered/)).toBeInTheDocument();
    });
  });

  it('should send password reset email', async () => {
    const user = userEvent.setup();
    
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null,
    });

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    // Find and click reset button for first user
    const resetButtons = screen.getAllByText('Réinitialiser');
    await user.click(resetButtons[0]);

    await waitFor(() => {
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('admin@example.com');
    });
  });

  it('should delete user', async () => {
    const user = userEvent.setup();
    
    mockSupabase.from().delete.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    // Find and click delete button for first user
    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockSupabase.from().delete).toHaveBeenCalled();
    });
  });

  it('should filter users by role', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    // Filter by admin role
    const filterSelect = screen.getByDisplayValue('Tous les rôles');
    await user.click(filterSelect);
    await user.click(screen.getByText('Admin'));

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.queryByText('vendor@example.com')).not.toBeInTheDocument();
    });
  });

  it('should search users by email', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    // Search for admin user
    const searchInput = screen.getByPlaceholderText('Rechercher par email...');
    await user.type(searchInput, 'admin');

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.queryByText('vendor@example.com')).not.toBeInTheDocument();
    });
  });

  it('should handle loading states', () => {
    // Mock loading state
    mockSupabase.auth.admin.listUsers.mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<UserManagement />);

    expect(screen.getByText('Chargement des utilisateurs...')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockSupabase.auth.admin.listUsers.mockResolvedValue({
      data: null,
      error: { message: 'API Error' },
    });

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors du chargement des utilisateurs/)).toBeInTheDocument();
    });
  });
});
