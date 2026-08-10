import { getEventsAdminUrl, getJobsAdminUrl, getJobsListUrl } from "@/lib/url";

describe("admin URLs", () => {
  const originalAdminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
  const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    if (originalAdminUrl === undefined) {
      delete process.env.NEXT_PUBLIC_ADMIN_URL;
    } else {
      process.env.NEXT_PUBLIC_ADMIN_URL = originalAdminUrl;
    }

    if (originalApiBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
    }
  });

  it("uses the configured host with the correct board path", () => {
    process.env.NEXT_PUBLIC_ADMIN_URL = "https://board.example.com/admin";
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    expect(getJobsAdminUrl()).toBe("https://board.example.com/jobs/admin");
    expect(getEventsAdminUrl()).toBe("https://board.example.com/events/admin");
    expect(getJobsListUrl()).toBe("https://board.example.com/jobs/list");
  });

  it("falls back to the API base URL when no admin URL is configured", () => {
    delete process.env.NEXT_PUBLIC_ADMIN_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://board.example.com";

    expect(getEventsAdminUrl()).toBe("https://board.example.com/events/admin");
  });
});
