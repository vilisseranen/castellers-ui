# Changelog

All notable changes to the Castellers web UI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The UI version is defined in [`package.json`](package.json) (`version` field).

## [1.21.0] - 2026-11-27

Members inactive for too long are deleted automatically, after a notice: the admins see who and can keep them. Needs API 0.37.0.

### Added

- List of members, for admins: "Suppressions à venir" lists the members who will be deleted for inactivity, with the day ("Suppression prévue le…") and a "Garder" action that cancels the deletion and starts their inactivity delay again, together with the deleted members whose data is not erased yet, who can be restored. The link of the weekly email sent to the admins opens the list this way (`/members?upcoming=1`).
- The planned deletion and "Garder" also show in the usual list, on the members concerned.

## [1.20.0] - 2026-11-27

The personal data of a deleted member is erased after 90 days; until then an admin can restore them. Needs API 0.36.0.

### Added

- List of members, for admins: a "Supprimés" filter lists the deleted members whose data is not erased yet, with the day it will be ("Données effacées le…") and a "Rétablir" action to bring them back. If their email was given to another member in the meantime, a message says so.
- The confirmation asked before deleting a member says that their data will be erased in 90 days and that they can be restored until then.

### Changed

- Castells: somebody who left the colla stays in the castells they were part of, in gray and italics. Their name is written as long as their data is kept, then "Ancien membre". Before, their cell looked free as soon as they were deleted. In the pinya, the caption of the baix follows the same rule.

### Fixed

- Castell editor: loading the names of all the members could replace the list of available members, depending on which answer came first.

## [1.19.0] - 2026-11-26

The admins can note which members have a shirt of the colla. Needs API 0.35.0.

### Added

- Member page, for admins: "Taille de chemise" (an even number from 28 to 44, or "Aucune ou inconnue") and "A une chemise depuis le" (a day, not in the future). Both are optional: not everybody has a shirt.
- A member reads their own shirt on their profile, when something is noted, but cannot change it.

## [1.18.0] - 2026-11-26

An event can be cancelled rather than deleted: it stays in the list, clearly shown as cancelled. Needs API 0.34.0.

### Added

- Admins can cancel an event, from its card in the list (ban icon) or from its page ("Annuler l'évènement"). They pick a reason — "Météo", "Difficultés techniques" or "Autre" — and may add a short note. For an event still to come, a box, ticked by default, tells the members by email; untick it to cancel quietly.
- List of events: a cancelled event has a red "Annulé" banner with the reason, a red outline, its name struck through and the note under the date. The buttons to answer are gone.
- Event page: a red notice says the event is cancelled, with the reason and the note. Admins can change the reason, or restore the event with "Rétablir l'évènement"; members are told by email unless the box is unticked.

### Changed

- Event page of a cancelled event: reminders cannot be sent, and the presence of the members cannot be set.

### Fixed

- Answering from a link in an email no longer shows "success" when the answer could not be saved.

## [1.17.0] - 2026-11-25

Musicians of the colla: some members are musicians and rehearse every week. Needs API 0.33.0.

### Added

- Profile of a member: admins have a "Musicien·ne" switch, whatever the type of the member. A musician sees a "Musicien·ne" tag on their own profile.
- New type of event, "Répétition des musiciens", in the event form and in the event templates. These events have a "Musique" tag in the list.
- List of events: two boxes, "Pratiques de castells" and "Répétitions des musiciens", say what the list shows. Practices are shown to everyone by default; rehearsals are shown by default to the musicians and to the admins only. Anyone can tick or untick either box, and the choice is kept on the device until the member logs out. Presentations and social events are always listed.
- Event page of a rehearsal, for admins: the list of participants only shows the musicians, and anyone who answered or came. Unticking "Musiciens seulement" shows everyone. A note under the reminders recalls that they only go to the musicians.
- List of participants of any event: the musicians have a small music tag next to their name, to see at a glance whether the music is covered.

## [1.16.0] - 2026-11-23

### Added

- List of participants of an event: the canalla now have a "Canalla" tag with a child icon next to their name, so they stand out in the list.

## [1.15.0] - 2026-11-15

Needs API 0.31.0 for the new box to have an effect.

### Added

- Updating an event that is still to come: above the "Mettre à jour" button, a box "Prévenir les membres par courriel", ticked by default. Unticking it saves the change without sending the notice, for example to fix a typo. The box is ticked again after each save. Past events never send a notice, so the box is not shown for them.

## [1.14.0] - 2026-11-14

Needs API 0.30.0 for the new box to have an effect.

### Added

- Deleting an event that is still to come: the confirmation has a box "Prévenir les membres par courriel", ticked by default. Unticking it deletes the event without sending the notice, for example for an event created by mistake. Past events never send a notice, so the box is not shown for them.

### Fixed

