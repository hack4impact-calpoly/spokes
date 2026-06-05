import Event from "@/database/eventSchema";
import Job from "@/database/jobSchema";
import User from "@/database/userSchema";
import {
  deleteOrganizationData,
  getCanonicalOrganizationName,
  getExistingOrganizationNames,
} from "@/lib/organizations";

jest.mock("@/database/eventSchema", () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
    distinct: jest.fn(),
  },
}));

jest.mock("@/database/jobSchema", () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
    distinct: jest.fn(),
  },
}));

jest.mock("@/database/userSchema", () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
    distinct: jest.fn(),
  },
}));

describe("organization helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getExistingOrganizationNames combines users, events, and jobs", async () => {
    (User.distinct as jest.Mock).mockResolvedValue(["Alpha Org", " beta org "]);
    (Event.distinct as jest.Mock).mockResolvedValue(["Event Only Org", "alpha org"]);
    (Job.distinct as jest.Mock).mockResolvedValue(["Job Only Org", ""]);

    await expect(getExistingOrganizationNames()).resolves.toEqual([
      "Alpha Org",
      "beta org",
      "Event Only Org",
      "Job Only Org",
    ]);

    expect(User.distinct).toHaveBeenCalledWith("organizationName", {
      organizationName: { $exists: true, $type: "string", $ne: "" },
    });
    expect(Event.distinct).toHaveBeenCalledWith("organization", {
      organization: { $exists: true, $type: "string", $ne: "" },
    });
    expect(Job.distinct).toHaveBeenCalledWith("organizationName", {
      organizationName: { $exists: true, $type: "string", $ne: "" },
    });
  });

  test("getCanonicalOrganizationName preserves existing casing or returns the trimmed typed name", () => {
    expect(getCanonicalOrganizationName(" alpha org ", ["Alpha Org"])).toBe("Alpha Org");
    expect(getCanonicalOrganizationName(" New Org ", ["Alpha Org"])).toBe("New Org");
  });

  test("deleteOrganizationData deletes users, events, and jobs for the organization", async () => {
    (User.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });
    (Event.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 3 });
    (Job.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 4 });

    await expect(deleteOrganizationData(" Alpha Org ")).resolves.toEqual({
      usersDeleted: 2,
      eventsDeleted: 3,
      jobsDeleted: 4,
    });

    expect(User.deleteMany).toHaveBeenCalledWith({ organizationName: /^Alpha Org$/i });
    expect(Event.deleteMany).toHaveBeenCalledWith({ organization: /^Alpha Org$/i });
    expect(Job.deleteMany).toHaveBeenCalledWith({ organizationName: /^Alpha Org$/i });
  });
});
