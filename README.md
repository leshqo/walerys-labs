# Walerys Labs

Anglojęzyczne, osobiste laboratorium o technologii, uczeniu się i sposobach pracy, oparte na Astro. Treść mieszka w repozytorium,
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
bezpiecznym segmentem adresu. Nie używaj zarezerwowanych slugów `about`, `privacy`,
`rss.xml`, `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`, `404` ani slugów złożonych wyłącznie z cyfr: kolidują ze stronami projektu
lub paginacją archiwum. Nie dodawaj `src/pages/index.astro`, ponieważ strona główna
jest obsługiwana przez `src/pages/[...page].astro`.

Obraz obok Markdowna można wskazać względnie, np. `![Opis](./schemat.png)` —
jest częścią treści przetwarzanej przez Astro. Pliki w `public/` są kopiowane
bez przetwarzania; `public/images/schemat.png` ma adres `/images/schemat.png`,
nie `/public/images/schemat.png`.

Samodzielne obrazy Markdown są składane w `<figure>`. Jeśli następny akapit jest
wyłącznie kursywą, staje się podpisem `<figcaption>`. PNG z diagramami zachowują
oryginalną rozdzielczość i bezstratny format; CSS skaluje je bez zniekształceń.
Wysokie ilustracje mają ograniczoną wysokość w kolumnie tekstu.
Komponent `ArticleImages.astro` dodaje lokalny odnośnik „Open full-resolution image”
do obrazu i jego podpowiedzi. Można go otworzyć myszą lub klawiaturą; bez JavaScript
nadal widoczne są ilustracja, opis alternatywny i podpis.

Opcjonalna miniatura obok tytułu na liście wpisów i w nagłówku artykułu:

```yaml
thumbnail:
  src: ./thumbnail.webp
  alt: Router and test equipment used in the experiment.
```

`src` wskazuje lokalny obraz; `alt` jest wymaganym, niepustym opisem po angielsku.
Miniatura nie jest wymagana — bez niej nie powstaje puste miejsce ani obraz zastępczy.

Strona główna używa nazwy **Labs**. Licznik stron i nawigacja paginacji pojawiają się
dopiero po przekroczeniu 10 wpisów. Tagi są tekstowymi etykietami, nie filtrami.
Stopka zawiera RSS, About i Privacy oraz pozostaje przy dolnej krawędzi widoku przy krótkiej treści.

Nagłówki Markdown od poziomu H2 do H6 otrzymują podczas budowania link `#`
do sekcji z angielską etykietą dostępności. Link działa również bez JavaScript.
Identyfikatory generuje Astro; powtórzone nagłówki dostają odrębne identyfikatory.
Bloki kodu są kolorowane przez Prism podczas budowania. Korzystają z klas CSS i palety
strony w obu motywach, bez stylów inline ani dodatkowego JavaScript do kolorowania.
Mają `tabindex="0"`, aby dało się przewijać długie linie klawiaturą.
Przycisk `light` / `dark` wskazuje motyw, na który przełączy.

Portret w About pochodzi z `src/assets/leszek-portrait.webp`: zoptymalizowana kopia
zdjęcia bez retuszu twarzy, z kadrowaniem/oprawą w CSS. Źródłowy PDF historii autora
nie jest częścią publikacji.

**Nie ma filtra szkiców ani przyszłych dat.** Pole `draft: true` nie ukrywa
wpisu, a przyszłe `pubDate` nie opóźnia publikacji. Nie przechowuj niegotowych
tekstów w kolekcji. Wzorzec loadera `**/[^_]*.md` pomija pliki z nazwą zaczynającą
się od `_`, ale nie wyklucza całych folderów: `_szkice/index.md` nadal pasuje.
Sam prefiks `_` w nazwie katalogu nie zabezpiecza przed publikacją.

## Metadane, indeksowanie i prywatność

`Base.astro` generuje canonical, Open Graph, karty Twitter/X i wskazanie autora.
Domyślny obraz udostępniania to `public/social/labs.png` (1200 × 630, PNG).
Przy wymianie pliku zachowaj wymiary lub uaktualnij je i opis alternatywny w layoucie.
Gdy artykuł ma miniaturę, Astro generuje z niej PNG do udostępniania i podaje jej
rzeczywiste wymiary. Grafika marki nie jest deklarowana jako ilustracja artykułu w JSON-LD.

Wpisy mają `og:type=article`, datę publikacji, widoczny podpis autora i JSON-LD
`BlogPosting`. About zawiera `ProfilePage` z obiektem `Person` i odnośnikiem do LinkedIn.
Nie generujemy daty modyfikacji z czasu buildu ani nie deklarujemy niepodanych informacji.
Treść JSON-LD jest zabezpieczona przed zamknięciem elementu `<script>` przez tekst wpisu.

Integracja `@astrojs/sitemap` generuje `sitemap-index.xml` i mapy podrzędne,
obejmujące również dynamiczne trasy i paginację. `robots.txt` wskazuje indeks mapy
i korzysta z tej samej konfiguracji `site`. Strona 404 jest wykluczona z mapy,
ma `noindex, follow` i nie zawiera canonical ani `og:url`. Nie blokujemy jej w robots.txt.

Publiczna informacja `/privacy/` opisuje GitHub Pages, logowanie IP do celów bezpieczeństwa,
preferencję motywu oraz kontakt przez LinkedIn. Nie ma obecnie analityki, reklam ani
osadzonych widgetów. Przed dodaniem formularzy, analityki, newslettera czy zewnętrznych
embedów trzeba ponownie ocenić faktyczne przetwarzanie i uaktualnić tę informację.
Po wdrożeniu należy osobno sprawdzić URL w Search Console i podgląd linku na LinkedIn —
lokalny build nie potwierdza indeksacji ani odświeżenia pamięci podręcznej serwisów.

Astro generuje CSP w `<meta>` z hashami skryptów i stylów; nie używamy `unsafe-inline`
ani `unsafe-eval`. Skrypt inicjujący motyw i JSON-LD mają jawnie zarejestrowane hashe.
Polityka ogranicza zasoby do własnej domeny (obrazy mogą też używać `data:`),
blokuje połączenia skryptowe, obiekty, ramki i wysyłanie formularzy.
Dokument ustawia także `strict-origin-when-cross-origin` przez `<meta name="referrer">`.
To nie są nagłówki HTTP: GitHub Pages nie daje tu konfiguracji HSTS, `X-Content-Type-Options`,
`X-Frame-Options` ani `Permissions-Policy`. CSP w meta nie obsługuje `frame-ancestors`;
nie deklarujemy ochrony przed osadzaniem samego bloga w cudzej ramce.
Nie dodawaj atrap `_headers` ani `http-equiv` dla polityk, których przeglądarka tak nie egzekwuje.


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

Motyw jest zapamiętywany w `sessionStorage` wyłącznie po kliknięciu przycisku:
wybór dotyczy bieżącej sesji karty, nie jest trwałym ustawieniem konta ani ustawieniem
przechowywanym w `localStorage`. Pierwsze wejście i odczyt istniejącej preferencji nie zapisują wartości.
