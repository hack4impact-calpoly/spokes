import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Jobs from "../../../app/jobs/page";

// needed because jobs page uses react-query hooks (like useInfiniteQuery) which expect a QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  //ESLint requires every component to have a display name.
  const QueryClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  QueryClientWrapper.displayName = "QueryClientWrapper";
  return QueryClientWrapper;
};

describe("Fetching Jobs using Local Storage Array", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("Fetches recent jobs based on job IDs stored in localStorage", async () => {
    // dummy job ID array added to local storage
    const dummyJobIds = ["job-123", "job-456"];
    localStorage.setItem("myJobs", JSON.stringify(dummyJobIds));

    // mock fetch response
    const mockJobs = [
      {
        _id: "job-123",
        title: "Job 123",
        organizationName: "Org A",
        postDate: new Date().toISOString(),
        jobDescription: "Desc A",
        employmentType: "full-time",
        compensationType: "salary",
        jobStatus: "pending",
        detailURL: "http://example.com/123",
        applyNowURL: "http://example.com/apply123",
      },
      {
        _id: "job-456",
        title: "Job 456",
        organizationName: "Org B",
        postDate: new Date().toISOString(),
        jobDescription: "Desc B",
        employmentType: "part-time",
        compensationType: "hourly",
        jobStatus: "pending",
        detailURL: "http://example.com/456",
        applyNowURL: "http://example.com/apply456",
      },
    ];
    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (typeof url === "string" && url.includes("/api/jobs/recent")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockJobs),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    const Wrapper = createWrapper();
    render(<Jobs />, { wrapper: Wrapper });

    const recentlyViewedTab = screen.getByText(/recently viewed/i);
    fireEvent.click(recentlyViewedTab);

    await waitFor(() => {
      expect(screen.getByText(/job 123/i)).toBeInTheDocument();
      expect(screen.getByText(/job 456/i)).toBeInTheDocument();
    });

    // confirm that the fetch call was made
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/jobs/recent"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawJobIdArray: dummyJobIds }),
      }),
    );
  });
});
