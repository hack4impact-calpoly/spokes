import React from "react";
import { jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobFormPage from "../../jobform/page";
import "@testing-library/jest-dom";

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
}));

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("JobFormPage", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("sanity check: renders JobFormPage", () => {
    const { container } = render(<JobFormPage />);
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

    render(<JobFormPage />);

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: "Test Org" },
    });

    // Simulate clicking the dropdown to open it
    const dropdownTrigger = screen.getByPlaceholderText(/Select industries/i);
    fireEvent.click(dropdownTrigger);

    // Wait for the dropdown options to appear and click the one labeled "Organizations"
    const dropdownOption = await screen.findByText("Organizations");
    fireEvent.click(dropdownOption);

    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "Test description." },
    });
    fireEvent.change(screen.getByLabelText(/Link to Job Listing/i), {
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
        organizationIndustry: ["Organizations"],
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
        applyNowURL: "",
      }),
    );
  });

  it("handles submission failure with HTTP error code", async () => {
    // Mock fetch to return a failure for the first API call
    const fetchMock = global.fetch as jest.Mock<any>;
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500, // Simulate server error
      json: async () => ({ message: "Internal Server Error" }),
    });

    render(<JobFormPage />);

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: "Test Org" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Select industries/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Test Job" },
    });
    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: "Test description." },
    });
    fireEvent.change(screen.getByLabelText(/Link to Job Listing/i), {
      target: { value: "http://example.com/job" },
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

    // Wait for the fetch call to be made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/jobs", expect.objectContaining({ method: "POST" }));
    });

    // Verify the fetch call details:
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/jobs");
    expect(options.method).toBe("POST");

    // Check the response of the mocked fetch call:
    const response = await fetchMock.mock.results[0].value;
    expect(response.status).toBe(500);
    expect(response.ok).toBe(false);

    // Finally, assert that the error message is rendered in the UI (Modify this if UI changes)
    await waitFor(() => expect(screen.getByText(/Error submitting job/i)).toBeInTheDocument());
  });
});
