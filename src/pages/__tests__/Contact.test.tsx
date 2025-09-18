import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import Contact from '../Contact';

describe('Contact page', () => {
  it('renders without crashing', () => {
    render(<Contact />);
  });
});
