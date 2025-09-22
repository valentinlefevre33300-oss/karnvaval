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
  // Optional JSON per-size stock map coming from DB
  stock_by_size?: Record<string, number> | string | null;
  // Optional 3D model ID for Sketchfab integration
  model_3d_id?: string;
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
  if (!colorsString) return [];
  // First, try JSON array
  try {
    const parsed = JSON.parse(colorsString.replace(/'/g, '"')) as unknown;
    if (Array.isArray(parsed)) {
      return Array.from(new Set(parsed
        .filter((c) => c != null && String(c).trim() !== '')
        .map((c) => String(c).trim())));
    }
  } catch {
    // ignore and fallback to CSV
  }
  // Fallback: CSV like "Noir, blanc"
  return colorsString
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
};

export const parseStockBySize = (input: unknown): Record<string, number> => {
  if (!input) return {};
  if (typeof input === 'object' && !Array.isArray(input)) {
    const obj = input as Record<string, unknown>;
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(obj)) {
      const n = Number(v);
      if (!Number.isNaN(n)) out[String(k)] = n;
    }
    return out;
  }
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input) as unknown;
      return parseStockBySize(parsed);
    } catch {
      // support csv pairs like "38:5,39:2"
      const out: Record<string, number> = {};
      input.split(',').map(s => s.trim()).filter(Boolean).forEach(pair => {
        const [k, q] = pair.split(':').map(s => s.trim());
        const n = Number(q);
        if (k && !Number.isNaN(n)) out[k] = n;
      });
      return out;
    }
  }
  return {};
};

export const getProductSlug = (name: string): string => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
};