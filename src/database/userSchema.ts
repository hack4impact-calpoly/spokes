import { models, model, Schema } from "mongoose";

//User interface
export interface UserInterface {
  _id: String;
  name: String;
  email: String;
  postedJobs: [String];
  postedEvents: [String];
  paidMember: Boolean;
  organizationName: String;
}

//User Schema
const UserSchema = new Schema<UserInterface>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  postedJobs: { type: [String], required: true, default: [] },
  postedEvents: { type: [String], required: false, default: [] },
  paidMember: { type: Boolean, required: true },
  organizationName: { type: String, required: false, index: true },
});

//Export Schema
const User = models.User || model("User", UserSchema);
export default User;
