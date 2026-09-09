# PRD — FASOP Monitoring System

## 1. Product Overview

Build a premium, professional, modern web application called **FASOP Monitoring System** for PLN UP2B Ungaran.

The application is an authenticated monitoring and data-management system connected to PostgreSQL, with existing backend/API infrastructure and planned integration with Zabbix and Grafana.

The main product goal is **not** to look like a generic CRUD/database admin panel. It should feel like a serious enterprise monitoring product: clean, calm, precise, polished, trustworthy, and expensive-looking.

The user interface must prioritize:

- clarity over decoration
- information hierarchy over dense tables
- readable labels instead of technical database IDs where possible
- fast scanning for operational users
- obvious primary actions
- consistent interaction patterns
- subtle, purposeful motion
- responsive desktop-first behavior with good tablet/mobile fallback

Do not copy Antigravity or any other website literally. Use the idea of premium visual quality, cinematic transitions, polished micro-interactions, depth, and refined typography, but create an original PLN/FASOP visual identity.

---

## 2. Core UX Principle

The application has two different worlds and they must remain visually distinct.

### A. Database Explorer

This is the technical/raw database interface.

It exists for developers/admin users who need to inspect PostgreSQL tables, schema, data, pagination, and technical fields.

Example:

```text
Database
  └── SKEMA
       id_skema | skema | id_ss | aktif
```

Keep this technical view available. Do not turn it into the primary business UI.

### B. Business Modules

Business-facing pages such as **Skema**, **Device**, and **User Management** must hide unnecessary technical complexity.

Example:

```text
Database value:
id_ss = 4

Business UI:
Subsistem = Pedan 3,4
```

When the user selects `Pedan 3,4`, the application internally stores/submits the appropriate ID.

Users should not be forced to memorize or type technical IDs.

---

# 3. Visual Direction

## 3.1 Overall Style

Create a premium enterprise dashboard with a refined PLN-inspired identity.

Visual keywords:

- premium
- professional
- intelligent
- calm
- modern
- technical
- operational
- trustworthy
- elegant
- subtle cinematic feel

Avoid:

- cheap-looking gradients everywhere
- excessive rounded cards
- oversized emoji as UI icons
- childish colors
- noisy shadows
- excessive animations
- excessive glassmorphism
- excessive neon/cyberpunk effects
- visual clutter
- generic template/dashboard appearance

Use visual restraint.

---

## 3.2 Color System

Primary identity:

- PLN-inspired deep blue / royal blue
- clean white
- neutral slate / charcoal
- restrained PLN yellow as accent
- green for healthy/active states
- red for destructive/error states
- amber for warning states

Do not use many competing colors.

Recommended visual proportions:

- 70–80% neutral/white/very-light surfaces
- 10–20% blue identity elements
- 5–10% accent/status colors

Blue should communicate navigation and primary action.
Yellow should be used sparingly for emphasis and PLN identity.

---

## 3.3 Typography

Use a modern, highly readable sans-serif font.

Prioritize:

- clear numeral rendering
- strong table readability
- comfortable line height
- clear distinction between heading/body/metadata

Typography hierarchy:

- page title: strong and confident
- section title: medium/semibold
- body: highly readable
- metadata: small and muted
- status labels: semibold

Avoid overly futuristic or decorative fonts.

---

## 3.4 Surfaces and Depth

Use:

- subtle borders
- soft shadows
- layered panels
- carefully controlled elevation
- occasional translucent/blurred decorative layers

Cards should not all have the exact same shadow.

Use depth intentionally:

- navigation layer
- header layer
- content layer
- modal layer
- floating command/feedback layer

---

# 4. Motion Design

Motion is important, but it must feel premium and purposeful.

Use animation for:

- page entrance
- navigation transitions
- modal open/close
- dropdown appearance
- table row hover
- loading states
- successful actions
- route transitions
- login → dashboard transition

Motion style:

- smooth
- short
- subtle
- ease-out
- non-distracting

Never animate every component simultaneously.

Respect `prefers-reduced-motion`.

