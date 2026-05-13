export interface EventRecord {
  id?: string;
  _id?: string;
  date: Date;
  eventName: string;
  time: string;
  location: string;
  locationType: "remote" | "in-person";
  category: string;
  organization: string;
  description: string;
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
