# Bachapin Blog

A production-ready Astro blog boilerplate built for a single-developer publishing workflow:
content-first, static, fast, and intentionally small.

## Stack

- Astro 5 with static site generation
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
│   │   │   ├── draft-system-notes.mdx
│   │   │   ├── first-principles-for-small-blogs.mdx
│   │   │   └── static-search-with-pagefind.mdx
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

## Create a Blog Post

Add a new `.mdx` file under `src/content/blog`.

```mdx
---
title: "My New Post"
description: "A clear one-sentence summary for SEO and listings."
pubDate: 2026-04-26
tags: ["astro", "notes"]
draft: false
image: "/images/og-default.svg"
---

Write your post here.
```

Set `draft: true` to preview a post locally while excluding it from production builds,
RSS, and post listings.

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
