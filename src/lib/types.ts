export type AppRole = 'client' | 'vendeur' | 'admin';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  company_name?: string;
  siret?: string;
  business_address?: string;
  commission_rate?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
  roles: AppRole[];
  vendor_profile?: VendorProfile;
}

export interface Product {
  product_id: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  sizes: string | string[]; // JSON data from database or comma-separated
  image_url: string;
  stock_quantity: string;
  category: string;
  colors_general: string;
}

// Helper functions for parsing CSV data
export const parseProductSizes = (sizesInput: string | string[]): string[] => {
  if (!sizesInput) return [];

  if (Array.isArray(sizesInput)) return sizesInput.map(String);

  const sizesString = sizesInput.trim();
  if (!sizesString) return [];

  if (sizesString.startsWith('[')) {
    try {
      const parsed = JSON.parse(sizesString.replace(/'/g, '"')) as unknown[];
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (error) {
      console.error('Error parsing sizes as JSON:', error);
      return sizesString
        .replaceAll('[', '')
        .replaceAll(']', '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
  }

  if (sizesString.includes(',')) {
    return sizesString.split(',').map(s => s.trim()).filter(Boolean);
  }

  return [sizesString];
};

export const parseProductColors = (colorsString: string): string[] => {
  try {
    const colors = JSON.parse(colorsString.replace(/'/g, '"'));
    if (!Array.isArray(colors)) return [];
    
    // Remove duplicates using Set and filter out empty/null values
    const validColors = colors
      .filter(color => color && String(color).trim() !== '')
      .map(color => String(color).trim());
    
    return Array.from(new Set(validColors));
  } catch {
    return [];
  }
};

export const getProductSlug = (name: string): string => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
};