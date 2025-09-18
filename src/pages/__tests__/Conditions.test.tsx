import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { Conditions } from '../Conditions';

describe('Conditions page', () => {
  it('renders without crashing', () => {
    render(
      <HelmetProvider>
        <Conditions />
      </HelmetProvider>
    );
  });
});
