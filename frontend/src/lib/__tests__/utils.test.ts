import { describe, it, expect } from 'vitest';
import { cn, createQueryString, formatDate } from '../utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('class1', false && 'class2', 'class3');
      expect(result).toBe('class1 class3');
    });

    it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined and null', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });
  });

  describe('createQueryString', () => {
    it('should create query string from params', () => {
      const searchParams = new URLSearchParams();
      const result = createQueryString({ page: 1, limit: 10 }, searchParams);
      expect(result).toBe('page=1&limit=10');
    });

    it('should update existing params', () => {
      const searchParams = new URLSearchParams('page=1&limit=10');
      const result = createQueryString({ page: 2 }, searchParams);
      expect(result).toBe('page=2&limit=10');
    });

    it('should remove params with null value', () => {
      const searchParams = new URLSearchParams('page=1&limit=10');
      const result = createQueryString({ limit: null }, searchParams);
      expect(result).toBe('page=1');
    });

    it('should remove params with undefined value', () => {
      const searchParams = new URLSearchParams('page=1&limit=10');
      const result = createQueryString({ limit: undefined }, searchParams);
      expect(result).toBe('page=1');
    });

    it('should handle empty params', () => {
      const searchParams = new URLSearchParams('page=1');
      const result = createQueryString({}, searchParams);
      expect(result).toBe('page=1');
    });

    it('should convert numbers to strings', () => {
      const searchParams = new URLSearchParams();
      const result = createQueryString({ page: 1, limit: 20 }, searchParams);
      expect(result).toContain('page=1');
      expect(result).toContain('limit=20');
    });
  });

  describe('formatDate', () => {
    it('should format date object', () => {
      const date = new Date('2026-01-15');
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format date string', () => {
      const result = formatDate('2026-01-15');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format timestamp', () => {
      const timestamp = new Date('2026-01-15').getTime();
      const result = formatDate(timestamp);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should accept custom format options', () => {
      const date = new Date('2026-01-15');
      const result = formatDate(date, { month: 'short', day: '2-digit' });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid date gracefully', () => {
      expect(() => formatDate('invalid-date')).not.toThrow();
    });
  });
});
