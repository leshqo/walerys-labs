---
title: Welcome to the lab
description: Why I chose a static notebook and how publishing works — from commit to DNS.
slug: welcome-to-the-lab
pubDate: 2026-10-20
tags: [Web, Automation]
readingMinutes: 4
---

This is the first post. It was created the same way every future one will be:
a Markdown file in the repository, a commit, a build on GitHub Actions, and a
static file on GitHub Pages.

## How it works

The pieces have distinct, clearly separated roles:

- **Astro** builds the site. It reads the content, applies layouts, generates
  pages and lists.
- **GitHub Actions** checks (`astro check`) and builds (`astro build`) pull
  requests, pushes to `main`, and manual runs. A pull request doesn't publish
  the site; deployment happens after a successful build, only from `main`,
  including manual runs.
- **GitHub Pages** serves the finished files. Nobody runs an application on a
  server so you can read a paragraph.
- **OVH** is the domain registrar. DNS runs on my own DNS server, and
  **myDevil** provides hosting and domain support — the blog itself lives on
  Pages. There is no Cloudflare dependency here. GitHub Pages handles the TLS
  certificate and enforces HTTPS connections.

Everything is static by choice, not by necessity:

```js
export default defineConfig({
  site: 'https://labs.walerys.app',
  output: 'static',
  trailingSlash: 'always',
});
```

## A post is a folder, not a panel

Every notebook entry is a directory in `src/content/posts/` — text and assets
together. Metadata lives in the frontmatter and is validated by the schema in
`src/content.config.ts` on every build:

```md
---
title: Welcome to the lab
description: Why I chose a static notebook.
slug: welcome-to-the-lab
pubDate: 2026-10-20
tags: [Web, Automation]
readingMinutes: 4
---
```

`title`, `description`, `slug`, `pubDate` and `readingMinutes` are required.
`tags` is optional and defaults to `[]`. I enter the reading time manually.
Invalid required metadata stops the build before the content reaches
publication.

There is no draft filter or future-date handling, though: `draft: true` doesn't
hide a post, and a future `pubDate` doesn't delay publication. A `_szkice`
folder isn't a safeguard either — the loader skips file names starting with
`_`, not whole directories, so `_szkice/index.md` can still get published.

## What you won't find here

An admin panel, a database, or yet another application to maintain. Changing
the site is a template change. Writing is writing — the rest should take care
of itself.
