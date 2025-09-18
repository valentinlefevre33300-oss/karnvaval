import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../Cart';

describe('Cart page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
  });
});
