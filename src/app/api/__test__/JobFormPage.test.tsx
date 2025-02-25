import React from "react";
import { jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobFormPage from "../../jobform/page";
import "@testing-library/jest-dom";

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
    // Setup fetch mock for POST request
    const fetchMock = global.fetch as jest.Mock<any>;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "123", message: "Job posted successfully!" }),
    });

    render(<JobFormPage />);

    // Fill text input fields using label queries
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: "Test Org" },
    });
    fireEvent.change(screen.getByLabelText(/Organization Industry/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Software Engineer" },
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

    // click the submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for async events and verify that fetch was called with POST method
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/jobs",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    // Check that the success message is displayed
    expect(await screen.findByText(/job posted successfully/i)).toBeInTheDocument();
  });

  it("displays error on submission failure", async () => {
    const fetchMock = global.fetch as jest.Mock<any>;
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    render(<JobFormPage />);

    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: "Test Org" },
    });
    fireEvent.change(screen.getByLabelText(/Organization Industry/i), {
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

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/error submitting job/i)).toBeInTheDocument();
  });
});
