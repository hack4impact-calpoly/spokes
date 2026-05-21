import { models, model, Schema } from "mongoose";

export interface IEvent {
  _id: string;
  date: Date;
  eventName: string;
  time: string;
  location: string;
  locationType: "remote" | "in-person";
  description: string;
  organization: string;
  eventImage?: string;
  organizationIcon?: string;
  createdByUserId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    date: { type: Date, required: true },
    eventName: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    locationType: { type: String, required: true, enum: ["remote", "in-person"], trim: true },
    description: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    eventImage: { type: String, required: false, trim: true },
    organizationIcon: { type: String, required: false, trim: true },
    createdByUserId: { type: String, required: true },
  },
  { timestamps: true },
);

EventSchema.index(
  { createdByUserId: 1, organization: 1, date: 1, eventName: 1, time: 1, location: 1 },
  { unique: true },
);

const Event = models.Event || model("Event", EventSchema, "events");
export default Event;
