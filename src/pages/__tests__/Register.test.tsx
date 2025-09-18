import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '../auth/Register';

describe('Register page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  });
});
