---
title: Witamy w labie
description: Dlaczego postawiłem statycznego notatnika i jak działa jego publikacja — od commita po DNS.
slug: witamy-w-labie
pubDate: 2026-10-20
tags: [Web, Automatyzacja]
readingMinutes: 4
---

To jest pierwszy wpis. Powstał w tym samym procesie, w którym powstanie każdy kolejny:
plik Markdown w repozytorium, commit, build na GitHub Actions i statyczny plik na GitHub Pages.

## Jak to działa

Cztery elementy, cztery różne funkcje:

- **Astro** buduje stronę. Czyta treść, nakłada layouty, generuje strony i listy.
- **GitHub Actions** sprawdza (`astro check`) i buduje (`astro build`) po każdym pushu.
- **GitHub Pages** serwuje gotowe pliki. Nikt nie uruchamia aplikacji na serwerze, żeby
  przeczytać akapit.
- **Cloudflare** prowadzi DNS dla `labs.walerys.app`.

Całość jest statyczna z wyboru, nie z braku możliwości:

```js
export default defineConfig({
  site: 'https://labs.walerys.app',
  output: 'static',
  trailingSlash: 'always',
});
```

## Wpis to folder, nie panel

Każdy notatnik to katalog w `src/content/posts/` — tekst i zasoby razem. Metadane siedzą
w frontmatterze i są walidowane schematem w `src/content.config.ts` przy każdym buildzie:

```md
---
title: Witamy w labie
description: Dlaczego postawiłem statycznego notatnika.
slug: witamy-w-labie
pubDate: 2026-10-20
tags: [Web, Automatyzacja]
readingMinutes: 4
---
```

Brakujące pole wysadzi build zanim cokolwiek opublikuję. Wolę złapać to w CI niż po
fakcie na produkcji.

## Czego tu nie będzie

Panelu administracyjnego, bazy danych i kolejnej aplikacji do utrzymywania. Zmiana
projektu to zmiana szablonu. Pisanie to pisanie — reszta ma się dzieć sama.
