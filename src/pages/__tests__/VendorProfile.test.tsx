import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { VendorProfile } from '../profile/VendorProfile';

describe('VendorProfile page', () => {
  it('renders without crashing', () => {
    render(<VendorProfile />);
  });
});
