import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../Checkout';

describe('Checkout page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );
  });
});
