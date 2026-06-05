const eventInfoLinkFields = ["eventLink", "eventUrl", "eventURL", "infoLink", "detailLink", "detailsLink"] as const;
const eventLocationLinkFields = [
  "locationLink",
  "locationUrl",
  "locationURL",
  "meetingLink",
  "meetingUrl",
  "meetingURL",
] as const;

function getStringField(source: unknown, fields: readonly string[]) {
  if (!source || typeof source !== "object") return undefined;

  const record = source as Record<string, unknown>;
  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      if (trimmedValue) return trimmedValue;
    }
  }

  return undefined;
}

export function getEventInfoLink(event: unknown) {
  return getStringField(event, eventInfoLinkFields);
}

export function getEventLocationLink(event: unknown) {
  return getStringField(event, eventLocationLinkFields);
}
