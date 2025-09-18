import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { AdminProfile } from '../profile/AdminProfile';

describe('AdminProfile page', () => {
  it('renders without crashing', () => {
    render(<AdminProfile />);
  });
});
