# Member types and statuses (frontend)

This document describes how the two member dimensions — **type** and
**status** — are used in the Vue frontend. Both are simple string fields
on the `member` object returned by the API and persisted in the Vuex
store at `state.members.members`
([`src/store/modules/members.js`](../src/store/modules/members.js)).

> The canonical definition of these values lives in the backend
> (`castellers/model/members.go`). This document only covers their use
> in the UI.

## Valid values

The values match the backend constants exactly:

| Dimension | Values                                              |
|-----------|-----------------------------------------------------|
| `type`    | `admin`, `member`, `canalla`, `guest`               |
| `status`  | `created`, `active`, `paused`, `deleted`, `purged`  |

`purged` exists in the backend but is **not exposed in the UI** — there
is no label, filter or badge for it.

---

## Translations (i18n keys)

Translation keys for both dimensions live in
[`src/i18n/translations/fr.json`](../src/i18n/translations/fr.json),
`en.json` and `cat.json`, under the `members` namespace.

### Type labels

| Code value | Key             | French (`fr.json`) |
|------------|-----------------|--------------------|
| `admin`    | `adminType`     | "Administrateur"   |
| `member`   | `memberType` / `memberTypePlural` | "Membre régulier" / "Membres réguliers" |
| `canalla`  | `canallaType`   | "Canalla"          |
| `guest`    | `guestType` / `guestTypePlural` | "Invité" / "Invités" |

The display in tables uses the template
`$t('members.' + props.row.type + 'Type')` — see
[`src/views/Members-View.vue:70`](../src/views/Members-View.vue).

### Status labels

| Code value | Key                | French (`fr.json`) |
|------------|--------------------|--------------------|
| `created`  | `createdStatus` / `createdStatusPlural` | "Créé" / "Créés"   |
| `active`   | `activeStatus` / `activeStatusPlural`   | "Actif" / "Actifs" |
| `paused`   | `pausedStatus` / `pausedStatusPlural`   | "En pause" / "En pause" |
| `deleted`  | `deletedStatus`    | (rendered as red tag)             |
| `purged`   | n/a                | not exposed                       |

Displayed via `$t('members.' + props.row.status + 'Status')` in
[`src/views/Members-View.vue:88`](../src/views/Members-View.vue).

---

## Visual mapping (Bulma / Oruga variants)

Status badges are rendered as Bulma `tag` classes in
[`src/views/Members-View.vue:80-89`](../src/views/Members-View.vue) and
[`src/components/EditProfileForm-Component.vue:251-260`](../src/components/EditProfileForm-Component.vue):

| Status    | Bulma class    | Visual meaning |
|-----------|----------------|----------------|
| `active`  | `is-success`   | green   |
| `created` | `is-info`      | blue    |
| `paused`  | `is-warning`   | yellow  |
| `deleted` | `is-danger`    | red     |

Filter checkboxes in
[`src/components/MemberFilter-Component.vue`](../src/components/MemberFilter-Component.vue)
use the same variant scheme:

| Filter checkbox    | Variant     |
|--------------------|-------------|
| Types: regulars (`admin,member,canalla`) | `success` |
| Types: guests (`guest`)                  | `warning` |
| Status: `active`                         | `success` |
| Status: `created`                        | `info`    |
| Status: `paused`                         | `warning` |

Note: `deleted` and `purged` are **not** offered as filter checkboxes —
they are only displayed if returned by the API for an already-edited
profile.

Profile editor type radios
([`src/components/EditProfileForm-Component.vue:27-71`](../src/components/EditProfileForm-Component.vue))
expose all four types as admin-only choices:

| Type     | Variant   |
|----------|-----------|
| `guest`  | `warning` |
| `canalla`| `info`    |
| `member` | `primary` |
| `admin`  | `success` |

These radios are disabled for non-admin users (`:disabled="type === 'admin' ? false : true"`).

---

## Type-driven UI behaviour

Authenticated user's type comes from the JWT token via the getter
`type` in [`src/store/modules/auth.js`](../src/store/modules/auth.js):

```js
type: (state, getters) => {
  if (getters.permissions.includes("admin")) return "admin";
  else if (getters.permissions.includes("member")) return "member";
  else return null;
}
```

Note that the UI only ever sees `admin` or `member` for the **logged-in
user** — `guest` and `canalla` users cannot log in, so the getter
returns `null` for them in practice.

Behaviours gated on `type === 'admin'`:

