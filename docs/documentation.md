# Spokes Job and Event Boards Documentation

This document is the current developer and maintainer reference for the Spokes web application. For a non-technical owner handoff guide, see [owner-user-guide.md](owner-user-guide.md).

The application is a Next.js app with two public boards:

- Jobs at `/jobs`
- Events at `/events`

Authenticated nonprofit users can submit and manage their own listings. Spokes admins can approve or reject submissions, manage users, and delete users or organizations.

## Tech Stack

- Framework: Next.js App Router
- UI: React, Tailwind CSS, Chakra UI
- Authentication: Clerk
- Database: MongoDB through Mongoose
- Email: Resend
- Tests: Jest
- Package scripts: `npm run lint`, `npm test`, `npm run build`

## Important Directories

- `src/app`: Next.js routes and API route handlers
- `src/components/jobs`: Job board, job form, job cards, and job admin UI
- `src/components/events`: Event board, event form, event cards, and event admin UI
- `src/components/users`: Admin user-management UI
- `src/components/Onboarding`: First-time profile setup
- `src/database`: Mongoose schemas and database connection
- `src/lib`: Shared auth, validation, links, organization, URL, and formatting helpers
- `src/types`: Shared TypeScript types
- `docs/owner-user-guide.md`: Non-technical owner guide

## Current Routes

### Public and User-Facing Pages

- `/jobs`: public job board
- `/events`: public event board
- `/jobs/list`: create or edit a job
- `/events/list`: create or edit an event
- `/jobs/manage`: nonprofit job dashboard
- `/events/manage`: nonprofit event dashboard
- `/events/[eventId]`: public event detail page
- `/onboarding`: first-time user profile setup
- `/sign-in`, `/sign-up`, `/jobsLogin`, `/eventsLogin`: Clerk sign-in/sign-up flows

### Admin Pages

- `/jobs/admin`: admin job review dashboard
- `/events/admin`: admin event review dashboard
- `/jobs/users`: admin user-management page, with a back link to jobs admin
- `/events/users`: admin user-management page, with a back link to events admin
- `/admin/users`: standalone admin user page

### Not Found Page

`src/app/not-found.tsx` renders the 404 page. It is intentionally board-neutral and offers links to both `/jobs` and `/events`. While the 404 page is mounted, the global navbar hides board-specific navigation and login/user controls.

## Authentication and Roles

Auth helpers live in `src/lib/auth.ts`.

Roles are derived from Clerk auth state:

- `job_seeker`: unauthenticated visitor
- `nonprofit`: authenticated user not in the Spokes admin organization
- `spokes_admin`: authenticated user whose Clerk organization slug is `spokes-admin`

Most API routes use `withApiAuth`, which accepts:

- `requireAuth: true | false`
- `allowedRoles: [...]`

Admin-only UI pages also check the role server-side before rendering.

### Middleware Note

`src/middleware.ts` handles onboarding redirects and some route protection. It still contains legacy route matcher names such as `jobsDashboard` and `eventsDashboard`. The current application routes live under `/jobs` and `/events`, so review middleware carefully before changing route protection or adding new protected sections.

## Onboarding

Files:

- `src/app/onboarding/page.tsx`
- `src/components/Onboarding/OnboardingForm.tsx`
- `src/app/api/users/route.ts`

First-time authenticated users must complete onboarding before normal app use. Onboarding collects:

- Organization name
- Paid member status

The "I am unsure if I am a paid member" option submits `paidMember: false`. Admins can later update the member status from the user-management page.

When onboarding succeeds:

- A MongoDB user record is created or updated.
- Clerk public metadata is updated with `onboardingComplete: true`.

## Data Models

### User

File: `src/database/userSchema.ts`

Fields include:

- `_id`: Clerk user ID
- `name`
- `email`
- `postedJobs`
- `postedEvents`
- `paidMember`
- `organizationName`

User records are the bridge between Clerk identity and MongoDB-owned app data.

### Job

File: `src/database/jobSchema.ts`

Core fields:

- `organizationName`
- `userId`
- `organizationIndustry`
- `title`
- `postDate`
- `modifiedDate`
- `approvedDate`
- `jobDescription`
- `employmentType`: `part-time`, `full-time`, or `volunteer`
- `compensationType`: `salary`, `hourly`, or `contract`
- `jobStatus`: `pending`, `approved`, `rejected`, or `expired`
- `detailURL`
- `applyNowURL`
- `rejectionMessage`
- `memberJob`

The `memberJob` field is copied from the user's `paidMember` status when a job is created. Updating a user's member status also updates that user's existing jobs.

### Event

File: `src/database/eventSchema.ts`

Core fields:

