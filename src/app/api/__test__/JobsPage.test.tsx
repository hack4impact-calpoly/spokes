import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Jobs from "@/components/jobs/pages/JobsBoardPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";

// needed because jobs page uses react-query hooks (like useInfiniteQuery) which expect a QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("Jobs Page", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches and displays jobs", async () => {
    // Fake job data for the first page
    const fakeJobsPage = [
      {
        _id: "1",
        title: "Job One",
        employmentType: "full-time",
        compensationType: "paid",
        organizationIndustry: ["Tech"],
      },
      {
        _id: "2",
        title: "Job Two",
        employmentType: "part-time",
        compensationType: "volunteer",
        organizationIndustry: ["Health"],
      },
    ];

    // when the component calls fetch, use our fake job data(?)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeJobsPage,
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Jobs />
      </QueryClientProvider>,
    );

    // wait for any element containing "Job" to appear.
    await waitFor(
      () => {
        const jobElements = screen.getAllByText(/Job/i);
        expect(jobElements.length).toBeGreaterThan(0);
      },
      { timeout: 5000 },
    );
  });
});
