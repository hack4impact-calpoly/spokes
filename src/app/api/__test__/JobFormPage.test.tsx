import React, { Suspense } from "react";
import { jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobFormPage from "@/app/jobform/JobFormPage.client";
import "@testing-library/jest-dom";
import { ClerkProvider } from "@clerk/nextjs";

if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(""),
}));

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("JobFormPage", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("sanity check: renders JobFormPage", () => {
    const { container } = render(
      <ClerkProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <JobFormPage />
        </Suspense>
        ,
      </ClerkProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    // Mock the fetch call to return a valid response for the first API call
    const fetchMock = global.fetch as jest.Mock<any>;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "123", message: "Job posted successfully!" }),
    });

    // Mock the second API call to /api/send (optional)
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <JobFormPage />
      </Suspense>,
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: "Test Org" },
    });

    // Simulate clicking the dropdown to open it
    const dropdownTrigger = screen.getByPlaceholderText(/Select industries/i);
    fireEvent.click(dropdownTrigger);

    // Wait for the dropdown options to appear and click the one labeled "Arts & Culture"
    const dropdownOption = await screen.findByText("Arts & Culture");
    fireEvent.click(dropdownOption);

    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "Test description." },
    });
    fireEvent.change(screen.getByLabelText(/Link to Job Details/i), {
      target: { value: "http://example.com/job" },
    });
    fireEvent.change(screen.getByLabelText(/Link to Job Application/i), {
      target: { value: "http://example.com/job" },
    });

    // Assuming the "Name" field for Person of Contact is the second one in the list:
    const nameFields = screen.getAllByLabelText(/Name/i);
    fireEvent.change(nameFields[1], {
      target: { value: "Test Name" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText(/Salary/i));
    fireEvent.click(screen.getByText(/Full-Time/i));

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for the asynchronous operations to finish
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    // Extract and parse the body for the first call:
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/jobs");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });

    // Parse the request body and assert on the object
    const parsedBody = JSON.parse(options.body as string);
    expect(parsedBody).toEqual(
      expect.objectContaining({
        organizationName: "Test Org",
        organizationIndustry: ["Arts & Culture"],
        title: "Software Engineer",
        postDate: expect.any(String),
        expireDate: null,
        jobDescription: "Test description.",
        employmentType: "full-time",
        compensationType: "salary",
        jobStatus: "pending",
        contactName: "Test Name",
        contactPhone: "",
        contactEmail: "test@example.com",
        detailURL: "http://example.com/job",
        applyNowURL: "http://example.com/job",
      }),
    );
  });

  it("displays JobFailModal on submission failure with HTTP error code", async () => {
    // Mock fetch to return a failure for the first API call
    const fetchMock = global.fetch as jest.Mock<any>;
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal Server Error" }),
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <JobFormPage />
      </Suspense>,
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: "Test Org" },
    });

    // Simulate clicking the industry dropdown
    const dropdownTrigger = screen.getByPlaceholderText(/Select industries/i);
    fireEvent.click(dropdownTrigger);

    // Select an industry
    const dropdownOption = await screen.findByText("Arts & Culture");
    fireEvent.click(dropdownOption);

    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Test Job" },
    });
    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "Test description." },
    });
    fireEvent.change(screen.getByLabelText(/Link to Job Details/i), {
      target: { value: "http://example.com/job" },
    });
    fireEvent.change(screen.getByLabelText(/Link to Job Application/i), {
      target: { value: "http://example.com/apply" },
    });
    const nameFields = screen.getAllByLabelText(/Name/i);
    fireEvent.change(nameFields[1], {
      target: { value: "Test Name" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText(/Salary/i));
    fireEvent.click(screen.getByText(/Full-Time/i));

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for the fetch call and modal to appear
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/jobs", expect.objectContaining({ method: "POST" }));
    });

    // Verify the fetch call details
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/jobs");
    expect(options.method).toBe("POST");

    // Check the response
    const response = await fetchMock.mock.results[0].value;
    expect(response.status).toBe(500);
    expect(response.ok).toBe(false);

    // Verify the JobFailModal appears with correct content
    await waitFor(() => {
      expect(screen.getByText("Job Listing Submission Failed")).toBeInTheDocument();
      expect(screen.getByText("There was an error processing your job listing. Please try again.")).toBeInTheDocument();
    });

    // Verify modal styling
    const modalContent = screen.getByText("Job Listing Submission Failed").closest(".chakra-modal__content");
    expect(modalContent).toHaveClass("border-red-500");

    // Test closing the modal
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Job Listing Submission Failed")).not.toBeInTheDocument();
    });
  });
});
