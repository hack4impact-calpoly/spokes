import { render, screen } from "@testing-library/react";
import WelcomeInfo from "@/components/ui/WelcomeInfo";

describe("WelcomeInfo", () => {
  it("keeps job-specific copy on the job board login", () => {
    render(<WelcomeInfo board="jobs" />);

    expect(screen.getByText(/To post a job/)).toBeInTheDocument();
    expect(screen.getByText(/List Job/)).toBeInTheDocument();
    expect(screen.queryByText(/To post an event/)).not.toBeInTheDocument();
  });

  it("uses event-specific copy on the event board login", () => {
    render(<WelcomeInfo board="events" />);

    expect(screen.getByText(/To post an event/)).toBeInTheDocument();
    expect(screen.getByText(/List Event/)).toBeInTheDocument();
    expect(screen.getByText(/Spokes event board/)).toBeInTheDocument();
    expect(screen.queryByText(/To post a job/)).not.toBeInTheDocument();
    expect(screen.queryByText(/List Job/)).not.toBeInTheDocument();
  });
});
