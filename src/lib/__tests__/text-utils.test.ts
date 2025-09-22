import { describe, it, expect } from 'vitest';
import { cleanAndFormatText, formatWithParagraphs, cleanTextSimple } from '../text-utils';

describe('text-utils', () => {
  describe('cleanAndFormatText', () => {
    it('should clean and format text with HTML tags', () => {
      const input = '<p>This is a <strong>test</strong> text with <em>formatting</em>.</p>';
      const result = cleanAndFormatText(input);
      
      expect(result).toBe('This is a test text with formatting.');
    });

    it('should handle multiple paragraphs', () => {
      const input = '<p>First paragraph.</p><p>Second paragraph.</p>';
      const result = cleanAndFormatText(input);
      
      expect(result).toBe('First paragraph.\n\nSecond paragraph.');
    });

    it('should handle empty input', () => {
      const result = cleanAndFormatText('');
      expect(result).toBe('');
    });

    it('should handle null or undefined input', () => {
      expect(cleanAndFormatText(null as any)).toBe('');
      expect(cleanAndFormatText(undefined as any)).toBe('');
    });

    it('should handle text without HTML tags', () => {
      const input = 'Plain text without any HTML tags.';
      const result = cleanAndFormatText(input);
      
      expect(result).toBe('Plain text without any HTML tags.');
    });

    it('should handle nested HTML tags', () => {
      const input = '<div><p>Nested <span>content</span> here.</p></div>';
      const result = cleanAndFormatText(input);
      
      expect(result).toBe('Nested content here.');
    });

    it('should handle line breaks', () => {
      const input = '<p>Line 1<br/>Line 2</p>';
      const result = cleanAndFormatText(input);
      
      expect(result).toBe('Line 1\nLine 2');
    });
  });

  describe('formatWithParagraphs', () => {
    it('should format text with paragraph breaks', () => {
      const input = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
      const result = formatWithParagraphs(input);
      
      expect(result).toContain('<p>First paragraph.</p>');
      expect(result).toContain('<p>Second paragraph.</p>');
      expect(result).toContain('<p>Third paragraph.</p>');
    });

    it('should handle single paragraph', () => {
      const input = 'Single paragraph text.';
      const result = formatWithParagraphs(input);
      
      expect(result).toBe('<p>Single paragraph text.</p>');
    });

    it('should handle empty input', () => {
      const result = formatWithParagraphs('');
      expect(result).toBe('');
    });

    it('should handle text without paragraph breaks', () => {
      const input = 'Text without paragraph breaks.';
      const result = formatWithParagraphs(input);
      
      expect(result).toBe('<p>Text without paragraph breaks.</p>');
    });

    it('should handle multiple consecutive line breaks', () => {
      const input = 'First paragraph.\n\n\n\nSecond paragraph.';
      const result = formatWithParagraphs(input);
      
      expect(result).toContain('<p>First paragraph.</p>');
      expect(result).toContain('<p>Second paragraph.</p>');
    });
  });

  describe('cleanTextSimple', () => {
    it('should clean text by removing HTML tags', () => {
      const input = '<p>This is <strong>bold</strong> text.</p>';
      const result = cleanTextSimple(input);
      
      expect(result).toBe('This is bold text.');
    });

    it('should handle empty input', () => {
      const result = cleanTextSimple('');
      expect(result).toBe('');
    });

    it('should handle null or undefined input', () => {
      expect(cleanTextSimple(null as any)).toBe('');
      expect(cleanTextSimple(undefined as any)).toBe('');
    });

    it('should handle plain text without HTML', () => {
      const input = 'Plain text without HTML tags.';
      const result = cleanTextSimple(input);
      
      expect(result).toBe('Plain text without HTML tags.');
    });

    it('should handle complex HTML structures', () => {
      const input = '<div class="container"><h1>Title</h1><p>Content with <a href="#">link</a>.</p></div>';
      const result = cleanTextSimple(input);
      
      expect(result).toBe('TitleContent with link.');
    });

    it('should handle self-closing tags', () => {
      const input = '<p>Text with <br/> line break.</p>';
      const result = cleanTextSimple(input);
      
      expect(result).toBe('Text with  line break.');
    });

    it('should handle malformed HTML', () => {
      const input = '<p>Unclosed tag <strong>bold text</p>';
      const result = cleanTextSimple(input);
      
      expect(result).toBe('Unclosed tag bold text');
    });
  });
});
