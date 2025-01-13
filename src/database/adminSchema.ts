import mongoose, { Schema } from "mongoose";

//Admin interface
interface AdminInterface {
  name: String;
  email: String;
  password: String;
}

//Admin Schema
const AdminSchema = new Schema<AdminInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Export Schema
export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
