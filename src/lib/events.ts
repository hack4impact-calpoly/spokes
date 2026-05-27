const requiredEventFields = ["eventName", "date", "time", "location", "locationType", "description"] as const;

const mutableEventFields = [...requiredEventFields, "eventImage", "organizationIcon"] as const;

export function sanitizeEventPayload(payload: Record<string, unknown>) {
  const sanitized: Record<string, string> = {};

  for (const field of mutableEventFields) {
    const value = payload[field];

    if (typeof value === "string") {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        sanitized[field] = trimmedValue;
      }
    }
  }

  return sanitized;
}

export function validateEventPayload(payload: Record<string, unknown>, options: { partial?: boolean } = {}) {
  if (!options.partial) {
    const missingFields = requiredEventFields.filter((field) => {
      const value = payload[field];
      return typeof value !== "string" || value.trim().length === 0;
    });

    if (missingFields.length > 0) {
      return `Missing required fields: ${missingFields.join(", ")}`;
    }
  }

  if (payload.date !== undefined && Number.isNaN(new Date(payload.date as string).getTime())) {
    return "date must be a valid date string.";
  }

  if (payload.locationType !== undefined && payload.locationType !== "remote" && payload.locationType !== "in-person") {
    return "locationType must be either remote or in-person.";
  }

  return null;
}