---

# 5. Login Experience

The login screen is the first impression and must receive the highest visual attention.

## Layout

Desktop:

Split-screen composition.

Left:

- PLN/FASOP logo
- FASOP title
- Monitoring System subtitle
- username input
- password input
- primary login button
- validation/error feedback

Right:

A premium monitoring visual area representing electrical/grid operations.

Do not use a random stock illustration.

Use an abstract, original operational visual treatment:

- subtle grid/network lines
- faint electrical flow motif
- animated light paths
- understated data points
- soft blue/yellow ambient lighting
- minimal geometric depth

The visual should support the product identity without distracting from the form.

## Login Form Behavior

Inputs must have:

- clear labels/placeholders
- strong focus states
- accessible contrast
- disabled state while submitting

Login button states:

Normal:
`Log in`

Loading:

`Authenticating...`

The loading state should visually communicate progress without looking like a generic spinner.

## Successful Login Transition

Do not instantly jump from login to dashboard with no feedback.

After valid authentication:

1. Disable form.
2. Show a premium authentication/loading state.
3. Briefly transition the visual layer.
4. Show a subtle success indicator.
5. Transition into dashboard.

The transition should feel like the application is establishing an authenticated monitoring session.

Example concept:

```text
FASOP

Authenticating session...

[ subtle progress / moving line ]

Secure session established
```

Keep the transition short and professional.

---

# 6. Application Shell

After login, use a persistent application shell.

Structure:

```text
┌────────────────────────────────────────────────────┐
│ Navbar                                             │
├───────────────┬────────────────────────────────────┤
│ Sidebar       │ Main content                       │
│               │                                    │
│ Dashboard     │                                    │
│ Database      │                                    │
│ Skema         │                                    │
│ Grafana       │                                    │
│ Profile       │                                    │
│ Users*        │                                    │
│               │                                    │
│ Logout        │                                    │
└───────────────┴────────────────────────────────────┘
```

`Users` should be visible only to authorized admins if role-aware navigation is implemented.

---

# 7. Sidebar

Current navigation concepts:

- Dashboard
- Database
- Skema
- Grafana
- Profile
- Users
- Logout

Design requirements:

- persistent but not bulky
- clear active state
- elegant hover state
- icon + label
- strong visual hierarchy
- subtle animated active indicator
- collapse behavior can be added later

Active item should feel selected, not aggressive.

Suggested treatment:

- dark/deep blue navigation surface
- selected item on lighter surface or elevated pill
- subtle indicator line or glow
- smooth hover motion

Do not overuse bright blue backgrounds for every interaction.

---

# 8. Navbar

Current navbar information:

- PLN UP2B Ungaran
- FASOP Monitoring System
- logged-in user name
- role

Make the navbar feel like an enterprise product header.

Include:

- system title
- optional environment/system status indicator
- user identity
- avatar/icon
- role

User section should feel refined and compact.

Avoid making the navbar overly tall.

---

# 9. Dashboard

Dashboard should be the main operational landing page after login.

Current information:

- Total Tabel
- Total Admin
- Database status
- Role Anda
- Database status panel
- Informasi Sistem
- Quick Access

Improve this into a premium monitoring dashboard.

## Hero Header

Example:

```text
Selamat datang, Administrator

FASOP Monitoring System
PLN UP2B Ungaran

Database operational status and system overview
```

Use a subtle ambient background pattern, not a giant illustration.

## Summary Cards

Cards:

- Total Tabel
- Total User/Admin
- Database Status
- Role

Each card should contain:

- small label
- primary value
- supporting metadata
- small icon/status marker
- optional trend/health indicator later

Use refined cards, not overly rounded generic template cards.

## Database Status

Show:

- Connected / Disconnected
- PostgreSQL
- visual health indicator

Connected state should be visually reassuring, but subtle.

## System Information

Show:

- Username
- Nama Lengkap
- Role

Use a clean definition-list style.

## Quick Access

Promote:

- Database Explorer
- Skema
- Grafana

Use refined action cards/buttons instead of basic HTML-looking buttons.

