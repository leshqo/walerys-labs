# Walerys Labs

Polski, statyczny notatnik techniczny oparty na Astro. Treść mieszka w repozytorium,
GitHub Actions sprawdza i buduje stronę, a GitHub Pages serwuje gotowe pliki pod
`https://labs.walerys.app`. Wpisy zachowują adresy `/<slug>/`, bez prefiksu repozytorium.

## Praca lokalna

Używaj Node.js 24 i npm. Z katalogu głównego projektu:

```sh
npm ci
npm run check
npm run build
npm run preview
```

`check` sprawdza projekt, `build` zapisuje statyczną stronę do `dist/`, a `preview`
udostępnia lokalny podgląd tego buildu. Nie publikuje go w internecie.

Serwer deweloperski uruchamiaj w tle zgodnie z `AGENTS.md`:

```sh
npm exec -- astro dev --background
npm exec -- astro dev status
npm exec -- astro dev logs
npm exec -- astro dev stop
```

To lokalne wywołania poleceń `astro dev --background`, `astro dev status`,
`astro dev logs` i `astro dev stop` przez zainstalowane zależności projektu.

## Dodawanie wpisów

Utwórz `src/content/posts/<nazwa-folderu>/index.md`. Tekst i lokalne zasoby wpisu
trzymaj razem. Frontmatter:

```yaml
---
title: Tytuł wpisu
description: Krótki opis wpisu.
slug: przykladowy-wpis
pubDate: 2026-10-21
tags: [Web, Automatyzacja]
readingMinutes: 4
---
```

Wymagane pola to `title`, `description`, `slug`, `pubDate` i `readingMinutes`.
`tags` jest opcjonalną tablicą napisów; pominięte przyjmuje `[]`. Czas czytania
podaje autor ręcznie jako dodatnią liczbę całkowitą minut — nie jest obliczany z tekstu.
Schemat znajduje się w `src/content.config.ts`.

Slug określa publiczny adres, niezależnie od nazwy folderu. Musi być unikalnym,
bezpiecznym segmentem adresu. Nie używaj zarezerwowanych slugów `about`, `rss.xml`,
`404` ani slugów złożonych wyłącznie z cyfr: kolidują ze stronami projektu
lub paginacją archiwum. Nie dodawaj `src/pages/index.astro`, ponieważ strona główna
jest obsługiwana przez `src/pages/[...page].astro`.

Obraz obok Markdowna można wskazać względnie, np. `![Opis](./schemat.png)` —
jest częścią treści przetwarzanej przez Astro. Pliki w `public/` są kopiowane
bez przetwarzania; `public/images/schemat.png` ma adres `/images/schemat.png`,
nie `/public/images/schemat.png`.

**Nie ma filtra szkiców ani przyszłych dat.** Pole `draft: true` nie ukrywa
wpisu, a przyszłe `pubDate` nie opóźnia publikacji. Nie przechowuj niegotowych
tekstów w kolekcji. Wzorzec loadera `**/[^_]*.md` pomija pliki z nazwą zaczynającą
się od `_`, ale nie wyklucza całych folderów: `_szkice/index.md` nadal pasuje.
Sam prefiks `_` w nazwie katalogu nie zabezpiecza przed publikacją.

## Publikacja i infrastruktura

Workflow `.github/workflows/deploy.yml` wykonuje `npm ci`, `npm run check`
i `npm run build` dla pull requestów, pushów do `main` oraz ręcznych uruchomień.
Pull request nie wdraża strony. Deploy do GitHub Pages następuje dopiero po
udanym buildzie, dla zdarzenia innego niż pull request i wyłącznie na `main`;
ręczne uruchomienie na innej gałęzi również nie wdraża.

Adres kanoniczny określa `site` w `astro.config.mjs`:
`https://labs.walerys.app`. Domena niestandardowa jest skonfigurowana w ustawieniach
GitHub Pages. `public/CNAME` zawiera tę samą nazwę i trafia do artefaktu,
ale przy publikacji przez Actions nie zastępuje ustawienia domeny w Pages.

- **OVH** jest rejestratorem domeny.
- DNS obsługuje własny serwer DNS; **myDevil** zapewnia hosting i wsparcie domeny.
- **GitHub Pages**, a nie hosting myDevil, serwuje ten statyczny blog.
- Projekt nie zależy od Cloudflare.

Jawny rekord `labs CNAME leshqo.github.io` kieruje blog do Pages. Istniejący
wildcard `* CNAME → walerys.app` jest celowy i musi zostać zachowany; rekord
konkretnej subdomeny ma pierwszeństwo. Nie zmieniaj DNS przy zwykłej publikacji.

HTTPS działa i jest wymuszane przez GitHub Pages: HTTP przekierowuje na HTTPS.
GitHub zarządza wystawianiem i odnawianiem certyfikatu dla `labs.walerys.app`.
Nie trzeba instalować tego certyfikatu na myDevil ani kupować go w OVH.
Nie obchodź walidacji certyfikatów; przy diagnozie sprawdzaj ustawienia Pages i DNS.

## Bezpieczeństwo i pliki lokalne

Nie zapisuj tokenów ani haseł w repozytorium, adresach zdalnych Git, poleceniach
push ani treści wpisów. Do uwierzytelnienia używaj menedżera poświadczeń Git;
przy korzystaniu z GitHub CLI można skonfigurować integrację przez
`gh auth setup-git` dla właściwego konta. To wskazówka konfiguracji, nie krok deployu.

`.env` oraz warianty `.env.*` (np. `.env.local`, `.env.production`) są ignorowane.
Wyjątkiem jest `.env.example`, który może zawierać wyłącznie przykładowe,
niesekretne wartości. Statyczny build i zasoby dostarczane przeglądarce są publiczne;
zmienne `PUBLIC_*` nie służą do przechowywania sekretów.

`SESSION_CONTEXT.md` jest ignorowaną, lokalną notatką z sesji, nie publiczną
dokumentacją ani miejscem na dane uwierzytelniające.

Motyw jest zapamiętywany w `sessionStorage`: wybór dotyczy bieżącej sesji karty,
nie jest trwałym ustawieniem konta ani ustawieniem przechowywanym w `localStorage`.
