# Changelog

All notable changes to the Castellers web UI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The UI version is defined in [`package.json`](package.json) (`version` field).

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
