import Job from "@/database/jobSchema";
import User from "@/database/userSchema";
import { resolveOrganizationName } from "@/lib/organizations";
import { POST } from "@/app/api/jobs/route";

const mockAuth = {
  userId: "user-1",
  role: "nonprofit",
};

jest.mock("@/database/db", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/database/jobSchema", () => ({
  __esModule: true,
  default: {
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

const validJobPayload = {
  organizationName: "Spoofed Org",
  organizationIndustry: ["Education"],
  title: "Program Manager",
  postDate: "2026-02-27T00:00:00.000Z",
  modifiedDate: "2026-02-27T00:00:00.000Z",
  expireDate: null,
  jobDescription: "A useful role.",
  employmentType: "full-time",
  compensationType: "salary",
  jobStatus: "pending",
  contactName: "Admin User",
  contactEmail: "admin@example.com",
  detailURL: "https://example.com/job",
  applyNowURL: "",
  rejectionMessage: "",
};

function jsonRequest(path: string, body: Record<string, unknown>) {
  return {
    nextUrl: { pathname: path },
    json: async () => body,
  } as any;
}

describe("Jobs API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.userId = "user-1";
    mockAuth.role = "nonprofit";
  });

  test("POST derives organization from the authenticated Mongo user for nonprofits", async () => {
    const mongoUser = {
      organizationName: "User Org",
      paidMember: true,
      postedJobs: { addToSet: jest.fn() },
      save: jest.fn(() => Promise.resolve()),
    };
    (User.findById as jest.Mock).mockResolvedValue(mongoUser);
    (Job.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "job-1", ...validJobPayload });

    const response = await POST(jsonRequest("/api/jobs", validJobPayload), {});

    expect(response.status).toBe(201);
    expect(resolveOrganizationName).not.toHaveBeenCalled();
    expect(Job.findOneAndUpdate).toHaveBeenCalledWith(
      {
        userId: "user-1",
        organizationName: "User Org",
        title: validJobPayload.title,
        postDate: new Date(validJobPayload.postDate),
        detailURL: validJobPayload.detailURL,
      },
      {
        $setOnInsert: {
          ...validJobPayload,
          organizationName: "User Org",
          userId: "user-1",
          memberJob: true,
          jobStatus: "pending",
          applyNowURL: "",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  });

  test("POST lets spokes admins create jobs for a typed organization", async () => {
    mockAuth.role = "spokes_admin";
    const mongoUser = {
      organizationName: "Spokes",
      paidMember: false,
      postedJobs: { addToSet: jest.fn() },
      save: jest.fn(() => Promise.resolve()),
    };
    (User.findById as jest.Mock).mockResolvedValue(mongoUser);
    (resolveOrganizationName as jest.Mock).mockResolvedValue("New Member Org");
    (Job.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "job-1", ...validJobPayload });

    const response = await POST(
      jsonRequest("/api/jobs", {
        ...validJobPayload,
        organizationName: " New Member Org ",
      }),
      {},
    );

    expect(response.status).toBe(201);
    expect(resolveOrganizationName).toHaveBeenCalledWith("New Member Org");
    expect(Job.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        organizationName: "New Member Org",
      }),
      expect.objectContaining({
        $setOnInsert: expect.objectContaining({
          organizationName: "New Member Org",
          userId: "user-1",
          memberJob: false,
        }),
      }),
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  });
});