- `date`
- `eventName`
- `time`
- `location`
- `locationLink`
- `eventLocationGeneral`
- `eventLocationGeneralOther`
- `eventLocationCity`
- `eventLocationCityOther`
- `description`
- `majorFundraisingEvent`
- `eventLink`
- `organization`
- `publicContactEmail`
- `publicContactPhoneNumber`
- `submitterFirstName`
- `submitterLastName`
- `submitterEmail`
- `submitterPhoneNumber`
- `createdByUserId`
- `eventStatus`: `pending`, `approved`, `rejected`, or `expired`
- `approvedDate`
- `rejectionMessage`

Events do not have a location type. There is no remote/in-person field in the current schema, form, API validation, or display cards.

Event region and city options live in `src/lib/eventOptions.ts`.

## API Routes

### Jobs

`GET /api/jobs`

- Public.
- Supports filters for `employmentType`, `compensationType`, `organizationIndustry`, and `jobStatus`.
- Non-admin requests are paginated with `page` and `limit`.
- Admin requests use `admin=true` and return all matching records.
- Approved non-admin results include all approved jobs, regardless of approval date.
- Sorting prioritizes `memberJob` first, then approved date or post date.

`POST /api/jobs`

- Requires `nonprofit` or `spokes_admin`.
- Creates a pending job.
- Uses the authenticated user's organization unless the requester is a Spokes admin creating for another organization.
- Uses a unique job signature with user, organization, title, post date, and detail URL to avoid duplicate inserts.
- Adds the job ID to the user's `postedJobs`.

`GET /api/jobs/[jobId]`

- Public.
- Fetches one job by ID.

`PUT /api/jobs/[jobId]`

- Requires `nonprofit` or `spokes_admin`.
- Nonprofits can update only their own jobs.
- Nonprofit edits send the job back to `pending`.
- Supports renewal and resolve actions.
- Admin status changes can approve, reject, or resolve jobs.

`DELETE /api/jobs/[jobId]`

- Requires `nonprofit` or `spokes_admin`.
- Nonprofits can delete only their own jobs.
- Deletes the job document.

`POST /api/jobs/recent`

- Public.
- Accepts a list of job IDs from browser storage and returns matching jobs.

`GET /api/userjobs?userId=...`

- Requires `nonprofit` or `spokes_admin`.
- Nonprofits can fetch only their own jobs.
- Reads job IDs from the user's `postedJobs` list.

### Events

`GET /api/events`

- Public.
- Supports `eventStatus`.
- Non-admin requests default to approved events only.
- Admin requests use `admin=true`.
- Sorts approved events by approved date and other statuses by creation date.

`POST /api/events`

- Requires `nonprofit` or `spokes_admin`.
- Validates required event fields in `src/lib/events.ts`.
- Creates or updates a pending event using a unique event signature.
- Uses the authenticated user's organization unless the requester is a Spokes admin creating for another organization.
- Sends admin notification email from the client after successful creation.

`GET /api/events/[eventId]`

- Public.
- Fetches one event by ID.

`PUT /api/events/[eventId]`

- Requires `nonprofit` or `spokes_admin`.
- Nonprofits can update only their own pending events.
- Spokes admins can update event status to approved, rejected, pending, or expired.
- Rejected events store a rejection message.

`DELETE /api/events/[eventId]`

- Requires `nonprofit` or `spokes_admin`.
- Nonprofits can delete only their own events.
- Deletes the event document.
- There is currently no visible owner-facing delete button for a single event.

`GET /api/userevents?userId=...`

- Requires `nonprofit` or `spokes_admin`.
- Nonprofits can fetch only their own events.
- Queries by `createdByUserId`, which supports both legacy and current event records.

### Users

`GET /api/users`

- Requires `spokes_admin`.
- Returns all users for the admin user-management page.

`POST /api/users`

- Requires authentication.
- Creates or updates the authenticated user's MongoDB profile during onboarding.
- Resolves organization names case-insensitively against existing organizations.

`GET /api/users/[id]`

- Requires `nonprofit` or `spokes_admin`.
- Nonprofits can fetch only their own user record.

`PATCH /api/users/[id]`

- Requires `spokes_admin`.
- Supports `paidMember` and `organizationName` updates.
- Updating `paidMember` updates the user's jobs' `memberJob`.
- Updating `organizationName` updates the user's jobs and events to the canonical organization name.

`DELETE /api/users/[id]`

- Requires `spokes_admin`.
- Admins cannot delete their own user.
- Deletes the user plus their jobs and events.

### Organizations

`GET /api/organizations`

- Requires `nonprofit` or `spokes_admin`.
- Returns distinct organization names from users, jobs, and events.

`DELETE /api/organizations`

- Requires `spokes_admin`.
- Admins cannot delete their own organization.
- Deletes all users, jobs, and events matching the organization name.
- This is destructive and cannot be undone from the app.

Organization helpers live in `src/lib/organizations.ts`.

### Email

Email routes use Resend:

