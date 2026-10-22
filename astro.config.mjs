// @ts-check
import { defineConfig } from 'astro/config';
import { satteri, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://labs.walerys.app',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !['/404/', '/404.html'].includes(new URL(page).pathname),
    }),
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "form-action 'none'",
        "frame-src 'none'",
        "connect-src 'none'",
        "img-src 'self' data:",
      ],
    },
  },
  markdown: {
    syntaxHighlight: 'prism',
    processor: satteri({
      hastPlugins: [
        satteriHeadingIdsPlugin(),
        {
          name: 'article-image-figures',
          element: {
            filter: ['p'],
            visit(node, ctx) {
              const children = node.children.filter(
                (child) => child.type !== 'text' || child.value.trim() !== '',
              );
              const image = children[0];
              if (children.length !== 1 || image?.type !== 'element' || image.tagName !== 'img') return;
              const src = image.properties.src;
              if (typeof src !== 'string' || !ctx.data.astro?.localImagePaths.has(decodeURI(src))) return;

              const parent = ctx.parent(node);
              const index = ctx.indexOf(node);
              if (!parent || index === undefined) return;
              const next = parent.children.slice(index + 1).find(
                (child) => child.type !== 'text' || child.value.trim() !== '',
              );
              const caption = next?.type === 'element' && next.tagName === 'p'
                && next.children.length === 1
                && next.children[0].type === 'element'
                && next.children[0].tagName === 'em' ? next : undefined;

              // Satteri forwards these properties to Astro's getImage. Keep
              // text-heavy PNGs lossless at their original pixel dimensions.
              const properties = {
                ...image.properties,
                layout: 'none',
                ...(/\.png$/i.test(src) ? { format: 'png' } : {}),
              };
              const figureChildren = [image];
              figureChildren[0] = { ...image, properties };
              if (caption) {
                figureChildren.push({
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: caption.children,
                });
              }
              ctx.replaceNode(node, {
                type: 'element',
                tagName: 'figure',
                properties: { className: ['article-figure'] },
                children: figureChildren,
              });
              if (caption) ctx.removeNode(caption);
            },
          },
        },
        {
          name: 'heading-permalinks',
          element: {
            filter: ['h2', 'h3', 'h4', 'h5', 'h6'],
            visit(node, ctx) {
              const id = node.properties.id;
              if (typeof id !== 'string') return;
              ctx.appendChild(node, {
                type: 'element',
                tagName: 'a',
                properties: {
                  href: `#${id}`,
                  className: ['heading-anchor'],
                  ariaLabel: `Link to section: ${ctx.textContent(node)}`,
                },
                children: [{ type: 'text', value: '#' }],
              });
            },
          },
        },
        {
          name: 'keyboard-scrollable-code',
          element: {
            filter: ['pre'],
            visit(node, ctx) {
              ctx.setProperty(node, 'tabIndex', 0);
            },
          },
        },
      ],
    }),
  },
});