---

# 10. Database Explorer

Database Explorer is a technical interface and should remain recognizable as such.

Current behavior:

- fetch table list
- select table
- fetch schema
- fetch data
- pagination
- search
- insert/update/delete through generic database APIs

The UI should be upgraded visually while maintaining its technical purpose.

## Layout

Desktop:

```text
┌──────────────────────────────────────────────────────┐
│ Database Explorer                                    │
│ Search tables...                                     │
├───────────────┬──────────────────────────────────────┤
│ Tables        │ Selected table                        │
│               │                                      │
│ SKEMA         │ table name                           │
│ DEVICE...     │ search data                          │
│ users         │ schema summary                       │
│ ...           │ data table                           │
│               │ pagination                           │
└───────────────┴──────────────────────────────────────┘
```

Use a sticky table list on desktop if practical.

## Technical Metadata

For schema columns show:

- column name
- data type
- primary key indicator
- identity/generated indicator
- default

Identity-generated columns must be visually understood as system-generated.

For example:

```text
id_skema   integer   PRIMARY KEY   SYSTEM GENERATED
```

Users should not manually enter an identity ID.

---

# 11. Skema Module

This is a major business module and must not feel like a generic database table.

## Main concept

`Skema` is a business module that internally uses:

- SKEMA
- SKEMA_MT
- SKEMA_RELE
- Skema_RTAC
- subsistem
- DEVICE_PROSIS for enrichment/reference

The user should experience these as one coherent module.

Navigation:

```text
Skema
├── Informasi
├── MT
├── RELE
└── RTAC
```

Do not expose PostgreSQL table names as the main user experience.

---

## 11.1 Skema List

Display:

- ID Skema
- Nama Skema
- Subsistem (human-readable)
- Status
- Actions

Search should support:

- ID
- nama skema
- subsistem

Status should use clear visual chips.

Example:

```text
ID 33
OLS SUTT WONOSARI - PEDAN 1,2
Subsistem: Pedan 3,4
Status: Aktif
```

---

## 11.2 Add/Edit Skema

Form:

```text
Nama Skema
[........................................]

Subsistem
[ 🔍 Cari dan pilih subsistem            ]

Status
[ Aktif ▼ ]

[ Batal ] [ Simpan ]
```

Critical rule:

The user selects the **name**, not `id_ss`.

Example:

```text
User selects:
Pedan 3,4

System internally submits:
id_ss = 4
```

Do not show the technical ID as the primary selection field.

The generated `id_skema` must remain system-controlled.

---

# 12. MT Detail

MT must be editable.

Do not show only:

```text
no | id_skema | jenis
```

Instead enrich the business view with context.

Display:

- No
- GI
- Tag Name
- Jenis
- Keterangan
- Merek
- Tipe
- Actions

The skema context should be visible above the table:

```text
Skema #33
OLS SUTT WONOSARI - PEDAN 1,2
Subsistem: Pedan 3,4
```

## Add/Edit MT

Use a searchable device selector sourced from `DEVICE_PROSIS`.

Do not ask user to type raw device `no` when selecting an existing device.

Search fields should support:

- No
- Tag Name
- GI
- Jenis
- Keterangan
- Merek
- Tipe

Show a rich result row like:

```text
#24 · GI BANTUL
TAG_NAME_...
MT BANTUL · SEL · 2440
```

After selection show a preview:

```text
No
24

GI
BANTUL

Tag Name
...

Jenis
MT

Keterangan
...

Merek / Tipe
SEL / 2440
```

The system stores the underlying `no` reference.

---

# 13. RELE Detail

RELE must also be editable.

Display:

- No
- GI
- Tag Name
- Jenis
- Keterangan
- Merek
- Tipe
- Actions

Although the underlying `SKEMA_RELE` table is minimal, the frontend must provide enough context to avoid user confusion.

Use the same searchable `DEVICE_PROSIS` picker pattern as MT.

This ensures a consistent mental model:

```text
Search device → select device → review device info → save
```

---

