import { models, model, Schema } from "mongoose";

//User interface
export interface UserInterface {
  _id: String;
  name: String;
  email: String;
  postedJobs: [String];
  paidMember: Boolean;
  organizationName: String;
}

//User Schema
const UserSchema = new Schema<UserInterface>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  postedJobs: { type: [String], required: true, default: [] },
  paidMember: { type: Boolean, required: true },
  organizationName: { type: String, required: false },
});

//Export Schema
const User = models.User || model("User", UserSchema);
export default User;
