import mongoose, { Schema } from "mongoose";

//User interface
interface UserInterface {
  _id: String;
  name: String;
  email: String;
  isadmin: Boolean;
}

//User Schema
const UserSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isadmin: { type: Boolean, required: true },
});

//Export Schema
export default mongoose.models.User || mongoose.model("User", UserSchema);
