import { describe, it, expect } from 'vitest';
import { parseProductSizes, parseProductColors, getProductSlug } from '../types';

describe('Product utility functions', () => {
  describe('parseProductSizes', () => {
    it('should parse JSON array string', () => {
      const result = parseProductSizes('["36", "37", "38"]');
      expect(result).toEqual(['36', '37', '38']);
    });

    it('should parse comma-separated string', () => {
      const result = parseProductSizes('36, 37, 38');
      expect(result).toEqual(['36', '37', '38']);
    });

    it('should handle single size', () => {
      const result = parseProductSizes('42');
      expect(result).toEqual(['42']);
    });

    it('should handle array input', () => {
      const result = parseProductSizes(['40', '41', '42']);
      expect(result).toEqual(['40', '41', '42']);
    });

    it('should return empty array for empty string', () => {
      const result = parseProductSizes('');
      expect(result).toEqual([]);
    });

    it('should handle malformed JSON gracefully', () => {
      const result = parseProductSizes('[36, 37');
      expect(result).toEqual(['36', '37']);
    });
  });

  describe('parseProductColors', () => {
    it('should parse valid JSON array', () => {
      const result = parseProductColors('["rouge", "bleu", "vert"]');
      expect(result).toEqual(['rouge', 'bleu', 'vert']);
    });

    it('should handle single quotes in JSON', () => {
      const result = parseProductColors("['rouge', 'bleu', 'vert']");
      expect(result).toEqual(['rouge', 'bleu', 'vert']);
    });

    it('should remove duplicates', () => {
      const result = parseProductColors('["rouge", "bleu", "rouge"]');
      expect(result).toEqual(['rouge', 'bleu']);
    });

    it('should filter out empty values', () => {
      const result = parseProductColors('["rouge", "", "bleu", null]');
      expect(result).toEqual(['rouge', 'bleu']);
    });

    it('should return empty array for invalid JSON', () => {
      const result = parseProductColors('invalid json');
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array JSON', () => {
      const result = parseProductColors('{"color": "rouge"}');
      expect(result).toEqual([]);
    });
  });

  describe('getProductSlug', () => {
    it('should convert name to lowercase slug', () => {
      const result = getProductSlug('Nike Air Max 90');
      expect(result).toBe('nike-air-max-90');
    });

    it('should replace spaces with hyphens', () => {
      const result = getProductSlug('Adidas Ultra Boost 22');
      expect(result).toBe('adidas-ultra-boost-22');
    });

    it('should remove special characters', () => {
      const result = getProductSlug('Air Jordan 1 "Chicago"');
      expect(result).toBe('air-jordan-1-chicago');
    });

    it('should handle multiple spaces', () => {
      const result = getProductSlug('Nike   Air   Force   1');
      expect(result).toBe('nike-air-force-1');
    });

    it('should trim whitespace', () => {
      const result = getProductSlug('  Nike Air Max  ');
      expect(result).toBe('nike-air-max');
    });

    it('should handle empty string', () => {
      const result = getProductSlug('');
      expect(result).toBe('');
    });

    it('should handle accented characters', () => {
      const result = getProductSlug('Chaussures été');
      expect(result).toBe('chaussures-t');
    });
  });
});