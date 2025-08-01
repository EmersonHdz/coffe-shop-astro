import { z } from 'astro:content';

const imageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number()
});

const featuredImageSchema = z.object({
  thumbnail: imageSchema,
  medium: imageSchema,
  medium_large: imageSchema,
  large: imageSchema,
  full: imageSchema
});

const sectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string()
});

export const BaseWPSchema = z.object({
  id: z.number(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  featured_image: featuredImageSchema,
  acf: z.object({
    subtitle: z.string()
  })
});

export const ProcessPagesSchema = BaseWPSchema.extend({
  acf: z.object({
    subtitle: z.string(),
    section_1: sectionSchema,
    section_2: sectionSchema,
    section_3: sectionSchema,
    section_4: sectionSchema,
    section_5: sectionSchema,
  })
});

//blog area

export const PostSchema = z.object({
  id: z.number(),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
  }),
    date: z.string(),
  excerpt: z.object({
    rendered: z.string(),
  }).optional(), // por si acaso
  featured_image: z.any().optional(), // si tienes esa extensión o plugin
  slug: z.string().optional()
});

export const PostsSchema = z.array(PostSchema);
export type Post = z.infer<typeof PostSchema>;