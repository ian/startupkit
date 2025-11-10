# @startupkit/seo

SEO utilities for StartupKit projects including metadata generation, structured data, sitemaps, and robots.txt.

Part of [**StartupKit**](https://startupkit.com) - The Zero to One Startup Framework.

## Installation

```bash
pnpm add @startupkit/seo
```

Or use the [StartupKit CLI](https://startupkit.com) to get started with a complete monorepo setup:

```bash
npx startupkit init
```

## What This Package Provides

This package provides utilities for common SEO needs in Next.js applications:

- ✅ **Metadata generation** - OpenGraph, Twitter Cards, canonical URLs
- ✅ **Structured data** - Schema.org JSON-LD for rich snippets
- ✅ **Sitemap generation** - XML sitemap utilities
- ✅ **Robots.txt** - Crawler configuration helpers
- ✅ **Type-safe** - Full TypeScript support with Next.js types

## Usage

### Metadata

Generate Next.js metadata for pages:

```typescript
import { generateMetadata, defaultMetadata } from "@startupkit/seo"
import { getUrl } from "@repo/utils"

// In your root layout.tsx
export const metadata = defaultMetadata({
  title: "My SaaS App",
  description: "Build and ship faster",
  baseUrl: getUrl(),
  siteName: "My SaaS",
  twitterHandle: "@mysaas",
  keywords: ["SaaS", "Startup", "Next.js"]
})

// In a page
export const metadata = generateMetadata({
  title: "About Us",
  description: "Learn about our company",
  path: "/about",
  baseUrl: getUrl(),
  siteName: "My SaaS"
})
```

### Structured Data (Schema.org)

Generate JSON-LD structured data for rich snippets:

```typescript
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema
} from "@startupkit/seo"
import { getUrl } from "@repo/utils"

// Organization schema
const orgSchema = generateOrganizationSchema({
  name: "My SaaS",
  url: getUrl(),
  logo: getUrl("logo.png"),
  description: "We help you build faster",
  sameAs: [
    "https://twitter.com/mysaas",
    "https://github.com/mysaas"
  ]
})

// Website schema
const websiteSchema = generateWebsiteSchema({
  name: "My SaaS",
  url: getUrl(),
  description: "Build and ship faster"
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: getUrl() },
  { name: "Blog", url: getUrl("blog") },
  { name: "Post Title", url: getUrl("blog/post-title") }
])

// Article schema
const articleSchema = generateArticleSchema({
  headline: "How to Build a SaaS",
  description: "A complete guide",
  datePublished: "2025-01-01",
  dateModified: "2025-01-10",
  authorName: "John Doe",
  imageUrl: getUrl("blog/image.jpg")
})

// Add to page
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Your page content */}
    </>
  )
}
```

### Sitemap

Generate XML sitemaps in `app/sitemap.ts`:

```typescript
import { generateSitemap } from "@startupkit/seo"
import { getUrl } from "@repo/utils"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemap({
    baseUrl: getUrl(),
    routes: [
      {
        path: "",
        changeFrequency: "daily",
        priority: 1
      },
      {
        path: "about",
        changeFrequency: "monthly",
        priority: 0.8
      },
      {
        path: "blog",
        changeFrequency: "daily",
        priority: 0.9
      },
      {
        path: "pricing",
        changeFrequency: "weekly",
        priority: 0.8
      }
    ]
  })
}
```

### Robots.txt

Generate robots.txt in `app/robots.ts`:

```typescript
import { generateRobots } from "@startupkit/seo"
import { getUrl } from "@repo/utils"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return generateRobots({
    baseUrl: getUrl(),
    disallowPaths: ["/api/", "/dashboard/", "/auth/"]
  })
}
```

## API Reference

### `generateMetadata(params)`

Generate Next.js metadata object.

**Parameters:**
- `title` (string) - Page title
- `description` (string) - Page description
- `baseUrl` (string) - Base URL of your site
- `siteName` (string) - Name of your site
- `path` (string, optional) - Page path (default: "")
- `ogImage` (string, optional) - OpenGraph image path (default: "/hero/og.avif")
- `noIndex` (boolean, optional) - Prevent indexing (default: false)

**Returns:** Next.js `Metadata` object

### `defaultMetadata(params)`

Generate default metadata for root layout.

**Parameters:**
- `title` (string) - Default page title
- `description` (string) - Default description
- `baseUrl` (string) - Base URL of your site
- `siteName` (string) - Name of your site
- `twitterHandle` (string, optional) - Twitter username
- `ogImage` (string, optional) - Default OpenGraph image
- `keywords` (string[], optional) - SEO keywords
- `icons` (object, optional) - Favicon configuration
- `manifest` (string, optional) - Web manifest path

**Returns:** Next.js `Metadata` object with title template

### `generateOrganizationSchema(params)`

Generate Organization schema.

**Parameters:**
- `name` (string) - Organization name
- `url` (string) - Organization URL
- `logo` (string, optional) - Logo URL
- `description` (string, optional) - Description
- `sameAs` (string[], optional) - Social media URLs

**Returns:** `WithContext<Organization>` schema object

### `generateWebsiteSchema(params)`

Generate WebSite schema.

**Parameters:**
- `name` (string) - Website name
- `url` (string) - Website URL
- `description` (string) - Website description

**Returns:** `WithContext<WebSite>` schema object

### `generateBreadcrumbSchema(items)`

Generate BreadcrumbList schema.

**Parameters:**
- `items` (Array<{ name: string, url: string }>) - Breadcrumb items

**Returns:** `WithContext<BreadcrumbList>` schema object

### `generateArticleSchema(params)`

Generate Article schema.

**Parameters:**
- `headline` (string) - Article headline
- `description` (string) - Article description
- `datePublished` (string) - Publication date (ISO format)
- `authorName` (string) - Author name
- `imageUrl` (string) - Article image URL
- `dateModified` (string, optional) - Last modified date

**Returns:** `WithContext<Article>` schema object

### `generateSitemap(params)`

Generate sitemap routes.

**Parameters:**
- `baseUrl` (string) - Base URL of your site
- `routes` (SitemapRoute[]) - Array of route objects

**SitemapRoute:**
- `path` (string) - Route path
- `lastModified` (Date, optional) - Last modified date
- `changeFrequency` (string, optional) - Change frequency
- `priority` (number, optional) - Priority (0-1)

**Returns:** Next.js `MetadataRoute.Sitemap` array

### `generateRobots(params)`

Generate robots.txt configuration.

**Parameters:**
- `baseUrl` (string) - Base URL of your site
- `disallowPaths` (string[], optional) - Paths to disallow (default: ["/api/", "/dashboard/", "/auth/"])

**Returns:** Next.js `MetadataRoute.Robots` object

## Complete Example

Here's a complete example of using all utilities together:

```typescript
// app/layout.tsx
import { defaultMetadata } from "@startupkit/seo"
import { getUrl } from "@repo/utils"

export const metadata = defaultMetadata({
  title: "My SaaS App",
  description: "Build and ship faster with our SaaS platform",
  baseUrl: getUrl(),
  siteName: "My SaaS",
  twitterHandle: "@mysaas",
  keywords: ["SaaS", "Startup", "Next.js", "TypeScript"]
})

// app/about/page.tsx
import { generateMetadata } from "@startupkit/seo"
import { getUrl } from "@repo/utils"

export const metadata = generateMetadata({
  title: "About Us",
  description: "Learn about our mission and team",
  path: "/about",
  baseUrl: getUrl(),
  siteName: "My SaaS"
})

// app/sitemap.ts
import { generateSitemap } from "@startupkit/seo"
import { getUrl } from "@repo/utils"

export default function sitemap() {
  return generateSitemap({
    baseUrl: getUrl(),
    routes: [
      { path: "", priority: 1, changeFrequency: "daily" },
      { path: "about", priority: 0.8, changeFrequency: "monthly" },
      { path: "pricing", priority: 0.9, changeFrequency: "weekly" },
      { path: "blog", priority: 0.9, changeFrequency: "daily" }
    ]
  })
}

// app/robots.ts
import { generateRobots } from "@startupkit/seo"
import { getUrl } from "@repo/utils"

export default function robots() {
  return generateRobots({
    baseUrl: getUrl()
  })
}
```

## Philosophy

This package follows the StartupKit minimal package philosophy:

**What it does:**
- Provides reusable utilities for common SEO tasks
- Generates standard metadata formats (OpenGraph, Twitter Cards)
- Creates structured data for rich snippets
- Simplifies sitemap and robots.txt generation

**What it doesn't do:**
- Force specific SEO strategies or configurations
- Make decisions about your site structure
- Include heavy dependencies or third-party services

The utilities are simple, composable functions that you can use as needed.

## Peer Dependencies

- `next` >= 14.0.0 (for metadata types and App Router features)

## Learn More

- **StartupKit Website:** [startupkit.com](https://startupkit.com)
- **GitHub Repository:** [github.com/ian/startupkit](https://github.com/ian/startupkit)
- **Full Documentation:** [startupkit.com](https://startupkit.com)

## Support

Having issues? [Open an issue on GitHub](https://github.com/ian/startupkit/issues)

## License

ISC © 2025 01 Studio