# 14. RTAC Detail

RTAC must support:

- add
- edit
- delete
- view

Display:

- Tag Name
- Gardu Induk
- Bay Target
- Skema
- Tahap
- Actions

The selected Skema should be visible and read-only when editing from a selected parent Skema.

Do not make users manually choose a different parent if they are already inside a Skema detail page.

RTAC should have a compact but powerful table layout because the data is technical.

---

# 15. Searchable Dropdown / Combobox Standard

This is a core reusable component for the application.

Every large option list should use the same component.

Required behavior:

- type to search
- keyboard navigation
- mouse selection
- clear selection
- loading state
- empty state
- highlighted result
- selected state
- accessible focus
- closes when clicking outside

Example:

```text
Subsistem
┌─────────────────────────────────┐
│ 🔍 ketik nama...                │
├─────────────────────────────────┤
│ Ungaran 1,2                     │
│ Tanjung Jati 1,2               │
│ Pedan 1,2                       │
│ Pedan 3,4                       │
└─────────────────────────────────┘
```

Use the same interaction model for:

- Subsistem
- Device
- GI
- Jenis
- Skema
- future master data

---

# 16. DEVICE_PROSIS Module

This is the next major business-facing module after Skema.

Do not display it as an unintuitive raw CRUD table only.

Fields include concepts such as:

- No
- Tag Name
- GI
- Jenis
- Keterangan
- Merek
- Tipe

The business UI should use:

- GI → searchable selection
- Jenis → searchable selection
- Skema → searchable selection where applicable
- Merek → text input
- Tipe → text input
- Keterangan → text input

The UI should minimize free typing for values that can safely be selected from established reference data.

---

# 17. User Management

Current functionality:

- list users
- search
- add user
- delete user
- role display
- user statistics

Upgrade the design to premium enterprise UX.

Stats:

- Total User
- Administrator
- Operator

User table:

- index
- user identity
- full name
- role
- created date
- actions

Role indicators:

- Admin → blue/strong identity
- Operator → green/operational identity

Add User modal should include proper fields:

- username
- nama lengkap
- password
- role

Do not make add-user functionality only local-state. It must use the actual API.

Destructive delete action must require confirmation.

Do not allow an admin to casually delete the account currently in use.

---

# 18. Profile

Profile should feel like a secure account center, not a simple form.

Sections:

### Account Information

- Username
- Nama Lengkap
- Role

### Change Password

- Current password
- New password
- Confirm new password

States:

- idle
- submitting
- success
- error

Password requirements should be visible without overwhelming the user.

Success feedback should be elegant and clear.

---

# 19. Grafana

Current state is a placeholder page.

Keep the initial page polished even before full embedding/integration.

Design concept:

```text
Grafana
Monitoring dashboard & operational visualization

[ Open Grafana ]

Status / connection area
```

Future-ready for:

- embedded dashboard
- external Grafana link
- connection status
- selected dashboard cards

Do not fill the page with fake data.

---

# 20. Loading System

Create a coherent loading system across the entire application.

Avoid random "Loading..." text wherever possible.

Use:

- skeleton cards
- skeleton tables
- subtle shimmer
- compact spinners where appropriate
- progressive content loading

Loading should preserve layout to prevent layout jumps.

Login uses a special authentication transition.

---

# 21. Empty States

Every data module needs a polished empty state.

Examples:

```text
No data yet
Belum ada skema untuk ditampilkan.

[ Tambah Skema ]
```

Search empty state:

```text
Tidak ditemukan
Coba gunakan kata kunci lain.
```

Never show a large blank white area with only "Tidak ada data."

---

# 22. Error Handling

Errors must be human-readable.

Do not expose raw database errors unless the user is in a technical Database Explorer context.

For business modules:

Bad:

```text
duplicate key value violates unique constraint
```

Better:

```text
Data dengan identitas tersebut sudah terdaftar.
```

Error banners should:

- be clearly visible
- explain the problem
- remain concise
- offer a clear next action if relevant

---

# 23. Toast / Feedback System

