import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { ClientProfile } from '../profile/ClientProfile';

describe('ClientProfile page', () => {
  it('renders without crashing', () => {
    render(<ClientProfile />);
  });
});
