export interface EventRecord {
  id?: string;
  _id?: string;
  date: Date;
  eventName: string;
  time: string;
  location: string;
  locationLink?: string;
  eventLocationGeneral?: string;
  eventLocationGeneralOther?: string;
  eventLocationCity?: string;
  eventLocationCityOther?: string;
  organization: string;
  description: string;
  majorFundraisingEvent?: boolean;
  eventLink?: string;
  publicContactEmail?: string;
  publicContactPhoneNumber?: string;
  submitterFirstName?: string;
  submitterLastName?: string;
  submitterEmail?: string;
  submitterPhoneNumber?: string;
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
