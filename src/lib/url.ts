function getAdminUrl(path: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  const appUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (appUrl) {
    return new URL(path, appUrl).toString();
  }

  return new URL(path, "http://localhost:3000").toString();
}

export function getJobsAdminUrl() {
  return getAdminUrl("/jobs/admin");
}

export function getEventsAdminUrl() {
  return getAdminUrl("/events/admin");
}

export function getJobsListUrl() {
  return getAdminUrl("/jobs/list");
}
