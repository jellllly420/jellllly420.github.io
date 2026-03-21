import { describe, it, expect } from 'vitest';
import { sortByDate, getFeaturedPost } from '../content';

const mockPosts = [
  { id: '1', data: { title: 'Old', date: new Date('2023-01-01'), pinned: false } },
  { id: '2', data: { title: 'New', date: new Date('2024-06-15'), pinned: false } },
  { id: '3', data: { title: 'Mid', date: new Date('2023-06-15'), pinned: false } },
];

const mockPostsWithPinned = [
  { id: '1', data: { title: 'Old', date: new Date('2023-01-01'), pinned: true } },
  { id: '2', data: { title: 'New', date: new Date('2024-06-15'), pinned: false } },
];

describe('content utils', () => {
  describe('sortByDate', () => {
    it('sorts posts newest first', () => {
      const sorted = sortByDate(mockPosts);
      expect(sorted[0].data.title).toBe('New');
      expect(sorted[1].data.title).toBe('Mid');
      expect(sorted[2].data.title).toBe('Old');
    });
  });

  describe('getFeaturedPost', () => {
    it('returns pinned post when available', () => {
      const featured = getFeaturedPost(mockPostsWithPinned);
      expect(featured.data.title).toBe('Old');
    });

    it('returns newest post when no pinned post', () => {
      const featured = getFeaturedPost(mockPosts);
      expect(featured.data.title).toBe('New');
    });
  });
});