- The confirmation shown before deleting an event put the name of the event in it as HTML. The name is now escaped.

## [1.13.0] - 2026-11-14

Event templates. Needs API 0.29.0.

### Added

- Event form, for admins: "Partir d'un modèle" when creating an event. Choosing a template fills in the name, the type, the times, the location and the description; everything can still be changed. The day, the recurrence and the dues are left as they are. If something was already typed, a confirmation is asked before it is replaced.
- Event form: "Enregistrer comme modèle" saves the values of the form under a name. A template that already has that name is replaced, after confirmation.
- New page "Modèles d'évènement" (`/eventTemplates`), reached from the event form: list of the templates, with a form to edit one (name, name of the event, type, times, location, description, uniform), create one or delete one.
- Changing or deleting a template never changes the events already created.

### Fixed

- The confirmation asked before unticking dues in the presence table showed the name of the member as HTML. The name is now escaped, as are the names of the templates in their confirmations.

## [1.12.1] - 2026-11-14

### Added

- List of events: an event at which dues are collected carries a "Cotisation" tag with a coin icon, next to the type of the event and the uniform tag.

## [1.12.0] - 2026-11-13

Dues, second step: making them visible. Needs API 0.28.0.

### Added

- New page "Combien ça coûte" (`/cost`), in the menu of every logged-in member: the collections of the current season with their amounts and dates, the total, how to pay (Interac address when it is set), paying the whole year at once, what a new member pays, who pays, and a link to the profile.
- Events: when editing an event, admins can switch on "Cueillette de cotisation" and choose the collection. The event then shows a notice with the name and the amount of the dues, and tells the member whether they have already settled them. In a series of recurring events, only the first one keeps the collection.
- Presence table of an event with a collection: one more column to tick the dues of the regular members and admins on the spot. Unticking asks for confirmation. Every change goes to the journal, as on the dues page.
- Dues page: the address for Interac transfers and the link to the sign-up page of the Cercle culturel catalan are edited with the amounts and dates. The link is offered to newcomers in "Combien ça coûte" and in the profile of members who have not settled the Cercle.
- Profile, "My dues": a member who has not settled the Cercle for the current season sees the number of confirmed attendances since their first visit, and a reminder that the Cercle comes first. A link leads to "Combien ça coûte".

### Changed

- Dues of the colla collected before a member first came no longer show as "to pay" but as "before you joined", in the profile and on the dues page; "only dues to pay" leaves them out. The first visit is the first event with a confirmed presence; without one, nothing changes. The Cercle is always due, and a state recorded by an admin always wins.

## [1.11.1] - 2026-11-13

### Changed

- Dues page: without a search, the list only holds the active members. Accounts that were never activated are no longer listed by default, even recent ones: too many of them belong to people who came once or never. A new box, "Show accounts that were never activated", adds them, like the one for paused members. A search by name still looks through everybody.

## [1.11.0] - 2026-11-13

### Changed

- Dues page: without a search, the list only holds the active members and the accounts created in the last year that were not activated yet (and the paused members when the box is ticked). Accounts created long ago and never activated are left out. The creation date comes from API 0.27.0; with an older API, only the active members are listed.
- Dues page: a search by name looks through every regular member and admin, whatever their status. Guests and the canalla are never listed.
- A member whose account was never activated is tagged as such.

## [1.10.0] - 2026-11-12

Dues register (cotisations), first step. The app does not handle payments: an admin ticks which dues a member has settled. Needs API 0.26.0.

### Added

- New admin page "Cotisations" (`/dues`), in the menu:
  - Choose a season. A season follows the membership year of the Cercle culturel catalan (October 1st to September 30th): the Cercle in the autumn, then winter, spring and summer.
  - Create the four collections of a season, with suggested amounts (35, 20, 20, 10 $) and dates, and edit them later.
  - List of the regular members and admins, with one coloured tag per collection. Search by name, show only the members with dues to pay, show the paused members.
  - Tap a member to set each collection to "not paid", "paid" or "exempt", with an optional note. "Whole year" ticks winter, spring and summer at once.
  - A notice appears when a due of the colla is ticked while the Cercle is not settled for the season. It does not block anything.
  - History of the member under the form, and a "Journal" tab with every change: who, for whom, what and when, filtered by member, collection or author.
- Profile: "My dues" (or "Dues" when an admin looks at a member), with the collections of the current season, past and upcoming, the amount, the date and the state: paid, paid in advance, to pay, upcoming or exempt. Past seasons can be unfolded when something was recorded in them.
  - A member only sees their own dues. The canalla and guests have none.
- Texts in French, Catalan and English.

## [1.9.2] - 2026-11-11

The castell drawing no longer needs Raphael.js. It looks and behaves the same. No API change.

### Changed

