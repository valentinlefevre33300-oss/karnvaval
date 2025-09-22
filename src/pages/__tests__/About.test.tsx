import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../About';

// Mock the image import
vi.mock('@/assets/philippine-karnaval.png', () => ({
  default: 'mocked-image-path.png',
}));

describe('About', () => {
  it('should render the about page', () => {
    render(<About />);

    expect(screen.getByText('Qui sommes-nous ?')).toBeInTheDocument();
  });

  it('should display the main hero section', () => {
    render(<About />);

    expect(screen.getByText('Qui sommes-nous ?')).toBeInTheDocument();
    expect(screen.getByText(/Karnaval.*Philippine Pujol/)).toBeInTheDocument();
  });

  it('should display the story section', () => {
    render(<About />);

    expect(screen.getByText('Notre histoire')).toBeInTheDocument();
    expect(screen.getByText(/De l'Asie à la France/)).toBeInTheDocument();
    expect(screen.getByText(/montagnes de paires jetées/)).toBeInTheDocument();
  });

  it('should display the process section', () => {
    render(<About />);

    expect(screen.getByText('Notre processus')).toBeInTheDocument();
    expect(screen.getByText('Sourcing raisonné')).toBeInTheDocument();
    expect(screen.getByText('Reconditionnement en France')).toBeInTheDocument();
  });

  it('should display sourcing information', () => {
    render(<About />);

    expect(screen.getByText(/grands pôles urbains européens/)).toBeInTheDocument();
    expect(screen.getByText(/Berlin, Amsterdam, Milan/)).toBeInTheDocument();
    expect(screen.getByText(/partenariat avec des enseignes françaises/)).toBeInTheDocument();
  });

  it('should display reconditioning information', () => {
    render(<About />);

    expect(screen.getByText(/atelier français/)).toBeInTheDocument();
    expect(screen.getByText(/Nettoyage en profondeur/)).toBeInTheDocument();
    expect(screen.getByText(/comme neuve/)).toBeInTheDocument();
  });

  it('should display impact information', () => {
    render(<About />);

    expect(screen.getAllByText(/Impact positif/)).toHaveLength(2);
    expect(screen.getByText(/émissions de CO₂/)).toBeInTheDocument();
    expect(screen.getByText(/consommation d'eau/)).toBeInTheDocument();
  });

  it('should display statistics section', () => {
    render(<About />);

    expect(screen.getByText('Nos résultats')).toBeInTheDocument();
    expect(screen.getByText('12 000')).toBeInTheDocument();
    expect(screen.getByText('140')).toBeInTheDocument();
    expect(screen.getByText('18€')).toBeInTheDocument();
  });

  it('should display mission statement', () => {
    render(<About />);

    expect(screen.getByText('Notre mission')).toBeInTheDocument();
    expect(screen.getByText(/Avec Karnaval, tu fais du bien à ton/)).toBeInTheDocument();
  });

  it('should display call-to-action section', () => {
    render(<About />);

    expect(screen.getAllByText('Rejoignez l\'aventure')).toHaveLength(2);
    expect(screen.getByText('Explorer le catalogue')).toBeInTheDocument();
    expect(screen.getByText('Vendre mes sneakers')).toBeInTheDocument();
  });

  it('should display Philippine image', () => {
    render(<About />);

    const image = screen.getByAltText(/Philippine Pujol.*fondatrice.*drapeau/);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-image-path.png');
  });

  it('should have proper section structure', () => {
    render(<About />);

    // Check for section headings
    expect(screen.getByText('Notre histoire')).toBeInTheDocument();
    expect(screen.getByText('Notre processus')).toBeInTheDocument();
    expect(screen.getByText('Nos résultats')).toBeInTheDocument();
    expect(screen.getByText('Notre mission')).toBeInTheDocument();
    expect(screen.getAllByText('Rejoignez l\'aventure')).toHaveLength(2);
  });

  it('should display benefits with icons', () => {
    render(<About />);

    expect(screen.getByText('Plus responsable')).toBeInTheDocument();
    expect(screen.getByText('Plus économique')).toBeInTheDocument();
    expect(screen.getByText('Toujours authentique')).toBeInTheDocument();
  });

  it('should have responsive design elements', () => {
    render(<About />);

    // Check for responsive classes in the DOM
    const heroSection = screen.getByText('Qui sommes-nous ?').closest('section');
    expect(heroSection).toHaveClass('relative', 'overflow-hidden');
  });

  it('should display proper badges and labels', () => {
    render(<About />);

    expect(screen.getByText('Notre histoire')).toBeInTheDocument();
    expect(screen.getByText('Notre processus')).toBeInTheDocument();
    expect(screen.getByText('Nos résultats')).toBeInTheDocument();
    expect(screen.getByText('Notre mission')).toBeInTheDocument();
  });
});