interface HasDate {
  data: { date: Date; pinned?: boolean };
}

export function sortByDate<T extends HasDate>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getFeaturedPost<T extends HasDate>(posts: T[]): T {
  const pinned = posts.find((p) => p.data.pinned);
  if (pinned) return pinned;
  return sortByDate(posts)[0]!;
}