Create a reusable feedback system.

Types:

- success
- error
- warning
- info

Use it for:

- save success
- update success
- delete success
- login errors
- API errors
- permission errors

Prefer elegant toast/alert components over excessive browser `alert()` calls.

Destructive actions may still use a custom confirmation dialog instead of browser `confirm()`.

---

# 24. Modal / Dialog Design

All dialogs must follow one design system.

Properties:

- centered
- layered backdrop
- subtle blur if appropriate
- smooth entrance
- consistent spacing
- clear header
- close button
- footer actions

Primary action:

- blue

Secondary:

- neutral

Danger:

- red

Do not use browser-native `alert()` for normal product feedback in the final UI.

---

# 25. Table Design System

Tables are important but must remain readable.

Rules:

- avoid excessive borders
- use subtle row separators
- sticky header for long tables
- zebra striping only when helpful
- hover highlight
- consistent cell padding
- truncate long text intelligently
- provide tooltip/details for very long values
- action buttons grouped consistently

For technical tables, use monospaced text selectively for:

- Tag Name
- technical identifiers
- raw database values

Do not make the entire interface monospace.

---

# 26. Responsive Behavior

Desktop is the primary environment, but pages must gracefully adapt.

Desktop:

- persistent sidebar
- wide tables
- detail panels

Tablet:

- narrower sidebar
- collapsible detail areas
- horizontal table scrolling

Mobile:

- collapsible navigation
- stacked cards
- table transformed to cards where practical
- horizontally scrollable technical tables as fallback

Never allow critical buttons to become unreachable.

---

# 27. Accessibility

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient color contrast
- accessible labels
- aria attributes where necessary
- dialog focus management
- escape-to-close dialogs/dropdowns
- reduced-motion support

Do not communicate status only through color.

---

# 28. Security UX

Frontend must cooperate with backend security.

Requirements:

- protected routes
- authenticated API requests
- automatic handling of expired/invalid tokens
- logout clears session information
- admin-only UI actions hidden or disabled for operators
- never display passwords
- never persist passwords in localStorage

Do not rely only on hiding buttons for authorization; backend enforcement remains authoritative.

---

# 29. Authentication State

Use the current token and user model.

Current local storage concepts:

```text
localStorage.token
localStorage.user
```

Keep route protection through `ProtectedRoute`.

When token is invalid/expired:

1. clear auth state
2. optionally show a brief session-expired notification
3. redirect to login

Do not create infinite redirect loops.

---

# 30. API Integration

Keep the existing Axios abstraction.

The frontend should use one centralized API client.

The API client should handle:

- base URL
- JSON headers
- Authorization Bearer token
- response errors
- token/session failure

Do not create separate Axios instances for individual pages unless there is a strong reason.

---

# 31. Route Map

Expected frontend routes:

```text
/login
/dashboard
/database
/skema
/grafana
/profile
/users
```

Protected routes:

```text
/dashboard
/database
/skema
/grafana
/profile
/users
```

Login:

```text
/login
```

Unknown routes should redirect cleanly to login or an appropriate protected default.

---

# 32. Premium Micro-Interactions

Use subtle interactions such as:

- page content fades upward on entry
- cards elevate slightly on hover
- selected navigation item moves smoothly
- buttons have a refined pressed state
- dropdowns ease into view
- success state briefly highlights a changed row
- delete actions visibly transition into confirmation
- login transition uses a smooth visual handoff

Avoid:

- bouncing buttons
- excessive parallax
- cursor gimmicks
- constant pulsing
- distracting looping animations

---

# 33. Premium Login → Dashboard Transition

This deserves special attention.

Flow:

```text
Login form
   ↓
Submit
   ↓
Authenticating...
   ↓
Secure session established
   ↓
Short cinematic transition
   ↓
Dashboard appears
```

Visual concept:

- background network subtly comes alive
- a light/progress path moves across the interface
- login content gently fades
- dashboard shell fades/slides into place
- avoid long loading screens

The result should feel polished and intentional.

---

# 34. Component Architecture

