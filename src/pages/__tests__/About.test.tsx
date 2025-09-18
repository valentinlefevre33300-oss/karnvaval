import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../About';

describe('About page', () => {
  it('renders main headings and CTA buttons', () => {
    render(<About />);

    expect(screen.getByRole('heading', { name: /Qui sommes-nous/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pourquoi choisir Karnaval/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Aujourd'hui, Karnaval c'est déjà/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Explorer le catalogue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vendre mes sneakers/i })).toBeInTheDocument();
  });
});
