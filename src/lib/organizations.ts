import Event from "@/database/eventSchema";
import Job from "@/database/jobSchema";
import User from "@/database/userSchema";

export function normalizeOrganizationNames(organizationNames: unknown[]) {
  const organizationsByNormalizedName = new Map<string, string>();

  for (const organizationName of organizationNames) {
    if (typeof organizationName !== "string") {
      continue;
    }

    const trimmedOrganizationName = organizationName.trim();
    if (!trimmedOrganizationName) {
      continue;
    }

    const normalizedOrganizationName = trimmedOrganizationName.toLowerCase();
    if (!organizationsByNormalizedName.has(normalizedOrganizationName)) {
      organizationsByNormalizedName.set(normalizedOrganizationName, trimmedOrganizationName);
    }
  }

  return Array.from(organizationsByNormalizedName.values()).sort((a, b) => a.localeCompare(b));
}

export async function getExistingOrganizationNames() {
  const [userOrgs, eventOrgs, jobOrgs] = await Promise.all([
    User.distinct("organizationName", {
      organizationName: { $exists: true, $type: "string", $ne: "" },
    }),
    Event.distinct("organization", {
      organization: { $exists: true, $type: "string", $ne: "" },
    }),
    Job.distinct("organizationName", {
      organizationName: { $exists: true, $type: "string", $ne: "" },
    }),
  ]);

  return normalizeOrganizationNames([...userOrgs, ...eventOrgs, ...jobOrgs]);
}

export function getCanonicalOrganizationName(organizationName: string, existingOrganizationNames: string[]) {
  const trimmedOrganizationName = organizationName.trim();
  if (!trimmedOrganizationName) {
    return "";
  }

  return (
    existingOrganizationNames.find(
      (existingOrganizationName) =>
        existingOrganizationName.trim().toLowerCase() === trimmedOrganizationName.toLowerCase(),
    ) ?? trimmedOrganizationName
  );
}

export async function resolveOrganizationName(organizationName: string) {
  return getCanonicalOrganizationName(organizationName, await getExistingOrganizationNames());
}
