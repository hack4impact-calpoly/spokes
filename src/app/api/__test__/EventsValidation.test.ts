import { sanitizeEventPayload, validateEventPayload } from "@/lib/events";

describe("event validation service", () => {
  const validPayload = {
    eventName: "Community Workshop",
    date: "2026-02-27",
    time: "6:00 PM",
    location: "Innovation Hub",
    locationType: "in-person",
    eventLocationGeneral: "San Luis Obispo Area",
    eventLocationCity: "San Luis Obispo",
    majorFundraisingEvent: true,
    description: "A useful workshop.",
    eventLink: "example.com/community-workshop",
    locationLink: "maps.example.com/innovation-hub",
    publicContactEmail: "attendee@example.com",
    publicContactPhoneNumber: "805-555-0101",
    submitterFirstName: "Alex",
    submitterLastName: "Morgan",
    submitterEmail: "alex@example.com",
    submitterPhoneNumber: "805-555-0102",
  };

  test("accepts optional event links and normalizes missing protocols", () => {
    expect(validateEventPayload(validPayload)).toBeNull();
    expect(sanitizeEventPayload(validPayload)).toEqual({
      eventName: "Community Workshop",
      date: "2026-02-27",
      time: "6:00 PM",
      location: "Innovation Hub",
      locationType: "in-person",
      eventLocationGeneral: "San Luis Obispo Area",
      eventLocationCity: "San Luis Obispo",
      majorFundraisingEvent: true,
      description: "A useful workshop.",
      eventLink: "https://example.com/community-workshop",
      locationLink: "https://maps.example.com/innovation-hub",
      publicContactEmail: "attendee@example.com",
      publicContactPhoneNumber: "805-555-0101",
      submitterFirstName: "Alex",
      submitterLastName: "Morgan",
      submitterEmail: "alex@example.com",
      submitterPhoneNumber: "805-555-0102",
    });
  });

  test("requires the major fundraising event confirmation for new events", () => {
    expect(validateEventPayload({ ...validPayload, majorFundraisingEvent: false })).toBe(
      "Please confirm this is one of your organization's major fundraising events of the year.",
    );

    expect(validateEventPayload({ majorFundraisingEvent: false }, { partial: true })).toBeNull();
  });
});
