import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderSuccess from '../OrderSuccess';

describe('OrderSuccess page', () => {
  it('shows confirmation title and actions', () => {
    render(
      <MemoryRouter>
        <OrderSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText('Commande confirmée !')).toBeInTheDocument();
    expect(screen.getByText(/Merci pour votre achat/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continuer le shopping/i })).toHaveAttribute('href', '/catalogue');
    expect(screen.getByRole('link', { name: /Retour à l'accueil/i })).toHaveAttribute('href', '/');
  });
});
