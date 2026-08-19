# Spokes Website Owner Guide

This guide is for the people managing the Spokes job and event boards day to day. It avoids technical setup details and focuses on how to use the website, what each admin action does, and what to try when something looks wrong.

## Quick Links

- Job board: `/jobs`
- Event board: `/events`
- Submit or edit a job: `/jobs/list`
- Submit or edit an event: `/events/list`
- Manage your organization's jobs: `/jobs/manage`
- Manage your organization's events: `/events/manage`
- Admin job review: `/jobs/admin`
- Admin event review: `/events/admin`
- Admin users page: `/jobs/users` or `/events/users`

If you are on a missing or broken page, the 404 page gives you buttons back to the Job Board and Event Board.

## User Types

There are three main types of users:

1. Public visitors can view approved jobs and events.
2. Nonprofit users can sign in, complete onboarding, submit jobs/events, and manage their own organization's postings.
3. Spokes admins can approve or reject submissions, manage users, update organizations, and remove users or organizations.

Admin access is tied to the Spokes admin organization in Clerk. If someone should be an admin but cannot see admin pages, check that they are in the correct admin organization.

## First-Time User Flow

When a nonprofit user signs in for the first time, they complete onboarding.

They will choose:

- Their organization
- Whether they are a paid Spokes member

If they choose "I am unsure if I am a paid member," the website saves them as a non-member until an admin updates them.

## Managing Jobs

### Submit a Job

1. Sign in.
2. Go to `/jobs/list`.
3. Fill out the job form.
4. Submit the job.

New jobs are submitted as pending. They do not appear publicly until approved by a Spokes admin.

### Review Jobs as an Admin

1. Go to `/jobs/admin`.
2. Review the Pending Jobs section.
3. Choose Approve or Reject.
4. If rejecting, enter a reason. That reason is sent to the submitter and appears as feedback.

Approved jobs appear on the public job board. Rejected jobs stay available to the organization so they can view feedback and edit/resubmit.

### Job Statuses

- Pending: waiting for Spokes admin review.
- Approved: visible on the public job board.
- Rejected: not public; the organization can view feedback.
- Resolved: no longer active or visible on the public job board.

Jobs stay active until the posting organization resolves or deletes them.

### Edit, Reopen, or Resolve Jobs

Organizations can use `/jobs/manage` to manage their own jobs.

- Edit: updates the job and sends it back to pending review.
- Reopen: sends a resolved job back for review.
- Resolve Job: marks an approved job as resolved so it is no longer active.
- View Feedback: shows the admin's rejection reason.

## Managing Events

### Submit an Event

1. Sign in.
2. Go to `/events/list`.
3. Fill out the event form.
4. Submit the event.

New events are submitted as pending. They do not appear publicly until approved by a Spokes admin.

Events do not use a location type. There is no "remote" or "in-person" selection. Use the venue and location link fields to explain where the event happens.

### Review Events as an Admin

1. Go to `/events/admin`.
2. Review the Pending Events section.
3. Choose Approve or Reject.
4. If rejecting, enter a reason. That reason is sent to the submitter and appears as feedback.

Approved events appear on the public event board. Rejected events stay available to the organization so they can view feedback and edit/resubmit.

### Edit Events

Organizations can use `/events/manage` to view their events.

- Pending and rejected events can be edited.
- Rejected events show a View Feedback button.
- Approved events are visible publicly.

There is not currently a visible owner-facing button for deleting a single event. If an event must be removed and there is no delete button available, ask the site maintainer or developer to remove it safely.

## Managing Users

Spokes admins can manage users from `/jobs/users` or `/events/users`.

## Adding a user to spokes admin organization

1. Sign into clerk
2. navigate to organizations
3. click on spokes admin
4. click on members
5. click on add user
6. select member from dropdown, and also select admin in role dropdown
7. click add user

### Search and Filter Users

Use the search box to find users by name, email, or organization.

Use the status filter to show:

- All users
- Members only
- Non-members only

### Export Users

1. Click Download.
2. Choose CSV or JSON.
3. Save the file.

CSV is best for spreadsheets. JSON is best for technical backups or developer review.

### Update a User's Member Status

1. Find the user.
2. Use the Member toggle.

When a user's member status changes, their existing jobs are also updated so job listings match the new membership status.

### Update a User's Organization

1. Find the user.
2. Click Edit Org.
3. Choose the correct organization.
4. Save.

This also updates that user's jobs and events to the new organization name.

### Delete a User

1. Find the user.
2. Click Delete.
3. Confirm the browser warning.

Deleting a user also deletes that user's jobs and events. This cannot be undone from the website. You cannot delete your own user account from the admin table.

Before deleting a user, confirm:

- The person should no longer have access.
- Their jobs and events should also be removed.
- You have exported or copied anything you may need later.

### Delete an Organization

1. Go to the Admin Users page.
2. In Delete Organization, select the organization.
3. Click Delete Organization.
4. Type the organization name exactly to confirm.
5. Confirm deletion.

Deleting an organization deletes all users, jobs, and events in that organization. This cannot be undone from the website. You cannot delete your own organization.

Use this only when you are certain the organization and all related records should be removed.

## Common Troubleshooting

### A user cannot see admin pages

Check whether they are part of the Spokes admin organization in Clerk. Regular nonprofit users cannot access admin pages.

### A job or event is not showing publicly

Check its status:

- Pending items are waiting for approval.
- Rejected items are not public.
- Resolved jobs are not active.
- Approved items should appear publicly.

Also try refreshing the admin page with the refresh button.

### A nonprofit says their organization is wrong

Go to the Admin Users page, find the user, click Edit Org, and save the correct organization. This updates their related jobs and events too.

### A nonprofit says their membership status is wrong

Go to the Admin Users page and use the Member toggle. If the change does not appear immediately, refresh the page.

### A submitter did not receive an email

Ask them to check spam or junk first. If emails are still not arriving, contact the site maintainer to check the email service settings.

Important email settings are managed outside the website code:

- Admin recipient email
- Sender email
- Email service API key

### Someone deleted the wrong user or organization

Deleted users, jobs, events, and organizations cannot be restored from the website itself or the database.

### The website URL or domain needs to change

This is managed by the hosting provider, not from the website dashboard. Ask the technical maintainer to update the hosting domain and any related environment settings.

## What Owners Can Do Without a Developer

Owners can usually handle:

- adding members to spokes admin organization on clerk
- Approving jobs and events
- Rejecting jobs and events with feedback
- Searching and exporting users
- Updating membership status
- Updating user organizations
- Deleting users
- Deleting organizations
- Reopening or resolving jobs from the organization dashboard

Owners should ask a technical maintainer for:

- Trying to restore deleted data
- Changing the website domain
- Changing email service settings
- Fixing broken pages
- Removing a single event if no delete button is visible
- Adding new features or changing form fields
