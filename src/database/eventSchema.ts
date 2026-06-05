import { deleteModel, models, model, Schema } from "mongoose";

// The status of the event
export enum EventStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
  expired = "expired",
}

export interface IEvent {
  _id: string;
  date: Date;
  eventName: string;
  time: string;
  location: string;
  locationLink?: string;
  locationType: "remote" | "in-person";
  description: string;
  eventLink?: string;
  organization: string;
  eventImage?: string;
  organizationIcon?: string;
  createdByUserId: string;
  eventStatus: string;
  approvedDate?: Date;
  rejectionMessage?: string;
  contactName?: string;
  contactEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    date: { type: Date, required: true },
    eventName: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    locationLink: { type: String, required: false, trim: true },
    locationType: { type: String, required: true, enum: ["remote", "in-person"], trim: true },
    description: { type: String, required: true, trim: true },
    eventLink: { type: String, required: false, trim: true },
    organization: { type: String, required: true, trim: true },
    eventImage: { type: String, required: false, trim: true },
    organizationIcon: { type: String, required: false, trim: true },
    createdByUserId: { type: String, required: true },
    eventStatus: { type: String, enum: Object.values(EventStatus), required: true, default: "pending" },
    approvedDate: { type: Date, required: false },
    rejectionMessage: { type: String, required: false },
    contactName: { type: String, required: false },
    contactEmail: { type: String, required: false },
  },
  { timestamps: true },
);

EventSchema.index(
  { createdByUserId: 1, organization: 1, date: 1, eventName: 1, time: 1, location: 1 },
  { unique: true },
);

if (models.Event && (!models.Event.schema.path("eventLink") || !models.Event.schema.path("locationLink"))) {
  deleteModel("Event");
}

const Event = models.Event || model("Event", EventSchema, "events");
export default Event;
