export function getAdminUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  const appUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (appUrl) {
    return new URL("/admin", appUrl).toString();
  }

  return "http://localhost:3000/admin";
}
