export const EVENT_LOCATION_GENERAL_OPTIONS = [
  "San Luis Obispo Area",
  "North Coast",
  "South Coast",
  "North County",
  "Other",
] as const;

export const EVENT_LOCATION_CITY_OPTIONS = [
  "San Luis Obispo",
  "Edna Valley",
  "Morro Bay",
  "Los Osos",
  "Cayucos",
  "Cambria",
  "Harmony",
  "San Simeon",
  "Ragged Point",
  "Avila Beach",
  "Shell Beach",
  "Pismo Beach",
  "Arroyo Grande",
  "Grover Beach",
  "Oceano",
  "Nipomo",
  "Santa Margarita",
  "Atascadero",
  "Templeton",
  "Paso Robles",
  "San Miguel",
  "Creston",
  "Shandon",
  "Other",
] as const;

export type EventLocationGeneral = (typeof EVENT_LOCATION_GENERAL_OPTIONS)[number];
export type EventLocationCity = (typeof EVENT_LOCATION_CITY_OPTIONS)[number];

export const EVENT_LOCATION_GENERAL_DESCRIPTIONS: Record<EventLocationGeneral, string> = {
  "San Luis Obispo Area": "San Luis Obispo & Edna Valley",
  "North Coast": "Morro Bay, Los Osos, Cayucos, Cambria, Harmony, San Simeon, Ragged Point, etc.",
  "South Coast": "Avila Beach, Shell Beach, Pismo Beach, Arroyo Grande, Grover Beach, Oceano, Nipomo, etc.",
  "North County": "Santa Margarita, Atascadero, Templeton, Paso Robles, San Miguel, Creston, Shandon, etc.",
  Other: "Other",
};

export function isEventLocationGeneral(value: unknown): value is EventLocationGeneral {
  return typeof value === "string" && EVENT_LOCATION_GENERAL_OPTIONS.includes(value as EventLocationGeneral);
}

export function isEventLocationCity(value: unknown): value is EventLocationCity {
  return typeof value === "string" && EVENT_LOCATION_CITY_OPTIONS.includes(value as EventLocationCity);
}