- Admin menu items
  ([`src/layout/Banner-Layout.vue:47-71`](../src/layout/Banner-Layout.vue),
  [`src/components/Menu-Component.vue:20,45`](../src/components/Menu-Component.vue)).
- Event creation, deletion and edition flows
  ([`src/views/Events-View.vue:5,17`](../src/views/Events-View.vue),
  [`src/views/EventShow-View.vue:3`](../src/views/EventShow-View.vue),
  [`src/components/EventEdit-Component.vue:268,608,934`](../src/components/EventEdit-Component.vue),
  [`src/components/Event-Component.vue:8-69`](../src/components/Event-Component.vue)).
- Loading per-event participation
  ([`src/components/EventEdit-Component.vue:608`](../src/components/EventEdit-Component.vue)).
- Editing the type, role, extra and subscription of another member
  ([`src/components/EditProfileForm-Component.vue:232-304`](../src/components/EditProfileForm-Component.vue)).

Behaviours gated on member **row** type (i.e. the member being viewed/edited):

- Email field hidden for guests and canallas:

```js
v-if="current_user.type !== 'guest' && current_user.type !== 'canalla'"
```

  ([`src/components/EditProfileForm-Component.vue:105,146`](../src/components/EditProfileForm-Component.vue)).

The `Initialize-View.vue` page (first-run admin creation) hard-codes
`type: "admin"`
([`src/views/Initialize-View.vue:21`](../src/views/Initialize-View.vue)).

The `MemberEdit-View.vue` defaults a new member to `type: "member"`
([`src/views/MemberEdit-View.vue:65`](../src/views/MemberEdit-View.vue)).

---

## Status-driven UI behaviour

The UI very rarely branches on `status` directly; the main use is **filtering
which members to fetch**. Each view that calls `getMembers` passes a list of
statuses and types as the filter:

| View / component                                       | Default `memberTypes`                 | Default `memberStatuses`                              |
|--------------------------------------------------------|---------------------------------------|--------------------------------------------------------|
| `Members-View.vue:123-124`                             | `["admin,member,canalla"]`            | `["active"]`                                           |
| `SummaryParticipation-View.vue:68-69`                  | `["admin,member,canalla"]`            | `["active"]`                                           |
| `EventEdit-Component.vue:579-580`                      | `["admin,member,canalla", "guest"]`   | `["active"]`                                           |
| `CastellsDrawing-Component.vue:150-151` (filter)       | `["admin,member,canalla", "guest"]`   | `["active"]`                                           |
| `CastellsDrawing-Component.vue:168-169` (`getAllMembers`)| `["admin", "member", "guest"]`      | `["created", "active", "paused", "deleted"]`           |

The user can then expand the visible statuses/types via the filter checkboxes
of `MemberFilter-Component.vue`.

Admins can also **change** a member's activity status from the profile editor
([`src/components/EditProfileForm-Component.vue`](../src/components/EditProfileForm-Component.vue)):
next to the status tag, a "Pause" button (when `active`) or "Reactivate" button
(when `paused`) calls the `members/setMemberStatus` action, which issues
`PUT /members/{uuid}/status`. Only `active` <-> `paused` toggling is exposed.

The only place where the UI branches on a member's `status` value (besides
rendering the colored tag) is in
[`src/components/EventEdit-Component.vue:763-772`](../src/components/EventEdit-Component.vue),
where the reminder targeting uses the same active/paused logic as the
backend:

```js
m.status === "active" && ...           // line 763
(m.status === "active" || m.status === "paused") && ...   // line 772
```

---

## API I/O

- The store action
  [`getMembers({ type, status })`](../src/store/modules/members.js)
  forwards both filters as comma-separated lists to
  `GET /members?type=…&status=…`. The backend whitelists each value
  individually (see `controller/members.go` in the backend repo).
- Editing the `type` of an existing member is only possible from the
  admin profile editor and is enforced by the backend (a regular member
  cannot be demoted to guest).
- `setMemberStatus(uuid, status)` issues `PUT /members/${uuid}/status`
  with `{ status }`; the backend restricts it to admins and to the
  `active`/`paused` values.
- `deleteMember` (in
  [`src/mixins/members.js`](../src/mixins/members.js)) performs a soft
  delete server-side — the member ends up with `status === 'deleted'`.

---

## Cheat-sheet: what color means what

```
 type filter:                   status badge:
   regulars  → green tag          active   → green
   guests    → yellow tag         created  → blue
                                  paused   → yellow
                                  deleted  → red
                                  purged   → (not shown)
```
