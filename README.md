# Bachapin Blog

A production-ready Astro blog boilerplate built for a single-developer publishing workflow:
content-first, static, fast, and intentionally small.

## Stack

- Astro 6 with static site generation
- MDX blog posts
- Astro Content Collections
- Tailwind CSS
- Pagefind static search
- RSS feed and sitemap
- Docker-friendly static deployment

## Project Tree

```txt
.
├── public/
│   └── images/
│       ├── og-default.svg
│       └── post-placeholder.svg
├── src/
│   ├── components/
│   │   ├── BlogCard.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── NewsletterSignup.astro
│   │   └── SearchBox.astro
│   ├── content/
│   │   ├── blog/
│   │   │   └── .gitkeep
│   ├── content.config.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── about.astro
│   │   ├── index.astro
│   │   └── rss.xml.ts
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   └── posts.ts
│   └── env.d.ts
├── .dockerignore
├── .env.example
├── .gitignore
├── astro.config.mjs
├── Dockerfile
├── docker-compose.yml
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
└── tsconfig.json
```

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Build

```bash
npm run build
npm run preview
```

The build command runs Astro first, then Pagefind indexes the generated `dist` directory.
Search UI assets are emitted to `dist/pagefind`.

## Blog Article Workflow

Blog articles live in `src/content/blog` as Markdown or MDX files. The file name becomes
the public URL slug.

For example:

```txt
src/content/blog/swiftui-navigation-notes.mdx
```

Builds to:

```txt
/blog/swiftui-navigation-notes/
```

### 1. Create the MDX File

Create a new `.mdx` file under `src/content/blog` using a short, lowercase, hyphenated
file name.

Good examples:

```txt
ios-debugging-workflow.mdx
swiftui-state-notes.mdx
ai-assisted-refactoring.mdx
```

### 2. Add Frontmatter

Every article needs frontmatter that matches the Content Collection schema in
`src/content.config.ts`.

```mdx
---
title: "SwiftUI State Notes"
description: "A practical note on keeping SwiftUI state predictable in small apps."
pubDate: 2026-04-26
updatedDate: 2026-04-27
tags: ["ios", "swiftui", "workflow"]
draft: false
image: "/images/og-default.svg"
---

Write the article here.
```

Required fields:

- `title`: shown on the article page, cards, RSS, and SEO tags
- `description`: short summary for cards, meta description, RSS, and Open Graph
- `pubDate`: publish date used for sorting
- `draft`: set to `true` while working

Optional fields:

- `updatedDate`: shown on the post if the article has been revised
- `tags`: used on cards, article pages, and Umami tag analytics
- `image`: Open Graph image path

### 3. Draft Locally

Use drafts while writing:

```mdx
draft: true
```

Draft posts are visible in development so you can preview them locally, but they are
excluded from production builds, RSS, and public listings.

Start the dev server:

```bash
npm run dev
```

Then open the article at:

```txt
http://localhost:4321/blog/your-file-name/
```

### 4. Publish the Article

When the article is ready:

```mdx
draft: false
```

Then verify the production build:

```bash
npm run build
```

The build will:

- Generate the article page
- Update the blog listing
- Update RSS
- Update the sitemap
- Rebuild the Pagefind search index

### 5. Deploy

Commit the new article and deploy the generated site using your normal deployment flow.

If using the Docker infra in `infra/`, build the site and copy the static output into
the NGINX static directory:

```bash
npm run build
cp -R dist/. infra/data/
```

### Article Checklist

- [ ] File name is lowercase and hyphenated
- [ ] `title` is clear and specific
- [ ] `description` is useful as a search/social summary
- [ ] `pubDate` is correct
- [ ] Tags are lowercase and consistent with previous posts
- [ ] `draft` is `false` before publishing
- [ ] `npm run build` passes

## Environment

Copy `.env.example` to `.env` and set your canonical site URL:

```bash
SITE_URL=https://your-domain.com
```

Astro uses `SITE_URL` for canonical URLs, Open Graph images, RSS, and sitemap output.

## Docker

Build and serve the static site with nginx:

```bash
docker build -t bachapin-blog .
docker run --rm -p 8080:80 bachapin-blog
```

Run local development through Compose:

```bash
docker compose up
```

## Deployment

Deploy the generated `dist` directory to any static host. Good fits include Netlify,
Cloudflare Pages, Vercel, S3, or the provided Docker image.

Before production, set `SITE_URL` to the final domain so RSS, sitemap, canonical URLs,
and social images are correct.
