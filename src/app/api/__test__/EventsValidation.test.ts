import { sanitizeEventPayload, validateEventPayload } from "@/lib/events";

describe("event validation service", () => {
  test("accepts optional event links and normalizes missing protocols", () => {
    const payload = {
      eventName: "Community Workshop",
      date: "2026-02-27",
      time: "6:00 PM",
      location: "Innovation Hub",
      locationType: "in-person",
      description: "A useful workshop.",
      eventLink: "example.com/community-workshop",
      locationLink: "maps.example.com/innovation-hub",
    };

    expect(validateEventPayload(payload)).toBeNull();
    expect(sanitizeEventPayload(payload)).toEqual({
      eventName: "Community Workshop",
      date: "2026-02-27",
      time: "6:00 PM",
      location: "Innovation Hub",
      locationType: "in-person",
      description: "A useful workshop.",
      eventLink: "https://example.com/community-workshop",
      locationLink: "https://maps.example.com/innovation-hub",
    });
  });
});
