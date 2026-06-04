import Event from "@/database/eventSchema";
import Job from "@/database/jobSchema";
import User from "@/database/userSchema";
import { getCanonicalOrganizationName, getExistingOrganizationNames } from "@/lib/organizations";

jest.mock("@/database/eventSchema", () => ({
  __esModule: true,
  default: {
    distinct: jest.fn(),
  },
}));

jest.mock("@/database/jobSchema", () => ({
  __esModule: true,
  default: {
    distinct: jest.fn(),
  },
}));

jest.mock("@/database/userSchema", () => ({
  __esModule: true,
  default: {
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
});
