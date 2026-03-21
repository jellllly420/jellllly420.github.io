import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getInitialTheme, toggleTheme, applyTheme } from '../theme';

describe('theme utils', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('getInitialTheme', () => {
    it('returns stored theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      expect(getInitialTheme()).toBe('dark');
    });

    it('returns light when localStorage is empty and no OS preference', () => {
      expect(getInitialTheme()).toBe('light');
    });

    it('returns dark when OS prefers dark and no stored theme', () => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
      expect(getInitialTheme()).toBe('dark');
      vi.unstubAllGlobals();
    });
  });

  describe('toggleTheme', () => {
    it('toggles light to dark', () => {
      expect(toggleTheme('light')).toBe('dark');
    });

    it('toggles dark to light', () => {
      expect(toggleTheme('dark')).toBe('light');
    });
  });

  describe('applyTheme', () => {
    it('sets data-theme attribute on document', () => {
      applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('persists theme to localStorage', () => {
      applyTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });
});
