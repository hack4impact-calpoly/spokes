import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EventsPage from "./EventsBoardPage";
import { getAllEvents } from "@/services/events";

jest.mock("@/services/events", () => ({
  getAllEvents: jest.fn(),
}));

jest.mock("@/components/events/EventCard", () => ({
  __esModule: true,
  default: ({ event }: { event: { eventName: string } }) => <div>{event.eventName}</div>,
}));

describe("EventsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("shows far-future events in All months without extending the month options", async () => {
    const farFutureEvent = {
      _id: "far-future-event",
      eventName: "Far Future Gala",
      date: new Date(Date.UTC(new Date().getUTCFullYear() + 5, 0, 1)).toISOString(),
      eventLocationGeneral: "San Luis Obispo Area",
      eventLocationCity: "San Luis Obispo",
    };
    (getAllEvents as jest.Mock).mockResolvedValue([farFutureEvent]);

    render(<EventsPage />);

    await screen.findByText("Far Future Gala");

    const monthSelect = screen.getAllByRole("combobox")[0] as HTMLSelectElement;
    const monthValues = Array.from(monthSelect.options).map((option) => option.value);
    const now = new Date();
    const expectedMonths = Array.from({ length: 13 }, (_, offset) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    });

    expect(monthValues).toEqual(["", ...expectedMonths]);

    fireEvent.change(monthSelect, { target: { value: expectedMonths[0] } });

    await waitFor(() => {
      expect(screen.queryByText("Far Future Gala")).not.toBeInTheDocument();
    });
  });
});
