import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const reading = defineCollection({
  loader: glob({ base: './src/content/reading', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    bookTitle: z.string(),
    bookAuthor: z.string(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const travel = defineCollection({
  loader: glob({ base: './src/content/travel', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const slides = defineCollection({
  loader: glob({ base: './src/content/slides', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
  }),
});

export const collections = { blog, reading, travel, slides };
