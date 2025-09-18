import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Catalogue from '../Catalogue';

describe('Catalogue page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Catalogue />
      </MemoryRouter>
    );
  });
});
