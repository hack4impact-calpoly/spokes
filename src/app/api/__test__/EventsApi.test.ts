import Event from "@/database/eventSchema";
import User from "@/database/userSchema";
import { resolveOrganizationName } from "@/lib/organizations";
import { GET, POST } from "@/app/api/events/route";
import { GET as GET_EVENT, PUT } from "@/app/api/events/[eventId]/route";

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
  EventStatus: {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    expired: "expired",
  },
  default: {
    find: jest.fn(),
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
  eventLocationGeneral: "San Luis Obispo Area",
  eventLocationCity: "San Luis Obispo",
  majorFundraisingEvent: true,
  eventLink: "https://example.com/community-workshop",
  description: "A useful workshop.",
  publicContactEmail: "attendee@example.com",
  publicContactPhoneNumber: "805-555-0101",
  submitterFirstName: "Alex",
  submitterLastName: "Morgan",
  submitterEmail: "alex@example.com",
  submitterPhoneNumber: "805-555-0102",
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
    const {
      eventLink,
      locationLink,
      eventLocationGeneral,
      eventLocationCity,
      majorFundraisingEvent,
      publicContactEmail,
      publicContactPhoneNumber,
      submitterFirstName,
      submitterLastName,
      submitterEmail,
      submitterPhoneNumber,
      ...expectedInsertPayload
    } = validEventPayload;

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
          eventLocationGeneral,
          eventLocationCity,
          majorFundraisingEvent,
          publicContactEmail,
          publicContactPhoneNumber,
          submitterFirstName,
          submitterLastName,
          submitterEmail,
          submitterPhoneNumber,
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
          eventLocationGeneral: validEventPayload.eventLocationGeneral,
          eventLocationCity: validEventPayload.eventLocationCity,
          majorFundraisingEvent: validEventPayload.majorFundraisingEvent,
          publicContactEmail: validEventPayload.publicContactEmail,
          publicContactPhoneNumber: validEventPayload.publicContactPhoneNumber,
          submitterFirstName: validEventPayload.submitterFirstName,
          submitterLastName: validEventPayload.submitterLastName,
          submitterEmail: validEventPayload.submitterEmail,
          submitterPhoneNumber: validEventPayload.submitterPhoneNumber,
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
        eventLocationGeneral: "North Coast",
        eventLocationCity: "Morro Bay",
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
        eventLocationGeneral: "North Coast",
        eventLocationCity: "Morro Bay",
      },
      { new: true, strict: false },
    );
  });

  test("GET blocks non-admin requests for private event statuses", async () => {
    mockAuth.userId = null as any;
    mockAuth.role = "job_seeker";

    const response = await GET(
      {
        url: "https://example.com/api/events?eventStatus=pending",
      } as any,
      {},
    );
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.message).toBe("Insufficient permissions");
    expect(Event.find).not.toHaveBeenCalled();
  });

  test("GET defaults public event listings to approved events", async () => {
    mockAuth.userId = null as any;
    mockAuth.role = "job_seeker";
    const sort = jest.fn().mockResolvedValue([]);
    (Event.find as jest.Mock).mockReturnValue({ sort });

    const response = await GET(
      {
        url: "https://example.com/api/events",
      } as any,
      {},
    );

    expect(response.status).toBe(200);
    expect(Event.find).toHaveBeenCalledWith({ eventStatus: "approved" });
  });

  test("GET event detail hides private events from anonymous users", async () => {
    mockAuth.userId = null as any;
    mockAuth.role = "job_seeker";
    (Event.findById as jest.Mock).mockResolvedValue({
      _id: "event-1",
      createdByUserId: "user-1",
      eventStatus: "pending",
    });

    const response = await GET_EVENT({ nextUrl: { pathname: "/api/events/event-1" } } as any, {});
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.message).toBe("Event not found");
  });
});
