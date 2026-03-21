import { describe, it, expect } from 'vitest';
import { formatDate, formatDateShort } from '../date';

describe('date utils', () => {
  it('formats date as "March 21, 2026"', () => {
    expect(formatDate(new Date('2026-03-21'))).toBe('March 21, 2026');
  });

  it('formats date short as "Mar 21, 2026"', () => {
    expect(formatDateShort(new Date('2026-03-21'))).toBe('Mar 21, 2026');
  });

  it('handles string dates', () => {
    expect(formatDate(new Date('2023-02-21'))).toBe('February 21, 2023');
  });
});
