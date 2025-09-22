import { describe, it, expect } from 'vitest';
import { parseProductSizes, getProductSlug } from '../types';

describe('types utilities', () => {
  describe('parseProductSizes', () => {
    it('should parse comma-separated string sizes', () => {
      const sizes = '40,41,42,43';
      const result = parseProductSizes(sizes);
      
      expect(result).toEqual(['40', '41', '42', '43']);
    });

    it('should handle array input', () => {
      const sizes = ['40', '41', '42'];
      const result = parseProductSizes(sizes);
      
      expect(result).toEqual(['40', '41', '42']);
    });

    it('should handle empty string', () => {
      const result = parseProductSizes('');
      expect(result).toEqual([]);
    });

    it('should handle empty array', () => {
      const result = parseProductSizes([]);
      expect(result).toEqual([]);
    });

    it('should handle string with spaces', () => {
      const sizes = '40, 41, 42, 43';
      const result = parseProductSizes(sizes);
      
      expect(result).toEqual(['40', '41', '42', '43']);
    });

    it('should handle single size', () => {
      const sizes = '42';
      const result = parseProductSizes(sizes);
      
      expect(result).toEqual(['42']);
    });

    it('should handle JSON string format', () => {
      const sizes = '["40","41","42"]';
      const result = parseProductSizes(sizes);
      
      expect(result).toEqual(['40', '41', '42']);
    });

    it('should handle malformed JSON gracefully', () => {
      const sizes = '["40","41",invalid]';
      const result = parseProductSizes(sizes);
      
      // Should fallback to treating as comma-separated string
      expect(result).toEqual(['["40"', '"41"', 'invalid]']);
    });

    it('should handle null or undefined input', () => {
      expect(parseProductSizes(null as any)).toEqual([]);
      expect(parseProductSizes(undefined as any)).toEqual([]);
    });
  });

  describe('getProductSlug', () => {
    it('should create slug from product name', () => {
      const name = 'Nike Air Max 90';
      const result = getProductSlug(name);
      
      expect(result).toBe('nike-air-max-90');
    });

    it('should handle special characters', () => {
      const name = 'Adidas Ultraboost 22 (White/Black)';
      const result = getProductSlug(name);
      
      expect(result).toBe('adidas-ultraboost-22-white-black-');
    });

    it('should handle accented characters', () => {
      const name = 'Nike Édition Spéciale';
      const result = getProductSlug(name);
      
      expect(result).toBe('nike-edition-speciale');
    });

    it('should handle multiple spaces', () => {
      const name = 'Nike   Air   Max   90';
      const result = getProductSlug(name);
      
      expect(result).toBe('nike-air-max-90');
    });

    it('should handle leading and trailing spaces', () => {
      const name = '  Nike Air Max 90  ';
      const result = getProductSlug(name);
      
      expect(result).toBe('nike-air-max-90');
    });

    it('should handle empty string', () => {
      const result = getProductSlug('');
      expect(result).toBe('');
    });

    it('should handle string with only special characters', () => {
      const name = '!@#$%^&*()';
      const result = getProductSlug(name);
      
      expect(result).toBe('');
    });

    it('should handle numbers and letters', () => {
      const name = 'Nike Air Max 90 2024 Edition';
      const result = getProductSlug(name);
      
      expect(result).toBe('nike-air-max-90-2024-edition');
    });

    it('should handle very long names', () => {
      const name = 'Nike Air Max 90 Premium Edition with Special Technology and Advanced Features';
      const result = getProductSlug(name);
      
      expect(result).toBe('nike-air-max-90-premium-edition-with-special-technology-and-advanced-features');
    });

    it('should handle null or undefined input', () => {
      expect(getProductSlug(null as any)).toBe('');
      expect(getProductSlug(undefined as any)).toBe('');
    });
  });
});