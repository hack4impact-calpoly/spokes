# Automated Job Board Documentation (Developer Notes)

This guide outlines the core features and components of the Automated Job Board. It covers the API endpoints, UI components, authentication, database structure, and additional utilities used throughout the application. Use this document as a reference when working on or extending the project.

---

## Table of Contents

- [Job Board](#job-board)
  - [API Endpoints](#api-endpoints)
  - [Recently Viewed Jobs](#recently-viewed-jobs)
  - [UI Components](#ui-components)
    - [Job Cards](#job-cards)
    - [Recently Viewed](#recently-viewed)
    - [Filters](#filters)
    - [JobGrid & Loader](#jobgrid--loader)
    - [Job Confirmation Modal](#job-confirmation-modal)
    - [Main Jobs Component (Job Board View)](#main-jobs-component-job-board-view)
    - [Radio Card](#radio-card)
- [List a Job Form](#list-a-job-form)
- [Nav Bar](#nav-bar)
  - [Top Section](#top-section)
  - [Bottom Section](#bottom-section)
  - [Navigation Buttons](#navigation-buttons)
- [Nonprofit Admin Dashboard](#nonprofit-admin-dashboard)
- [Spokes Staff View](#spokes-staff-view)
  - [Incoming Applications](#incoming-applications)
  - [Live & Complete Applications](#live--complete-applications)
  - [Admin Account Management](#admin-account-management)
- [Users View](#users-page-admin-dashboard)
- [User Authentication](#user-authentication)
- [Database](#database)
- [Additional Developer Notes](#additional-developer-notes)

---

## Job Board

The Job Board is the main hub for job seekers. It consists of API endpoints to manage job data and a set of UI components to display, filter, and interact with jobs.

### API Endpoints

- **DELETE Job**

  - **What it does:**  
    Validates a job ID and deletes the corresponding job using `Job.findByIdAndDelete()`.
  - **Dev Note:**  
    Ensure robust error handling, enhanced logging, and proper handling for missing or invalid IDs.

- **POST Recent Jobs**

  - **What it does:**  
    Accepts an array of job IDs (from local storage), converts them to `ObjectId`, and retrieves the matching job documents.
  - **Dev Note:**  
    Validate that the IDs are correctly stored in local storage and handle any conversion errors.

- **CRUD Endpoints (GET / POST / PUT)**
  - **GET:**  
    Fetches all jobs sorted by `postDate` (newest first)
  - **POST (Create Job):**  
    Creates a new job entry in the database.
  - **PUT (Update Job):**  
    Updates an existing job using `findByIdAndUpdate()` with `.orFail()` for error checking.
  - **Dev Note:**
    - Validate payloads rigorously and consider pagination for GET requests when the dataset grows.
    - Caching currently exists in GET. current setting: keep response fresh for 60s, then serve stale data for up to 30s while revalidating in the background
    - GET route is paginated to allow for infinite scrolling on Job Board page

### Recently Viewed Jobs

- **What it does:**
  - Fetches jobs from `/jobs/recent` using local storage data when tab is switched to 'Recently Viewed'.
  - When any button on the job card is clicked, jobs are inserted locally into the recently viewed jobs array and that Job ID is stored in local storage.
- **Dev Note:**  
  This section of the job board is believed to be finished and optimized. Recently viewed jobs are only fetched onced and then updated locally.

### UI Components

#### Job Cards

- **JobCardInformation:**
  - **What it does:** Displays the job title, organization, industry, and a truncated description.
- **JobBadge & JobStatusBadge:**
  - **What they do:** Map job types and statuses to specific colors using helper functions.
- **JobPostedDate:**
  - **What it does:** Calculates and displays how long ago a job was posted (e.g., "5 minutes ago"), with basic error handling for invalid dates.
- **JobCard:**
  - **What it does:** Combines job information, badges, and action buttons ("See More", "Apply Now").
  - **Dev Note:**  
    Both action buttons (See More & Apply Now) currently add the job to the “recently viewed” list stored in local storage.

#### Recently Viewed

- **What it does:**  
  Maintains a list of job IDs in local storage to quickly fetch and display jobs the user has interacted with (By clicking See More or Apply Now buttons).
- **Dev Note:**  
  Ensure consistency in how job IDs are stored and managed.

#### Filters

- **FilterCard:**
  - **What it does:**  
    Provides checkboxes to filter jobs by employment type (e.g., Full-time, Part-time), compensation (e.g., Paid, Volunteer), and industry (e.g., Arts, Education).  
    Uses internal state to manage selections and passes changes via an `onFilterChange` callback.
  - **Dev Note:**  
    Consolidate duplicate implementations to avoid confusion.

#### JobGrid & Loader

- **JobGrid:**
  - **What it does:**  
    Displays a grid of job cards (or admin cards if in admin mode).  
    Handles empty states by displaying a fallback message ("No Jobs Found").
  - **Dev Note:**  
    Ensure that the component gracefully handles changes in data and role-based rendering.
- **Loader:**
  - **What it does:**  
    Displays a spinner with an optional label while data is loading.
  - **Dev Note:**  
    Use consistent spinner sizes and styles across components.

#### Job Confirmation Modal

- **What it does:**  
  Uses Chakra UI to display a modal confirming that a job listing has been successfully submitted.
  Displays an visable error nessage if a posting was unsuccessful.
- **Dev Note:**  
  Ensure the modal content remains aligned with backend approval workflows.

#### Main Jobs Component (Job Board View)

- **What it does:**
  - Fetches job data from `/api/jobs` when mounted.
  - Supports two tabs: "All Jobs" and "Recently Viewed" (which triggers a refresh of recent jobs).
  - Applies filters (employment and compensation) to the job lists.
- **Dev Note:**  
  Optimize data fetching (e.g., debounce filter updates) for better performance.

#### Radio Card

- **What it does:**
  Uses Chakra UI to display custom radio buttons for the member status and job type in the job form.

#### Job Card Modal (Admin Dashboard View)

- **What it does:**  
  Displays a modal to confirm proposed action (rejection, approval, or renewal) on a job application as an Admin.
- **Dev Note:**  
  Uses Chakra UI modals for confirmation dialogs. The component accepts `isOpen`, `onClose`, `onConfirm`, and `action` props, where action can be "approve", "reject", or "renew". The modal automatically adjusts text based on the action type. Uses consistent button styling with hover effects (green for confirm, red for cancel).

---

## List a Job Form

- **What it does:**  
  Provides a form for users to create new job listings. It includes fields for:
  - Organization name and industry
  - Job title
  - Member status with Spokes
  - Employment/compensation type (with button selections for Paid, Not Paid, Volunteer, Part-time, Full-time)
  - Posting and expiration dates (not implemented yet)
  - Job description and URL
  - Personal information (name, phone number, email)
- **Dev Note:**
  - Enhance form validation and error messaging to ensure data integrity. This form interacts with the POST `/api/jobs` endpoint.
  - Due to caching (60 second periods) newly edited jobs or recently deleted jobs may not be updated in view immediately.

---

## Nav Bar

The Nav Bar is split into two sections (Top and Bottom) and provides navigation links across the application.

### Top Section

- **What it does:**  
  Displays the company logo, clerk user button, and clerk org switcher.
  If a user is logged in (using Clerk), it shows the user button and org switcher, otherwise sign in button.
- **Dev Note:**  
  Use Chakra UI modals for sign-out confirmation and keep authentication flows up to date with Clerk changes.

### Bottom Section

- **What it does:**  
  Displays navigation links for "Job Board", "List Job", and (if the user is an admin) "Spokes Dashboard".  
  Implements a "Scroll to Top" button that appears when the user scrolls down on the job board. Uses a hamburger selector for
  mobile view so that more tabs can be accommodated,
- **Dev Note:**  
  Uses a custom hook (`useScrollDirection`) to determine scroll behavior. Adjust responsiveness and scrolling thresholds as needed.
  The spokes dashboard is always displayed for now, will need to add logic later for only spokes admin

### Navigation Buttons

- **What it does:**  
  Links in both the Top and Bottom sections conditionally render based on user roles and active paths.
- **Dev Note:**  
  Update conditional logic if user roles or access policies change.

---

## Nonprofit Admin Dashboard

- **What it does:**  
  Provides a dedicated interface for nonprofits to manage job postings, including editing and monitoring job listings.
- **Dev Note:**  
  Ensure role-based access is enforced and that metrics/monitoring tools are kept secure and accurate. (Implementation details may be expanded as features are developed.)

---

## Users Page Admin Dashboard

- **What it does:**  
  Displays a list of all users in a table format for admin review and management.  
  Allows admins to:

  - View user details (name, email, organization, member status)
  - Toggle a user's admin/member status using a switch (UI only; database update not yet implemented)
  - Filter and search users (UI elements present; functionality to be implemented)
  - Download user data (button present; functionality to be implemented)

- **Dev Notes:**
  - The page fetches user data from `/api/users` on mount.
  - Toggling the member status switch updates the UI state but does **not** persist changes to the database yet.
  - Search and filter features are placeholders for future development.
  - Ensure only authorized admins can access this page.
  - Update this section as backend integration and features are completed.

---

## Spokes Staff View

This view is designed for your client’s internal team and handles the review and management of job applications.

### Incoming Applications

- **What it does:**  
  Uses a carousel (`ChakraCarousel`) to display incoming job applications (jobs with a "pending" status) via `AdminJobCard` components.
- **Dev Note:**  
  The helper function `filterJobs` is used to filter jobs by status. Ensure that the carousel is responsive and handles dynamic data updates.

### Job Details

- **What it does**
  Displays information on job details and analytics for Spokes admin.
- **Dev Note:**
  Clicking edit is the same as clicking the edit icon in the admin dashboard. The page is currently using mock data.

### Live & Complete Applications

- **What it does:**  
  Displays live (approved) and complete (rejected) applications in a grid format using the `JobGrid` component.  
  Users can toggle between "Live Applications" and "Complete Applications" using tab controls.
- **Dev Note:**  
  The tab state controls which set of jobs is displayed. Optimize the toggling and data fetching for better user experience.

### Admin Account Management

- **What it does:**  
  (Not fully implemented in the current code.)  
  Intended to provide tools for managing admin accounts.
- **Dev Note:**  
  Plan to integrate robust security measures and proper role assignment when this functionality is developed.

---

## User Authentication

- **What it does:**  
  Provides sign-in and sign-up pages using Clerk.  
  Components such as `<SignIn />` and `<SignUp />` from `@clerk/nextjs` are wrapped in Chakra UI’s `Center` for styling.
  After Sign up `middleware.ts` will automatically make a POST request that adds Clerk's user id and user data to our MongoDB user database if it is their first log in.
- **Dev Note:**  
  Ensure that authentication flows and user session management are maintained with Clerk’s updates.

---

## Database

- **What it does:**  
  Uses MongoDB (via Mongoose) to store job and admin data.
- **Job Schema:**  
  Defines job properties such as organization, title, posting and expiration dates, description, employment type, compensation type, job status, and URL. Enumerated types ensure data consistency.
- **Admin Schema:**  
  Defines basic admin details (name, email, password).
- **Connection:**  
  The `connectDB` function ensures a singleton connection to the MongoDB instance.
- **Dev Note:**  
  Validate schema definitions when extending functionality. Ensure that the database connection logic handles reconnections gracefully.

---

## Additional Developer Notes

- **Error Handling & Logging:**  
  Implement robust error handling across all API endpoints. Consider integrating an error-tracking solution.
- **Consistency & Refactoring:**  
  Remove duplicate components (e.g., multiple FilterCard implementations) and enforce consistent naming conventions.
- **Testing & Validation:**  
  Add unit and integration tests for API endpoints and UI components.
- **Performance:**  
  Consider caching strategies, debouncing of filter updates, and pagination when working with large datasets.
- **Styling:**  
  The project uses a combination of Tailwind CSS, Chakra UI, and custom styling. Maintain consistency when updating themes or component styles.
- **Documentation:**  
  Keep this document updated with any significant code changes to maintain clarity for new developers and future maintainers.

---

_This document is a living guide for developers working on the Automated Job Board. Please update it as new features are added or modifications are made._
