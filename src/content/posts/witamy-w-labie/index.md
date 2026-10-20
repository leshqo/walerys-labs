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

Elementy mają różne, jasno rozdzielone funkcje:

- **Astro** buduje stronę. Czyta treść, nakłada layouty, generuje strony i listy.
- **GitHub Actions** sprawdza (`astro check`) i buduje (`astro build`) pull requesty,
  pushe do `main` oraz ręczne uruchomienia. Pull request nie publikuje strony;
  wdrożenie następuje po udanym buildzie tylko z `main`, także przy ręcznym uruchomieniu.
- **GitHub Pages** serwuje gotowe pliki. Nikt nie uruchamia aplikacji na serwerze, żeby
  przeczytać akapit.
- **OVH** jest rejestratorem domeny. DNS obsługuje własny serwer DNS,
  a **myDevil** zapewnia hosting i wsparcie domeny — sam blog działa na Pages.
  Nie ma tu zależności od Cloudflare. GitHub Pages obsługuje certyfikat TLS
  i wymusza połączenia HTTPS.

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

Wymagane są `title`, `description`, `slug`, `pubDate` i `readingMinutes`.
`tags` jest opcjonalne i domyślnie ma wartość `[]`. Czas czytania wpisuję ręcznie.
Niepoprawne wymagane metadane zatrzymają build, zanim treść trafi do publikacji.

Nie ma jednak filtra szkiców ani przyszłych dat: `draft: true` nie ukrywa wpisu,
a przyszłe `pubDate` nie odracza publikacji. Folder `_szkice` też nie jest
zabezpieczeniem — loader pomija nazwy plików zaczynające się od `_`, nie całe
katalogi, więc `_szkice/index.md` nadal może zostać opublikowany.

## Czego tu nie będzie

Panelu administracyjnego, bazy danych i kolejnej aplikacji do utrzymywania. Zmiana
projektu to zmiana szablonu. Pisanie to pisanie — reszta ma się dzieć sama.