- `POST /api/send/new`: new job notification
- `POST /api/send/update`: updated job notification
- `POST /api/send/reject`: rejected job notification
- `POST /api/send/event-new`: new event notification
- `POST /api/send/event-reject`: rejected event notification

Templates live in `src/components/EmailTemplates`.

Admin links use `src/lib/url.ts`, which reads:

- `NEXT_PUBLIC_ADMIN_URL`
- `NEXT_PUBLIC_API_BASE_URL`

## UI Workflows

### Job Board

Files:

- `src/components/jobs/pages/JobsBoardPage.tsx`
- `src/components/jobs/JobCard`
- `src/components/jobs/JobGrid`
- `src/components/ui/FilterCard.tsx`

The public job board fetches approved jobs with pagination and filters. Recently viewed jobs are stored in browser storage and fetched through `/api/jobs/recent`.

### Job Form

Files:

- `src/components/jobs/pages/ListJobPage.tsx`
- `src/app/jobform/JobFormPage.client.tsx`

The job form supports create and edit modes. Existing jobs are edited with a `jobId` query parameter. Nonprofit edits return jobs to pending review.

### Job Organization Dashboard

File: `src/components/jobs/pages/JobsManagePage.tsx`

Shows the authenticated user's jobs. Organization users can:

- Edit jobs
- View rejection feedback
- Reopen resolved jobs
- Resolve approved jobs

### Job Admin Dashboard

File: `src/components/jobs/pages/JobsAdminPage.tsx`

Shows pending, approved, rejected, and resolved jobs. Admins can:

- Approve jobs
- Reject jobs with a reason
- Reopen or resolve jobs through status actions
- Refresh dashboard data
- Navigate to user management

### Event Board

Files:

- `src/components/events/pages/EventsBoardPage.tsx`
- `src/components/events/EventCard.tsx`
- `src/components/events/EventCard/EventGrid.tsx`

The event board shows approved events. Filters are based on event region and city.

### Event Form

File: `src/components/events/pages/ListEventPage.tsx`

The event form supports create and edit modes. Existing events are edited with an `eventId` query parameter. Required fields are validated by `src/lib/events.ts`.

The form requires confirmation that the event is one of the organization's major fundraising events of the year.

### Event Organization Dashboard

File: `src/components/events/pages/ManageEventsPage.tsx`

Shows the authenticated user's events grouped into live and pending sections. Rejected events show feedback and can be edited.

### Event Admin Dashboard

File: `src/components/events/pages/AdminEventsPage.tsx`

Shows pending, approved, and rejected events. Admins can:

- Approve events
- Reject events with a reason
- Refresh dashboard data
- Navigate to user management

### User Management

File: `src/components/users/AdminUsersPage.tsx`

Admins can:

- Search users by name, email, or organization
- Filter users by member status
- Export users as CSV or JSON
- Toggle member status
- Edit a user's organization
- Delete a user and their jobs/events
- Delete an organization and all related users/jobs/events

## Navigation

Files:

- `src/components/NavBar/NavBar.tsx`
- `src/components/NavBar/TopSection.tsx`
- `src/components/NavBar/BottomSection.tsx`

The top section shows the Spokes logo plus Clerk login/user controls. The bottom section changes labels and links based on whether the current path is under `/events` or `/jobs`.

On the 404 page, the navbar hides board-specific links and user/login controls.

## Environment Variables

Expected variables include:

- `MONGO_URI`: MongoDB connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Clerk sign-in route
- `RESEND_API_KEY`: Resend API key
- `SENDER_EMAIL`: email sender address
- `ADMIN_EMAIL`: admin recipient for notification emails
- `NEXT_PUBLIC_ADMIN_URL`: admin URL used in emails
- `NEXT_PUBLIC_API_BASE_URL`: optional base URL used by some frontend API calls

Never commit production secrets. Rotate keys if a secret is accidentally exposed.

## Validation and Testing

Useful commands:

```sh
npm run lint
npm test
npm run build
```

Targeted API tests live in `src/app/api/__test__`.

Recent areas with tests:

- Job API behavior
- Event API behavior
- Event validation
- User API behavior
- Organization API behavior
- Job board local storage behavior

## Known Caveats and Maintenance Notes

- `middleware.ts` has legacy route matcher names. Review it before relying on middleware for current `/jobs/*` and `/events/*` protection.
- Single-event deletion is supported by the API but not exposed as a visible owner-facing button.
- Deleting a user also deletes that user's jobs and events.
- Deleting an organization deletes all matching users, jobs, and events.
- Event records no longer use `locationType`; old database documents may still contain that property, but the current app does not read or write it.
- Job and event email delivery depends on Resend configuration.
- The admin user page mutates real data. Be careful with destructive actions while testing.

## Documentation Responsibilities

Update this document when changing:

- Route names or page responsibilities
- API request/response behavior
- Data schemas
- Auth or role rules
- Admin workflows
- Email templates or email routing
- Environment variables