Build reusable components instead of page-specific duplicates.

Suggested component system:

```text
components/
├── AppShell
├── Sidebar
├── Navbar
├── PageHeader
├── Card
├── StatCard
├── Button
├── IconButton
├── Badge
├── DataTable
├── SearchInput
├── SearchableSelect
├── Modal
├── ConfirmDialog
├── Toast
├── EmptyState
├── LoadingState
├── Skeleton
├── StatusIndicator
└── UserAvatar
```

For Skema:

```text
components/skema/
├── SkemaList
├── SkemaDetail
├── SkemaForm
├── SkemaTabs
├── MTTable
├── MTForm
├── ReleTable
├── ReleForm
├── RtacTable
├── RtacForm
└── DevicePicker
```

Do not force every component into one file.

---

# 35. State Management

Keep state local where practical.

Use shared state only for:

- authentication
- user session
- global toast/feedback
- application shell state

Avoid unnecessary global state complexity.

---

# 36. Data Semantics

Frontend must distinguish between:

### Human-readable business value

Example:

```text
Pedan 3,4
```

### Technical stored value

Example:

```text
id_ss = 4
```

The business UI should prioritize the human-readable value.

Do not invent labels that are not backed by actual data.

---

# 37. Zabbix Consistency

The future UI must maintain naming consistency with monitoring/Zabbix data.

Do not create arbitrary alternative names for monitored entities.

Reference/master data should be designed so that:

```text
Database reference
        ↓
Application label
        ↓
Monitoring identifier
```

remain consistent.

Where a technical value is required for monitoring integration, keep it internally while presenting a friendly business label to the user.

---

# 38. Do Not Turn the Product Into a Generic CRUD Template

This is a critical instruction.

Avoid building:

```text
Table
[Add] [Edit] [Delete]
```

for every database table.

Instead create meaningful modules:

```text
Dashboard
Database Explorer
Skema
Device
User Management
Grafana
Profile
```

Each module should have its own information architecture and user purpose.

---

# 39. Quality Bar

The final application should feel comparable to a polished enterprise SaaS product.

The user should immediately perceive:

- this system is intentional
- this system is reliable
- information is organized
- the UI is not cheap
- the system was built specifically for operations

The application should be appropriate for demonstration to:

- mentors
- PLN technical staff
- managers
- internal reviewers

---

# 40. Implementation Priority

Implement in this order:

## Phase 1 — Premium foundation

1. Design tokens
2. App shell
3. Sidebar
4. Navbar
5. buttons/inputs/badges
6. modals
7. toast system
8. loading/skeleton system
9. page transitions

## Phase 2 — Login

1. premium login
2. validation
3. loading state
4. authentication transition
5. redirect to dashboard

## Phase 3 — Dashboard

1. hero/header
2. statistic cards
3. database health
4. user/system info
5. quick access

## Phase 4 — Database Explorer

1. modernize table explorer
2. schema metadata
3. raw data table
4. search/pagination
5. identity/generated field handling

## Phase 5 — Skema

1. Skema list
2. searchable subsistem picker
3. Skema add/edit/delete
4. detail drawer/panel
5. MT CRUD
6. RELE CRUD
7. RTAC CRUD
8. device picker and enriched context

## Phase 6 — Device

1. Device list
2. GI searchable picker
3. Jenis searchable picker
4. Skema searchable picker
5. Keterangan
6. Merek
7. Tipe

## Phase 7 — User / Profile / Grafana

Refine all pages into the same design system.

## Phase 8 — Security + Reliability UX

1. token expiry handling
2. session expiry feedback
3. permission states
4. validation
5. consistent errors
6. confirmations

## Phase 9 — Final polish

1. transitions
2. responsive pass
3. accessibility pass
4. loading pass
5. empty/error states
6. spacing/typography pass
7. visual consistency pass

---

# 41. Definition of Done

The frontend is considered complete when:

