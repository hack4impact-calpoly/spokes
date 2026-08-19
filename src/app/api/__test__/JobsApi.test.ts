import Job from "@/database/jobSchema";
import User from "@/database/userSchema";
import { resolveOrganizationName } from "@/lib/organizations";
import { GET, POST } from "@/app/api/jobs/route";
import { GET as GET_JOB, PUT } from "@/app/api/jobs/[jobId]/route";

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
  JobStatus: {
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
  NextResponse: Object.assign(
    jest.fn((body: string, init?: { status?: number; headers?: Record<string, string> }) => ({
      status: init?.status ?? 200,
      headers: init?.headers ?? {},
      json: async () => JSON.parse(body),
    })),
    {
      json: jest.fn((body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      })),
    },
  ),
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

  test("GET blocks non-admin requests for private job statuses", async () => {
    mockAuth.userId = null as any;
    mockAuth.role = "job_seeker";

    const response = await GET(
      {
        url: "https://example.com/api/jobs?jobStatus=pending",
      } as any,
      {},
    );
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.message).toBe("Insufficient permissions");
    expect(Job.find).not.toHaveBeenCalled();
  });

  test("GET defaults public job listings to all approved jobs", async () => {
    mockAuth.userId = null as any;
    mockAuth.role = "job_seeker";
    const limit = jest.fn().mockResolvedValue([]);
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));
    (Job.find as jest.Mock).mockReturnValue({ sort });

    const response = await GET(
      {
        url: "https://example.com/api/jobs",
      } as any,
      {},
    );

    expect(response.status).toBe(200);
    expect(Job.find).toHaveBeenCalledWith({ jobStatus: "approved" });
  });

  test("GET job detail hides private jobs from anonymous users", async () => {
    mockAuth.userId = null as any;
    mockAuth.role = "job_seeker";
    (Job.findById as jest.Mock).mockResolvedValue({
      _id: "job-1",
      userId: "user-1",
      jobStatus: "pending",
    });

    const response = await GET_JOB({ nextUrl: { pathname: "/api/jobs/job-1" } } as any, {});
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.message).toBe("Job not found");
  });

  test("GET job detail keeps an approved legacy job public without an approval date", async () => {
    mockAuth.userId = null as any;
    mockAuth.role = "job_seeker";
    (Job.findById as jest.Mock).mockResolvedValue({
      _id: "job-1",
      userId: "user-1",
      jobStatus: "approved",
    });

    const response = await GET_JOB({ nextUrl: { pathname: "/api/jobs/job-1" } } as any, {});

    expect(response.status).toBe(200);
  });

  test("allows an organization to resolve its job", async () => {
    (Job.findById as jest.Mock).mockResolvedValue({ _id: "job-1", userId: "user-1", jobStatus: "approved" });
    (Job.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: "job-1", jobStatus: "expired" });

    const response = await PUT(jsonRequest("/api/jobs/job-1", { isResolve: true }), {});

    expect(response.status).toBe(200);
    expect(Job.findByIdAndUpdate).toHaveBeenCalledWith(
      "job-1",
      { jobStatus: "expired", modifiedDate: expect.any(Date) },
      { new: true },
    );
  });

  test("PUT only writes whitelisted mutable job fields", async () => {
    (Job.findById as jest.Mock).mockResolvedValue({
      _id: "job-1",
      userId: "user-1",
      jobStatus: "approved",
      rejectionMessage: "",
    });
    (Job.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: "job-1" });

    const response = await PUT(
      jsonRequest("/api/jobs/job-1", {
        title: "Updated Title",
        organizationName: "Spoofed Org",
        userId: "attacker",
        memberJob: true,
        previousStatus: "approved",
        newStatus: "approved",
      }),
      {},
    );

    expect(response.status).toBe(200);
    expect(Job.findByIdAndUpdate).toHaveBeenCalledWith(
      "job-1",
      {
        title: "Updated Title",
        jobStatus: "pending",
        modifiedDate: expect.any(Date),
        rejectionMessage: "",
      },
      { new: true },
    );
  });

  test("PUT assigns the approval date on the server when approving a job", async () => {
    mockAuth.role = "spokes_admin";
    (Job.findById as jest.Mock).mockResolvedValue({
      _id: "job-1",
      userId: "user-1",
      jobStatus: "pending",
      rejectionMessage: "",
    });
    (Job.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: "job-1" });

    const response = await PUT(
      jsonRequest("/api/jobs/job-1", {
        previousStatus: "pending",
        newStatus: "approved",
        // A client-provided date must not control the approval timestamp.
        approvedDate: "2020-01-01T00:00:00.000Z",
      }),
      {},
    );

    expect(response.status).toBe(200);
    expect(Job.findByIdAndUpdate).toHaveBeenCalledWith(
      "job-1",
      {
        jobStatus: "approved",
        approvedDate: expect.any(Date),
        modifiedDate: expect.any(Date),
        rejectionMessage: "",
      },
      { new: true },
    );

    const update = (Job.findByIdAndUpdate as jest.Mock).mock.calls[0][1];
    expect(update.approvedDate).not.toEqual(new Date("2020-01-01T00:00:00.000Z"));
  });

  test("PUT repairs an approved job that is missing its approval date", async () => {
    mockAuth.role = "spokes_admin";
    (Job.findById as jest.Mock).mockResolvedValue({
      _id: "job-1",
      userId: "user-1",
      jobStatus: "approved",
      rejectionMessage: "",
    });
    (Job.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: "job-1" });

    const response = await PUT(
      jsonRequest("/api/jobs/job-1", {
        previousStatus: "approved",
        newStatus: "approved",
      }),
      {},
    );

    expect(response.status).toBe(200);
    expect(Job.findByIdAndUpdate).toHaveBeenCalledWith(
      "job-1",
      expect.objectContaining({
        jobStatus: "approved",
        approvedDate: expect.any(Date),
      }),
      { new: true },
    );
  });
});
