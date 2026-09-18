# NexisTech Admin Portal — Sign-in page

A single-page Angular application for the NexisTech Cloud Dashboard sign-in
screen. Dark carbon theme, violet brand accent, neon-green focus and success
states, fully responsive from 320 px phones up to large desktops.

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Angular 20 (standalone components, signals, new control flow) |
| Forms | Angular Reactive Forms with typed, non-nullable controls |
| Responsive layer | Bootstrap 5.3 (grid, form and utility classes only) |
| Styling | SCSS with a shared token file (`src/styles/_tokens.scss`) |
| Tests | Karma + Jasmine |

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm 10+

## Quick start

```bash
npm install
npm start
```

The dev server runs on <http://localhost:4200>.

Demo credentials for the mocked API:

```
Email:    admin@nexistech.io
Password: NexisTech@2026
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Dev server with live reload |
| `npm run build` | Production bundle in `dist/nexistech-admin-portal` |
| `npm test` | Unit tests in Chrome |

## Project structure

```
src/
├─ app/
│  ├─ app.component.ts          Router shell
│  ├─ app.config.ts             Application providers
│  ├─ app.routes.ts             Routes (login is lazy-loaded)
│  ├─ core/
│  │  ├─ models/auth.models.ts  LoginRequest / AuthSession contracts
│  │  └─ services/auth.service.ts
│  ├─ features/auth/login/      The sign-in page (ts / html / scss / spec)
│  └─ shared/components/nexis-logo/
├─ styles/
│  ├─ _tokens.scss              Colour, type, radius, motion tokens
│  └─ _mixins.scss              Focus ring, breakpoints, a11y helpers
├─ styles.scss                  Global theme
└─ index.html
```

## Brand tokens

| Token | Value | Used for |
| --- | --- | --- |
| Carbon base | `#121212` | Page background |
| Raised surface | `#191919` | Sign-in card |
| Violet | `#7C3AED` | Wordmark, primary button, links |
| Neon green | `#10B981` | Focus rings, checked states, success |
| Primary text | `#F4F4F5` | Headings and input text |
| Secondary text | `#A1A1AA` | Labels and supporting copy |

Change a value once in `src/styles/_tokens.scss` and it updates everywhere.

## Connecting the real API

`AuthService.signIn()` currently resolves a mocked session after 900 ms so the
page can be demoed on its own. To connect the live identity service:

1. Add `provideHttpClient()` to the `providers` array in `src/app/app.config.ts`.
2. Replace the body of `signIn()` with the real call:

```ts
private readonly http = inject(HttpClient);

signIn(request: LoginRequest): Observable<AuthSession> {
  return this.http.post<AuthSession>('/api/v1/auth/login', request);
}
```

3. Inject `Router` in `LoginComponent` and navigate in the `next` handler
   (the exact line is marked with a comment in `login.component.ts`).

No other file needs to change — the component only depends on the service
contract.

## Behaviour

- Inline validation appears after a field is touched, not while typing the first
  character.
- Failed sign-in shows a single, specific message in an `aria-live` region.
- The submit button locks and shows a spinner while the request is in flight,
  then switches to the green confirmed state.
- "Remember me" stores only the e-mail address in `localStorage`, never the
  password, and the storage access is guarded for SSR and hardened browsers.

## Accessibility

- Every control has a real `<label>`; the password toggle is a button with an
  `aria-label` and `aria-pressed` state.
- Visible green focus ring on every interactive element, keyboard reachable.
- Errors are linked to their fields via `aria-describedby` and `aria-invalid`.
- `prefers-reduced-motion` disables the card entrance and the spinner easing.
- Contrast of text and controls meets WCAG AA on the carbon background.

## Browser support

Latest two versions of Chrome, Edge, Firefox and Safari, plus iOS Safari 15+.
