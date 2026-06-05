export interface EventRecord {
  id?: string;
  _id?: string;
  date: Date;
  eventName: string;
  time: string;
  location: string;
  locationLink?: string;
  locationType: "remote" | "in-person";
  organization: string;
  description: string;
  eventLink?: string;
  eventImage?: string;
  organizationIcon?: string;
  createdByUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventApiRecord = Omit<EventRecord, "date" | "createdAt" | "updatedAt"> & {
  date: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
