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
        title: "Pending Job",
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
        title: "Live Job",
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
        title: "Rejected Job",
        jobStatus: "rejected",
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
      expect(screen.getByText(/Pending Job/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Live Jobs/i));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Live Job/i })).toBeInTheDocument();
    });
  });
});
