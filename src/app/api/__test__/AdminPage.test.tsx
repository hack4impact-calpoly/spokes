import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminJobs from "@/components/jobs/pages/JobsAdminPage";
import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";
import { IJob } from "@/database/jobSchema";

// add mock for next/router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(""),
}));

// Mock Clerk auth to provide admin permissions
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(() => ({
    userId: "mock-admin-id",
    orgSlug: "spokes-admin",
  })),
  currentUser: jest.fn(() => ({
    id: "mock-admin-id",
  })),
}));

// Mock the auth library
jest.mock("@/lib/auth", () => ({
  withApiAuth: (handler: Function) => {
    return async (req: Request, context: any) => {
      // Pass the auth context with admin role
      return handler(req, {
        ...context,
        auth: {
          userId: "mock-admin-id",
          role: "spokes_admin",
        },
      });
    };
  },
  getAuthWithRole: jest.fn(() => ({ userId: "mock-admin-id", role: "spokes_admin" })),
}));

// needed because Chakra UI uses matchMedia and depends on it otherwise Jest fails
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

describe("Admin Jobs Page", () => {
  // Fake job data - to be reused in mocks
  const fakeJobs = [
    {
      _id: "1",
      title: "Job1",
      jobStatus: "pending",
      postDate: new Date().toISOString(),
      organizationName: "Org1",
      organizationIndustry: ["Tech"],
      jobDescription: "Pending description",
      employmentType: "full-time",
      compensationType: "paid",
      contactName: "Contact1",
      contactEmail: "contact1@example.com",
      detailURL: "http://example.com/pending",
      userId: "user1",
      modifiedDate: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Job2",
      jobStatus: "approved",
      postDate: new Date().toISOString(),
      organizationName: "Org2",
      organizationIndustry: ["Health"],
      jobDescription: "Live description",
      employmentType: "full-time",
      compensationType: "paid",
      contactName: "Contact2",
      contactEmail: "contact2@example.com",
      detailURL: "http://example.com/live",
      userId: "user2",
      modifiedDate: new Date().toISOString(),
    },
    {
      _id: "3",
      title: "Job3",
      jobStatus: "expired",
      postDate: new Date().toISOString(),
      organizationName: "Org3",
      organizationIndustry: ["Finance"],
      jobDescription: "Rejected description",
      employmentType: "part-time",
      compensationType: "volunteer",
      contactName: "Contact3",
      contactEmail: "contact3@example.com",
      detailURL: "http://example.com/rejected",
      userId: "user3",
      modifiedDate: new Date().toISOString(),
    },
  ];

  const pendingJobs = fakeJobs.filter((job) => job.jobStatus === "pending");
  const approvedJobs = fakeJobs.filter((job) => job.jobStatus === "approved");
  const expiredJobs = fakeJobs.filter((job) => job.jobStatus === "expired");
  const rejectedJobs: IJob[] = []; // No rejected jobs in our test data

  beforeEach(() => {
    // Reset and setup the fetch mock
    global.fetch = jest.fn();

    // Setup default mock response for the initial fetch
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      // Mock different responses based on the URL
      if (url === "/api/jobs") {
        return Promise.resolve({
          ok: true,
          json: async () => fakeJobs,
        });
      } else if (url === "/api/jobs?jobStatus=pending&admin=true") {
        return Promise.resolve({
          ok: true,
          json: async () => pendingJobs,
        });
      } else if (url === "/api/jobs?jobStatus=approved&admin=true") {
        return Promise.resolve({
          ok: true,
          json: async () => approvedJobs,
        });
      } else if (url === "/api/jobs?jobStatus=rejected&admin=true") {
        return Promise.resolve({
          ok: true,
          json: async () => rejectedJobs,
        });
      } else if (url === "/api/jobs?jobStatus=expired&admin=true") {
        return Promise.resolve({
          ok: true,
          json: async () => expiredJobs,
        });
      } else if (url.includes("/api/jobs/")) {
        // Extract job ID from URL
        const jobId = url.split("/").pop();
        const job = fakeJobs.find((j) => j._id === jobId);

        return Promise.resolve({
          ok: true,
          json: async () => job,
        });
      }

      // Default fallback
      return Promise.resolve({
        ok: false,
        json: async () => ({ error: "Not found" }),
      });
    });
  });

  it("fetches and displays jobs in the admin panel", async () => {
    render(
      <ChakraProvider>
        <AdminJobs />
      </ChakraProvider>,
    );

    // First verify we see the section headings
    expect(screen.getByText(/Pending Jobs/i)).toBeInTheDocument();

    // Wait for the pending jobs to load and render
    await waitFor(() => {
      expect(screen.getByText("Job1")).toBeInTheDocument();
    });
    expect(screen.getByText("Org1")).toBeInTheDocument();
    expect(screen.getByText(/Pending description/i)).toBeInTheDocument();

    // Click on Live Jobs tab which should already be selected by default
    fireEvent.click(screen.getByText(/Live Jobs/i));

    // Wait for live jobs to appear
    await waitFor(() => {
      expect(screen.getByText("Job2")).toBeInTheDocument();
    });
    expect(screen.getByText("Org2")).toBeInTheDocument();

    // Click on Expired Jobs tab
    fireEvent.click(screen.getByText(/Expired Jobs/i));

    // Check for expired jobs
    await waitFor(() => {
      expect(screen.getByText("Job3")).toBeInTheDocument();
    });
    expect(screen.getByText("Org3")).toBeInTheDocument();
  });
});
