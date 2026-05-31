# Changelog

All notable changes to the Castellers web UI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The UI version is defined in [`package.json`](package.json) (`version` field).

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
