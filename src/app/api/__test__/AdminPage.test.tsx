import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminJobs from "../../admin/page";
import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom";

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
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches and displays jobs in the admin panel", async () => {
    // Fake job data
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
      },
    ];

    // use our fake job data.
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeJobs,
    });

    render(
      <ChakraProvider>
        <AdminJobs />
      </ChakraProvider>,
    );

    expect(screen.getByText(/Pending Jobs/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Job1/i)).toBeInTheDocument();
      expect(screen.getByText("Org1")).toBeInTheDocument();
      expect(screen.getByText(/Pending description/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Live Jobs/i));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Job2/i })).toBeInTheDocument();
      expect(screen.getByText("Org2")).toBeInTheDocument();
      expect(screen.getByText(/Live description/i)).toBeInTheDocument;
    });

    fireEvent.click(screen.getByText(/Expired Jobs/i));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Job3/i })).toBeInTheDocument();
      expect(screen.getByText("Org3")).toBeInTheDocument();
      expect(screen.getByText(/Rejected description/i)).toBeInTheDocument();
    });
  });
});