- login looks premium and has a polished authentication transition
- all protected pages use one consistent application shell
- Dashboard feels like a real monitoring product
- Database Explorer remains technical but polished
- Skema behaves as a business module rather than a raw database table
- MT, RELE, and RTAC have proper CRUD and meaningful context
- IDs are hidden when they are technical implementation details
- searchable selectors are used for large reference lists
- Device information can be recognized quickly by users
- Admin/operator UX differs appropriately
- dialogs, alerts, errors, loading, and empty states are consistent
- API integration remains centralized
- expired sessions are handled cleanly
- no page looks like a generic starter template
- animations are polished but restrained
- the design remains usable and professional without animation
- the system feels cohesive from login through every major page

---

# 42. Final Design Instruction to Antigravity

Treat this document as a **product design and UX direction**, not merely a styling checklist.

Before changing a page, understand its purpose, data hierarchy, and target user.

Prefer:

```text
clarity + hierarchy + polish + restraint
```

over:

```text
decoration + gimmicks + excessive motion
```

Build a cohesive original visual language for FASOP Monitoring System.

The result should feel like a premium enterprise monitoring platform designed specifically for PLN UP2B Ungaran: technically credible, operationally useful, human-readable, elegant, and significantly more polished than a typical internship CRUD application.

Do not copy another website pixel-for-pixel. Do not use fake data to make the UI look richer. Use the real existing data structures and API contracts where available, and clearly separate technical database presentation from business-facing workflows.

# 43. Mentor Revision — Monitoring & Alert Requirements

## 43.1 SKEMA_RELE CRUD

SKEMA_RELE must support:
- add
- edit
- delete
- view

Because SKEMA_RELE may not have a single primary key, row operations must use the
combination of `id_skema + no` where applicable.

Do not assume the table must be altered to add a new primary key unless required
after database inspection.

## 43.2 Monitoring Readiness Status

The application must support operational readiness states:

- READY
- WARNING
- ALERT

Each status must have:
- clear visual representation
- consistent color semantics
- human-readable explanation

The status logic must be based on the real PostgreSQL monitoring data source.
Do not hardcode or fabricate status values.

## 43.3 Active Alerts

The monitoring interface must provide an Active Alerts section.

Users should be able to:
- view active alerts
- clear one alert
- clear all active alerts

"Clear Alert" must not delete master/reference data such as SKEMA, SKEMA_RELE,
DEVICE_PROSIS, etc.

Clear means resolving/removing the active alert state from the underlying
monitoring source.

## 43.4 Grafana Synchronization

Grafana and the FASOP web application use PostgreSQL as the monitoring source.

The application must use the same underlying source of truth as Grafana.

When an alert is cleared from the web application, the corresponding PostgreSQL
state must change so that Grafana reflects the updated state after its datasource
refresh.

Do not create an independent frontend-only alert dataset.

Before implementing alert clear logic, inspect the existing PostgreSQL table/view
and Grafana query that produce the monitoring status.

If the source structure is unknown, do not invent it.

## Mentor Revision — Monitoring & Alert Requirements

Include these requirements:

1. SKEMA_RELE must support:
- Add
- Edit
- Delete
- View

Because SKEMA_RELE may not have a single primary key, edit/delete should use the real row identity such as `id_skema + no` where applicable.
Do not add a new primary key to the database unless later inspection proves it is necessary.

2. Monitoring readiness must support:
- READY
- WARNING
- ALERT

Each status must have a clear visual representation and a human-readable explanation.

3. Active Alerts must support:
- viewing active alerts
- clearing a single alert
- clearing all active alerts

"Clear Alert" must NOT delete master data such as SKEMA, SKEMA_RELE, DEVICE_PROSIS, etc.

4. Grafana synchronization:
- Website and Grafana use PostgreSQL as the underlying monitoring source.
- Clearing an alert from the website must eventually update the same PostgreSQL source used by Grafana.
- Grafana should reflect the cleared state after datasource refresh.
- Do not create a separate frontend-only alert dataset.

5. IMPORTANT:
Do not invent the alert table, columns, status logic, or Grafana query.
Those must be determined from the existing PostgreSQL/Grafana implementation later.