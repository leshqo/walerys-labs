## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Gotchas

- **Route conflict:** never create `src/pages/index.astro`; it collides with
  `src/pages/[...page].astro` (the archive with pagination is the homepage).
- **DNS:** the wildcard `* CNAME → walerys.app` at myDevil (DeviWEB panel) is intentional —
  do not remove it. The explicit `labs CNAME leshqo.github.io` record takes priority.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
