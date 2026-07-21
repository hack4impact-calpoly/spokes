import { isEventLocationCity, isEventLocationGeneral } from "@/lib/eventOptions";

const requiredEventFields = [
  "eventName",
  "date",
  "time",
  "eventLocationGeneral",
  "eventLocationCity",
  "location",
  "description",
  "publicContactEmail",
  "publicContactPhoneNumber",
  "submitterFirstName",
  "submitterLastName",
  "submitterEmail",
  "submitterPhoneNumber",
] as const;

const mutableEventFields = [
  ...requiredEventFields,
  "eventLink",
  "locationLink",
  "eventLocationGeneralOther",
  "eventLocationCityOther",
  "eventImage",
  "organizationIcon",
] as const;

const booleanEventFields = ["majorFundraisingEvent"] as const;

function ensureHttps(url: string) {
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

export function sanitizeEventPayload(payload: Record<string, unknown>) {
  const sanitized: Record<string, string | boolean> = {};

  for (const field of mutableEventFields) {
    const value = payload[field];

    if (typeof value === "string") {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        sanitized[field] = field === "eventLink" || field === "locationLink" ? ensureHttps(trimmedValue) : trimmedValue;
      }
    }
  }

  for (const field of booleanEventFields) {
    const value = payload[field];
    if (typeof value === "boolean") {
      sanitized[field] = value;
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

  if (payload.eventLocationGeneral !== undefined && !isEventLocationGeneral(payload.eventLocationGeneral)) {
    return "eventLocationGeneral must be a valid event location region.";
  }

  if (payload.eventLocationCity !== undefined && !isEventLocationCity(payload.eventLocationCity)) {
    return "eventLocationCity must be a valid event location city.";
  }

  if (payload.eventLocationGeneral === "Other") {
    const otherValue = payload.eventLocationGeneralOther;
    if (typeof otherValue !== "string" || otherValue.trim().length === 0) {
      return "eventLocationGeneralOther is required when eventLocationGeneral is Other.";
    }
  }

  if (payload.eventLocationCity === "Other") {
    const otherValue = payload.eventLocationCityOther;
    if (typeof otherValue !== "string" || otherValue.trim().length === 0) {
      return "eventLocationCityOther is required when eventLocationCity is Other.";
    }
  }

  if (!options.partial && payload.majorFundraisingEvent !== true) {
    return "Please confirm this is one of your organization's major fundraising events of the year.";
  }

  return null;
}
