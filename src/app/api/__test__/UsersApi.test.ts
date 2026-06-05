import Event from "@/database/eventSchema";
import Job from "@/database/jobSchema";
import User from "@/database/userSchema";
import { resolveOrganizationName } from "@/lib/organizations";
import { DELETE, PATCH } from "@/app/api/users/[id]/route";

const mockAuth = {
  userId: "admin-1",
  role: "spokes_admin",
};

jest.mock("@/database/db", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/database/eventSchema", () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
    updateMany: jest.fn(),
  },
}));

jest.mock("@/database/jobSchema", () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
    updateMany: jest.fn(),
  },
}));

jest.mock("@/database/userSchema", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
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

function jsonRequest(path: string, body: Record<string, unknown> = {}) {
  return {
    nextUrl: { pathname: path },
    json: async () => body,
  } as any;
}

describe("Users API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.userId = "admin-1";
    mockAuth.role = "spokes_admin";
  });

  test("PATCH updates a user's organization and their owned jobs/events", async () => {
    const user = {
      _id: "user-1",
      organizationName: "Old Org",
      postedJobs: ["job-1"],
      save: jest.fn(() => Promise.resolve()),
    };
    (User.findById as jest.Mock).mockResolvedValue(user);
    (resolveOrganizationName as jest.Mock).mockResolvedValue("New Org");
    (Job.updateMany as jest.Mock).mockResolvedValue({ modifiedCount: 2 });
    (Event.updateMany as jest.Mock).mockResolvedValue({ modifiedCount: 3 });

    const response = await PATCH(jsonRequest("/api/users/user-1", { organizationName: " New Org " }), {});
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(resolveOrganizationName).toHaveBeenCalledWith("New Org");
    expect(Job.updateMany).toHaveBeenCalledWith({ userId: "user-1" }, { $set: { organizationName: "New Org" } });
    expect(Event.updateMany).toHaveBeenCalledWith({ createdByUserId: "user-1" }, { $set: { organization: "New Org" } });
    expect(user.save).toHaveBeenCalled();
    expect(result.organizationName).toBe("New Org");
  });

  test("DELETE removes a user and their owned jobs/events", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ _id: "user-1" });
    (Job.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });
    (Event.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 3 });
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "user-1" });

    const response = await DELETE(jsonRequest("/api/users/user-1"), {});
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Job.deleteMany).toHaveBeenCalledWith({ userId: "user-1" });
    expect(Event.deleteMany).toHaveBeenCalledWith({ createdByUserId: "user-1" });
    expect(User.findByIdAndDelete).toHaveBeenCalledWith("user-1");
    expect(result).toEqual({
      message: "User deleted successfully",
      jobsDeleted: 2,
      eventsDeleted: 3,
    });
  });
});
