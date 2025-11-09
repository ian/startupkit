# SEO Configuration

This directory contains SEO-related configuration and utilities for the Next.js application.

## Files

### `robots.ts`
Generates the `robots.txt` file for search engine crawlers. Configure which paths should be crawled or blocked.

### `sitemap.ts`
Generates the `sitemap.xml` file listing all public pages. Update this when adding new routes.

### `metadata.ts`
Shared metadata configuration and helper functions for generating page-specific metadata. Use `generateMetadata()` for consistent SEO across pages.

### `structured-data.ts`
JSON-LD structured data helpers for rich search results. Includes schemas for:
- Organization
- Website
- Breadcrumbs
- Articles

## Usage

### Complete Example

See `example-usage.tsx` for a full working example. Here's how to use both metadata and structured data together:

```typescript
import { generateMetadata } from '@/app/(seo)/metadata';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from '@/app/(seo)/structured-data';
import { getUrl } from '@repo/utils';

export const metadata = generateMetadata({
  title: 'Example Page',
  description: 'This is an example page demonstrating SEO configuration',
  path: '/example',
});

export default function ExamplePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: getUrl() },
    { name: 'Example', url: `${getUrl()}/example` },
  ]);

  const organizationSchema = generateOrganizationSchema({
    name: 'Your Company',
    url: getUrl(),
    logo: `${getUrl()}/logo.png`,
    description: 'Your company description',
    sameAs: [
      'https://twitter.com/yourcompany',
      'https://github.com/yourcompany',
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Example Page</h1>
        <p className="text-lg">
          This page demonstrates how to use the SEO utilities.
        </p>
      </main>
    </>
  );
}
```

### Quick Examples

**Simple page metadata:**
```typescript
import { generateMetadata } from "@/app/(seo)/metadata"

export const metadata = generateMetadata({
  title: "My Page",
  description: "Page description",
  path: "/my-page"
})
```

**Article schema:**
```typescript
import { generateArticleSchema } from "@/app/(seo)/structured-data"

const articleSchema = generateArticleSchema({
  headline: "Article Title",
  description: "Article description",
  datePublished: "2024-01-01",
  authorName: "Author Name",
  imageUrl: "/article-image.jpg"
})
```

## Customization

1. Update social media handles in `metadata.ts`
2. Add your logo URL in `structured-data.ts`
3. Update disallowed paths in `robots.ts`
4. Add new routes to `sitemap.ts`

