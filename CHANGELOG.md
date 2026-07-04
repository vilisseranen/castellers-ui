# Changelog

All notable changes to the Castellers web UI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The UI version is defined in [`package.json`](package.json) (`version` field).

## [1.5.0] - 2026-07-04

### Added

- Badges feature (requires API `0.21.0`). Members now see a badges section on their profile, grouped by series, with unlocked badges in color and locked ones in grayscale. The first series is "Welcome" with 7 badges.
- Admin "Badges" page to grant or revoke a badge for many members at once: pick a badge, then check or uncheck members; saving applies the additions and removals in batch.

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
