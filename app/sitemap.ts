import { siteConfig } from '@/config/site'
import { getAllPuzzles } from '@/lib/strands-data'
import { getAllConnections } from '@/lib/connections-data'
import { getAllWordles } from '@/lib/wordle-hints-data'
import { getPosts } from '@/lib/getBlogs'
import { GUIDE_SLUGS } from '@/data/guides'
import { MetadataRoute } from 'next'

const siteUrl = siteConfig.url

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: { path: string; freq: ChangeFrequency; priority: number }[] = [
    { path: '', freq: 'daily', priority: 1.0 },
    { path: '/strands-hint-today', freq: 'daily', priority: 0.95 },
    { path: '/strands-hint-yesterday', freq: 'daily', priority: 0.85 },
    { path: '/strands-hint', freq: 'daily', priority: 0.8 },
    { path: '/strands-statistics', freq: 'weekly', priority: 0.65 },
    { path: '/how-to-play-strands', freq: 'weekly', priority: 0.8 },
    { path: '/how-to-play-connections', freq: 'monthly', priority: 0.7 },
    { path: '/connections-hint-today', freq: 'daily', priority: 0.9 },
    { path: '/connections-hint', freq: 'daily', priority: 0.8 },
    { path: '/wordle-hint-today', freq: 'daily', priority: 0.9 },
    { path: '/wordle-hint', freq: 'daily', priority: 0.8 },
    { path: '/word-finder', freq: 'monthly', priority: 0.75 },
    { path: '/anagram-solver', freq: 'monthly', priority: 0.75 },
    { path: '/wordle-solver', freq: 'monthly', priority: 0.75 },
    { path: '/strands-hint-faq', freq: 'weekly', priority: 0.75 },
    { path: '/about', freq: 'weekly', priority: 0.6 },
    { path: '/contact', freq: 'weekly', priority: 0.5 },
    { path: '/privacy-policy', freq: 'monthly', priority: 0.3 },
    { path: '/terms-of-service', freq: 'monthly', priority: 0.3 },
  ]

  const pages = staticPages.map(({ path, freq, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }))

  // Letter game pages (4-11 letters)
  const letterGamePages = [4, 5, 6, 7, 8, 9, 10, 11].map(n => ({
    url: `${siteUrl}/${n}-letters`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.5,
  }))

  // Guides pages
  const guidesIndex = {
    url: `${siteUrl}/guides`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }

  const guidePages = GUIDE_SLUGS.map(slug => ({
    url: `${siteUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Puzzle pages
  const allPuzzles = await getAllPuzzles()
  const puzzlePages = allPuzzles.map(puzzle => ({
    url: `${siteUrl}/strands-hint/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Connections puzzle pages
  const allConnections = await getAllConnections()
  const connectionsPuzzlePages = allConnections.map((puzzle) => ({
    url: `${siteUrl}/connections-hint/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Wordle puzzle pages
  const allWordles = await getAllWordles()
  const wordlePuzzlePages = allWordles.map((puzzle) => ({
    url: `${siteUrl}/wordle-hint/${puzzle.printDate}`,
    lastModified: new Date(puzzle.printDate),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }))

  // Blog pages
  const { posts } = await getPosts('en')

  const blogIndex = {
    url: `${siteUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.7,
  }

  const postPages = posts
    .filter(post => Boolean(post.slug))
    .map(post => {
      const normalizedSlug = post.slug.startsWith('/') ? post.slug : `/${post.slug}`
      const postPath = normalizedSlug.startsWith('/blog/')
        ? normalizedSlug
        : `/blog${normalizedSlug}`

      return {
        url: `${siteUrl}${postPath}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.6,
      }
    })

  return [
    ...pages,
    ...letterGamePages,
    guidesIndex,
    ...guidePages,
    ...puzzlePages,
    ...connectionsPuzzlePages,
    ...wordlePuzzlePages,
    blogIndex,
    ...postPages,
  ]
}
