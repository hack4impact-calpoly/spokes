import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import JobCard from "../../../components/JobCard/JobCard"; // adjust the path as needed

// Dummy job object with organizationIndustry as an array
const dummyJob = {
  _id: "job-123",
  organizationName: "Test Org",
  organizationIndustry: ["Tech"] as [string],
  title: "Test Title",
  postDate: new Date(),
  jobDescription: "Test description",
  employmentType: "full-time",
  compensationType: "salary",
  jobStatus: "pending",
  detailURL: "http://example.com/job",
  applyNowURL: "http://example.com/apply",
};

describe("Local Storage Addition for JobCard", () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock window.open to avoid jsdom's "not implemented" error
    window.open = jest.fn();
  });

  test("Job is added to localStorage when 'See More' is clicked", () => {
    render(<JobCard job={dummyJob} />);

    expect(localStorage.getItem("myJobs")).toBe("[]");

    // "See More" triggers updateLocalStorage in JobCard.tsx
    const seeMoreButton = screen.getByRole("button", { name: /see more/i });
    fireEvent.click(seeMoreButton);

    const storedJobs = JSON.parse(localStorage.getItem("myJobs") || "[]");
    expect(storedJobs).toContain(dummyJob._id);
  });
});
