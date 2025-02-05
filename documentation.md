# Automated Job Board Documentation (Developer Notes)

This guide outlines the core features of the Automated Job Board along with important implementation details and developer notes. Use this as a reference when working on or extending the project.

## Table of Contents
- [Job Board](#job-board)
  - [Job Cards](#job-cards)
  - [Recently Viewed](#recently-viewed)
  - [Filters](#filters)
- [List a Job Form](#list-a-job-form)
- [Nav Bar](#nav-bar)
  - [Login](#login)
  - [Navigation Buttons](#navigation-buttons)
- [Nonprofit Admin Dashboard](#nonprofit-admin-dashboard)
- [Spokes Staff View](#spokes-staff-view)
  - [Incoming Applications](#incoming-applications)
  - [Approval/Denial](#approvaldenial)
  - [Live Applications](#live-applications)
  - [Completed & Expired Applications](#completed--expired-applications)
  - [Admin Account Management](#admin-account-management)
- [Additional Developer Notes](#additional-developer-notes)

---

## Job Board

This is the main hub for job seekers. The code consists of API endpoints and UI components that support job display, filtering, and interaction.

### API Endpoints

- **DELETE Job**  
  - **What it does:** Validates a job ID and deletes the corresponding job using `Job.findByIdAndDelete()`.
  - **Dev Note:** Ensure robust error handling; consider enhancing logging and handling cases like missing or invalid IDs.

- **POST Recent Jobs**  
  - **What it does:** Parses an array of job IDs from the request, converts them to `ObjectId`, and retrieves matching jobs.
  - **Dev Note:** Verify that local storage always provides valid IDs and handle conversion errors if necessary.

- **GET / POST / PUT (CRUD) Endpoints**  
  - **GET:** Fetches all jobs sorted by `postDate` (newest first).  
  - **POST (Create Job):** Saves a new job to the database.  
  - **PUT (Update Job):** Updates an existing job using `findByIdAndUpdate()` with error checking via `.orFail()`.
  - **Dev Note:** Validate payloads rigorously and consider pagination for GET requests when the dataset grows.

### UI Components

#### Job Cards

- **JobCardInformation:** Displays job title, organization, industry, and a truncated description.  
- **JobBadge & JobStatusBadge:** Map job types/statuses to specific colors using helper functions.  
- **JobPostedDate:** Calculates and displays how long ago a job was posted (e.g., "5 minutes ago"), with basic error handling for invalid dates.
- **JobCard:**  
  - Combines the above elements and provides action buttons ("See More", "Apply Now").  
  - **Dev Note:** Both buttons currently add the job to a “recently viewed” list stored in `localStorage`; consider separating their behaviors if needed.

#### Recently Viewed

- **What it does:** Maintains a list of job IDs in `localStorage` to quickly fetch and display jobs the user has interacted with.
- **Dev Note:** Ensure that local storage management is consistent and that IDs are kept valid.

#### Filters

- **FilterCard:**  
  - Provides checkboxes for filtering jobs by employment type (e.g., Full-time, Part-time) and compensation (e.g., Paid, Volunteer).  
  - Uses internal state to manage checkbox values and sends updates via the `onFilterChange` callback.
  - **Dev Note:** There are duplicate implementations in the codebase—consolidate them to avoid confusion.

#### JobGrid

- **What it does:** Displays jobs in a responsive grid.  
- **Dev Note:** Switches between admin and standard job cards based on a prop; gracefully handles empty states.

#### JobConfirmationModal

- **What it does:** Uses Chakra UI to show a modal confirming successful job submission.  
- **Dev Note:** Ensure that modal content stays aligned with backend approval workflows.

#### Main Jobs Component (Job Board View)

- **What it does:**  
  - Fetches job data on mount via the `/api/jobs` endpoint.  
  - Supports two tabs: "All Jobs" and "Recently Viewed" (which triggers a re-fetch of recent jobs).
  - Applies filters (employment, compensation) to both lists.
- **Dev Note:** Optimize data fetching and consider debouncing filter updates for performance.

---

## List a Job Form

- **Purpose:** Enables users to post new job listings.
- **Key Points:**  
  - Validates required fields (title, description, etc.).  
  - Interacts with the POST `/api/jobs` endpoint.
- **Dev Note:** Enhance form validation and error messaging to ensure data integrity.

---

## Nav Bar

- **Login:**  
  - **What it does:** Provides secure authentication.  
  - **Dev Note:** Keep authentication flows updated with any third-party service changes.
  
- **Navigation Buttons:**  
  - **What it does:** Offer links to key views (Job Board, List a Job, etc.), conditionally rendered based on user roles.
  - **Dev Note:** Update conditional rendering logic if user roles or access policies change.

---

## Nonprofit Admin Dashboard

- **Purpose:** Allows nonprofits to manage job postings.
- **Key Points:**  
  - Supports editing job posts and monitoring activity.
- **Dev Note:** Enforce role-based access and ensure that metrics and monitoring tools are accurate and secure.

---

## Spokes Staff View

Designed for internal use by your client’s team, this view includes:

- **Incoming Applications:**  
  - **What it does:** Displays newly submitted applications with real-time updates.
  - **Dev Note:** Consider integrating WebSocket or polling for live updates.
  
- **Approval/Denial:**  
  - **What it does:** Provides controls to approve or deny applications.
  - **Dev Note:** Ensure that decision workflows and audit trails are robust.
  
- **Live Applications:**  
  - **What it does:** Monitors active applications.
  - **Dev Note:** Optimize for real-time data presentation.
  
- **Completed & Expired Applications:**  
  - **What it does:** Shows finished or outdated applications.
  - **Dev Note:** Implement clear status updates and archiving logic.
  
- **Admin Account Management:**  
  - **What it does:** Offers tools for managing admin user accounts.
  - **Dev Note:** Emphasize security measures and proper role assignments.

---

## Additional Developer Notes

- **Error Handling & Logging:**  
  - Ensure all API endpoints have robust error handling and consider integrating an error-tracking solution.
- **Consistency & Refactoring:**  
  - Remove duplicate components (e.g., FilterCard) and maintain consistent naming conventions.
- **Testing & Validation:**  
  - Implement thorough tests (unit/integration) for both API endpoints and UI components.
- **Performance:**  
  - Consider caching strategies and pagination when working with large datasets.
- **Documentation:**  
  - Update this document with any significant code changes to keep it in sync with the implementation.

---

*This document is intended as a living guide for developers. Please update it as new features are added or modifications are made to ensure it remains current and useful.*
