import { z } from 'zod';

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

// gallery area
const gallerySchema = z.object({
  large: imageSchema,
  full: imageSchema,
});

export const GalleryPageSchema = BaseWPSchema.extend({
         gallery: z.array(gallerySchema)
})


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
export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
})
const CategoriesSchema = z.array(CategorySchema);

export const CategoriesSlugSchema = z.array(CategorySchema.pick({
    slug: true
}));


export const PostSchema = z.object({
  id: z.number(),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
  }),
    date: z.string(),
    category_details: CategoriesSchema,
  excerpt: z.object({
    rendered: z.string(),
  }).optional(), 
  featured_image: z.any().optional(), 
  slug: z.string().optional()
});



//menu area
const MenuItemSchema = BaseWPSchema.pick({
   title: true,
   featured_image: true
}).extend({
     acf: z.object({
      description: z.string(),
      price: z.coerce.number()
     })
})

// contact area

/**map area */
const MarkerSchema = z.object({
  label: z.string(),
  lat: z.number(),
  lng: z.number(),
})

const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  zoom: z.number(),
  markers: z.array(MarkerSchema)
})

export const ContactPageSchema = BaseWPSchema.extend({
  acf: z.object({
  subtitle: z.string(), 
  }).catchall(LocationSchema)
})

export const MenuItemsSchema = z.array(MenuItemSchema)
export const PostsSchema = z.array(PostSchema);
export type Post = z.infer<typeof PostSchema>;
export type Gallery = z.infer<typeof gallerySchema>;
export type FeaturedImage = z.infer<typeof featuredImageSchema>
export type Location = z.infer<typeof LocationSchema>



