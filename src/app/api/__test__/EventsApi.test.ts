import Event from "@/database/eventSchema";
import User from "@/database/userSchema";
import { resolveOrganizationName } from "@/lib/organizations";
import { POST } from "@/app/api/events/route";
import { PUT } from "@/app/api/events/[eventId]/route";

const mockAuth = {
  userId: "user-1",
  role: "nonprofit",
};

jest.mock("@/database/db", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/database/eventSchema", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

jest.mock("@/database/userSchema", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  withApiAuth: (handler: Function) => {
    return async (req: Request, context: any = {}) => handler(req, { ...context, auth: mockAuth });
  },
}));

jest.mock("@/lib/organizations", () => ({
  resolveOrganizationName: jest.fn((organizationName: string) => Promise.resolve(organizationName.trim())),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const validEventPayload = {
  eventName: "Community Workshop",
  date: "2026-02-27",
  time: "6:00 PM",
  location: "Innovation Hub",
  locationLink: "https://maps.example.com/innovation-hub",
  locationType: "in-person",
  eventLink: "https://example.com/community-workshop",
  description: "A useful workshop.",
};

function jsonRequest(path: string, body: Record<string, unknown>) {
  return {
    nextUrl: { pathname: path },
    json: async () => body,
  } as any;
}

describe("Events API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.userId = "user-1";
    mockAuth.role = "nonprofit";
  });

  test("POST derives organization and ownership from the authenticated Mongo user", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ organizationName: "Spokes Nonprofit" });
    (Event.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "event-1", ...validEventPayload });
    const { eventLink, locationLink, ...expectedInsertPayload } = validEventPayload;

    const response = await POST(
      jsonRequest("/api/events", {
        ...validEventPayload,
        organization: "Spoofed Org",
        createdByUserId: "attacker",
      }),
      {},
    );

    expect(response.status).toBe(201);
    expect(Event.findOneAndUpdate).toHaveBeenCalledWith(
      {
        createdByUserId: "user-1",
        organization: "Spokes Nonprofit",
        date: new Date(validEventPayload.date),
        eventName: validEventPayload.eventName,
        time: validEventPayload.time,
        location: validEventPayload.location,
      },
      {
        $set: {
          eventLink,
          locationLink,
        },
        $setOnInsert: {
          ...expectedInsertPayload,
          organization: "Spokes Nonprofit",
          createdByUserId: "user-1",
          eventStatus: "pending",
          contactName: "",
          contactEmail: "",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, strict: false },
    );
  });

  test("POST lets spokes admins create events for a typed organization", async () => {
    mockAuth.role = "spokes_admin";
    (User.findById as jest.Mock).mockResolvedValue({
      organizationName: "Spokes",
      email: "admin@example.com",
    });
    (resolveOrganizationName as jest.Mock).mockResolvedValue("New Member Org");
    (Event.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "event-1", ...validEventPayload });

    const response = await POST(
      jsonRequest("/api/events", {
        ...validEventPayload,
        organization: " New Member Org ",
      }),
      {},
    );

    expect(response.status).toBe(201);
    expect(resolveOrganizationName).toHaveBeenCalledWith("New Member Org");
    expect(Event.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        createdByUserId: "user-1",
        organization: "New Member Org",
      }),
      expect.objectContaining({
        $set: {
          eventLink: validEventPayload.eventLink,
          locationLink: validEventPayload.locationLink,
        },
        $setOnInsert: expect.objectContaining({
          organization: "New Member Org",
          createdByUserId: "user-1",
        }),
      }),
      { new: true, upsert: true, setDefaultsOnInsert: true, strict: false },
    );
  });

  test("PUT blocks nonprofits from updating events they do not own", async () => {
    (Event.findById as jest.Mock).mockResolvedValue({ _id: "event-1", createdByUserId: "user-2" });

    const response = await PUT(jsonRequest("/api/events/event-1", { eventName: "Updated" }), {});
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.message).toBe("Insufficient permissions");
    expect(Event.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("PUT only writes whitelisted mutable event fields", async () => {
    (Event.findById as jest.Mock).mockResolvedValue({
      _id: "event-1",
      createdByUserId: "user-1",
      eventStatus: "pending",
    });
    (Event.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: "event-1", eventName: "Updated Event" });

    const response = await PUT(
      jsonRequest("/api/events/event-1", {
        eventName: "Updated Event",
        eventLink: "https://example.com/updated-event",
        locationLink: "https://maps.example.com/updated-event",
        organization: "Spoofed Org",
        createdByUserId: "attacker",
      }),
      {},
    );

    expect(response.status).toBe(200);
    expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
      "event-1",
      {
        eventName: "Updated Event",
        eventLink: "https://example.com/updated-event",
        locationLink: "https://maps.example.com/updated-event",
      },
      { new: true, strict: false },
    );
  });
});