- Castell drawing: drawn as a native SVG by the Vue template, with pointer events for the taps and the drags, instead of Raphael.js. Same cells, sizes, colours and texts as before.
- The drawing follows the members and the positions by itself: a name is written as soon as the list of members is loaded, even when it arrives after the castell.

### Removed

- Dependency on `raphael` (and `eve-raphael`).

## [1.9.1] - 2026-11-10

### Fixed

- Castell drawing: after a few assignments, tapping a cell did nothing any more, until the page was reloaded. A tap during which the finger moved a little was taken for a drag that never ended, and all the next taps were ignored. Such a tap now assigns the selected member, and a drag always ends, wherever it is dropped.
- Castell drawing: dragging a cell onto another one to swap two people did not find the cells when the page was scrolled, which is always the case on a phone.
- Castell drawing: a member of the canalla could be selected and assigned to a cell, but the name was never written in the cell, as if nothing had happened.

## [1.9.0] - 2026-11-10

Castell editor: choose the event first, then pick among the people who come to it. No API change.

### Added

- The event of a castell is chosen in a list on the castell page, also for a castell that is not saved yet. The castell is attached to the selected event (or detached, with "no event") when it is saved.
- As soon as an event is selected, the list of available members only shows the people who come to it (present, or registered as coming when presence is not taken yet). The checkbox "only people coming to the event" above the list shows everybody of the member filter again.
- Search by first or last name above the list of available members, ignoring case and accents. A search looks in all the members of the filter, coming to the event or not, to add somebody in particular.

### Changed

- The colours of the drawing (coming or not) are refreshed as soon as the event changes, without reloading the page.

### Removed

- The "Add to event" button and its dialog, replaced by the list. A castell no longer has to be saved before an event can be chosen.

## [1.8.0] - 2026-11-10

First step of pinya planning: the pinya of the pilar de 4. Needs API 0.25.0, which provides the pinya positions; with an older API nothing changes.

### Added

- The castell drawing shows the pinya under the tronc, as a plan seen from above, for the castells that have pinya positions (only `1d4` for now). The baix is in the middle and faces the bottom of the plan: agulla in front, contrafort behind, a crossa on each side, then 8 rengles of 2 cordons (mans in front and behind, vents on the sides, laterals in the corners).
- Members are assigned to the pinya like to the tronc: select a member then click a cell, or drag a cell onto another one to swap, including between tronc and pinya. A free cell shows the name of its position.
- The same plan is shown read-only on the event page, with the usual presence colours.
- `src/api/pinyaLayout.js` holds the geometry of the plan, separate from the drawing.

## [1.7.2] - 2026-11-08

Third step of the JWT hardening: reduce what an injected script could do and where it could come from.

### Security

- FontAwesome is now bundled with the app (`@fortawesome/fontawesome-free` 7) instead of loading `all.js` 5.3.1 from `use.fontawesome.com` without integrity check. The page no longer loads any third-party script.
- nginx sends security headers on every response (`deployment/fly.io/etc/security-headers.conf`, included in both locations):
  - `Content-Security-Policy`: scripts, fonts and styles only from the app itself; API calls only to the app and the API host (`api.amunt.castellersdemontreal.info`); map tiles from OpenStreetMap; no framing, no plugins. Inline styles stay allowed;
  - `Strict-Transport-Security` (1 year), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation, payment disabled).

### Changed

- Icons are rendered with the FontAwesome web font instead of SVG; the icon names are unchanged. FontAwesome 7 still accepts the version 5 names used by the app. Only the solid style is bundled.

### Fixed

- The close icon of confirmation dialogs used Oruga's default icon pack (Material Design Icons), which is not loaded, so it did not show.
- If the API host changes, update `connect-src` in `security-headers.conf` as well as `VUE_APP_API_URL`.

## [1.7.1] - 2026-11-08

Second step of the JWT hardening. Requires the API 0.24.4 or later (`token_expired` error code, working `/logout`).

### Security

- Logging out now also revokes the current refresh token on the server (`POST /logout`). Before, it stayed valid for 15 days after logout. Refresh tokens issued before the last refresh stay valid until they expire, until the API revokes whole sessions.
- Tokens from email links (registration, password reset, participation) are removed from the address bar as soon as the page has read them, so they no longer stay in the browser history.
- A request made with a token from an email link is no longer replayed with the logged-in user's session when that token has expired.

### Fixed

- The token refresh no longer loops: it now runs only when the API says the access token has expired (`code: "token_expired"`), not on every 403, and replays a request at most once.
- When the API rejects the refresh token, the user is logged out and, on pages that need a login, sent to the login page with a link back. On public pages (e.g. events) the request is replayed anonymously. A network or server error during the refresh no longer ends the session. Before, every following request failed until the page was reloaded.
- A persisted session whose refresh token has expired is cleared at startup, so public pages load anonymously instead of failing with an expired token.
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
