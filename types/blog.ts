
export type BlogPost = {
  locale?: string
  title: string
  description?: string
  image?: string
  slug: string
  tags?: string
  date: Date
  visible?: 'draft' | 'invisible' | 'published'
  pin?: boolean
  content: string
  metadata: {
    [key: string]: any
  },
}

// Shape emitted by scripts/build-blogs.mjs. Identical to BlogPost except the
// date is an ISO string, since JSON cannot carry a Date.
export type RawBlogPost = Omit<BlogPost, 'date'> & {
  date: string
}
