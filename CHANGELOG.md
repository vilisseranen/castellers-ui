# Changelog

All notable changes to the Castellers web UI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The UI version is defined in [`package.json`](package.json) (`version` field).

## [1.7.1] - 2026-11-08

Second step of the JWT hardening. Requires the API 0.24.4 or later (`token_expired` error code, working `/logout`).

### Security

- Logging out now revokes the session on the server (`POST /logout`) before clearing it locally. Before, the refresh token stayed valid for 15 days after logout.
- Tokens from email links (registration, password reset, participation) are removed from the address bar as soon as the page has read them, so they no longer stay in the browser history.
- A request made with a token from an email link is no longer replayed with the logged-in user's session when that token has expired.

### Fixed

- The token refresh no longer loops: it now runs only when the API says the access token has expired (`code: "token_expired"`), not on every 403, and replays a request at most once.
- When the refresh fails, the user is logged out and sent to the login page (with a link back to the page they were on). Before, every following request failed until the page was reloaded.
- `Authorization` header: `Bearer <token>` instead of `Bearer: <token>`.
- The refresh token's expiry was read only when an access token was present, and logging out did not reset the language (`state.local` typo).

## [1.7.0] - 2026-11-07

### Changed

- Build with [Vite](https://vite.dev) 8 instead of Vue CLI 5, which is no longer maintained. `npm run serve`, `npm run build` and `npm run lint` keep working; `npm run preview` serves the production build locally. The dev server now listens on port 5173 and still proxies `/api` to `localhost:8080`.
- PWA: `vite-plugin-pwa` replaces `@vue/cli-plugin-pwa`. The service worker keeps the same name (`service-worker.js`) and manifest (`manifest.json`), so installed apps update in place. API calls (`/api/`) are excluded from the navigation fallback.
- Lint with ESLint 9 (flat config in `eslint.config.js`) and `eslint-plugin-vue` 10; Babel is no longer used. App code is linted with browser globals only, so leftover `process`/`require` are reported; `npm run lint` also covers the config files.
- Code: `process.env` → `import.meta.env` (the `VUE_APP_` prefix is still accepted), `require.context` → `import.meta.glob`, `require()` of Leaflet marker images → `import`.
- No more Babel/core-js transpilation: the build targets browsers supported by Vite by default (Chrome/Edge 111+, Firefox 114+, Safari 16.4+).

### Security

- Removing Vue CLI and webpack clears the remaining build-tool vulnerabilities (`webpack-dev-server`, `webpack-dev-middleware`, `serialize-javascript`, `workbox-build` 6, `postcss` 7, `cross-spawn`, `sockjs`, …). `workbox-build`'s `glob` is pinned to ^14.0.4 via `overrides`. `npm audit`: 25 → 5 findings, all low, all from `deepmerge` (used by `vuex-persistedstate` and by the service worker build; the only fix npm offers is a breaking downgrade of `vuex-persistedstate`).

## [1.6.5] - 2026-11-06

### Security

- Bump `vue` 3.2.45 → 3.5.45 and `@vue/compiler-sfc` to 3.5.45 (XSS in `@vue/server-renderer`; not reachable here since the app renders client-side only).
- Bump `vue-i18n` 9.14.5 → 11.4.18 (XSS through `escapeParameter`, fixed only in 11.x). The app keeps using the legacy API (`$t`, `$i18n.locale`), which v11 still supports but deprecates (to be removed in v12).
- Remove the unused `@intlify/vue-i18n-loader` dev dependency (it pulled a vulnerable `@intlify/message-compiler` 9.x).
- Replace the deprecated `v-t` directive with `v-text="$t(...)"`.
- Remove the unused `pluginOptions.i18n` block from `vue.config.js` (it configured a plugin that is not installed).
- Run `npm audit fix` on transitive dependencies (`follow-redirects`, `source-map-js`, `proxy-addr`, `body-parser`, `qs`, `node-forge`, `joi`, `launch-editor`, `fast-uri`, `postcss-selector-parser`, among others): 42 → 25 audit findings, none critical. Only 2 low findings are left in the production bundle (`vuex-persistedstate`/`deepmerge`). The rest are in the Vue CLI build tooling, which is no longer maintained.

## [1.6.4] - 2026-09-30

### Security

- Bump `axios` 0.27.2 → 1.20.0.
- Run `npm audit fix` on transitive dependencies (`form-data`, `http-proxy-middleware`, `lodash`, `vue-i18n`/`@intlify/*`, `js-yaml`, `compression`/`on-headers`, `qs`/`express`, `node-forge`, `webpack`, among others): 63 → 22 audit findings, no critical left. The remaining ones are in the Vue CLI build tooling.
- Build with Node 24 instead of Node 16 (CI workflow and fly.io `Dockerfile`).

## [1.6.3] - 2026-09-30

### Added

- New "Castanyada 2026" badge in the "Events" series (requires API `0.24.0`): image plus names and descriptions in French, English and Catalan.

## [1.5.1] - 2026-07-06

### Added

- New "Events" badge series with its first badge, Montréal Complètement Cirque 2026 (requires API `0.22.0`): image plus names and descriptions in French, English and Catalan.

## [1.5.0] - 2026-07-04

### Added

- Badges feature (requires API `0.21.0`). Members now see a badges section on their profile, grouped by series, with unlocked badges in color and locked ones in grayscale. The first series is "Welcome" with 7 badges.
- Admin "Badges" page to grant or revoke a badge for many members at once: pick a badge, then check or uncheck members; saving applies the additions and removals in batch.
- "My badges" navigation tab (visible to any logged-in member) opening a dedicated page that shows the member's own badges.

### Changed

- The members list and member profiles are now accessible to any logged-in member (not only admins), so everyone can search for and view a member's profile. Non-admins see a name-only list and a read-only profile showing first name, last name and badges. Editing rules are unchanged: only an admin or the member themselves can edit a profile.

## [1.4.0] - 2026-07-04

### Added

- Always-visible name search field on the members list page that filters by first name, last name, and full name. Works on mobile, where Oruga's card layout previously hid the per-column search inputs.

### Changed

- Removed an unused test variable from the members view.

## [1.3.0] - 2026-05-30

### Added

- Admin control on the member edit page to manually pause or reactivate a member, calling `PUT /api/v1/members/{member_uuid}/status`.

### Changed

- Version bumped to 1.3.0 (requires API 0.20.0 or newer for manual status changes).
- Realigned `VERSION` file with `package.json`.

## [1.2.0] - 2026-05-18

### Added

- Admin **Send reminders** panel on the event edit page (participation roster).
- Audience options: default list, active with no answer, active and paused with no answer, or selected members only.
- Row checkboxes and participant search when selecting individual recipients; selections persist while search filters the table.
- Confirmation modal before queueing reminders; calls `POST /api/v1/events/{event_uuid}/reminders`.

### Changed

- Version bumped to 1.2.0 (requires API 0.19.0 or newer for manual reminders).
