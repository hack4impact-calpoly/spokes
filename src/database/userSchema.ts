import { models, model, Schema } from "mongoose";

//User interface
interface UserInterface {
  _id: String;
  name: String;
  email: String;
  isadmin: Boolean;
  postedJobs: [String];
  paidMember: Boolean;
  organizationName: String;
}

//User Schema
const UserSchema = new Schema<UserInterface>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isadmin: { type: Boolean, required: true },
  postedJobs: { type: [String], required: true, default: [] },
  paidMember: { type: Boolean, required: true },
  organizationName: { type: String, required: true },
});

//Export Schema
const User = models.User || model("User", UserSchema);
export default User;
