import mongoose from "mongoose";

const url: string = process.env.MONGO_URI as string;
let connection: typeof mongoose;

/**
 * Makes a connection to a MongoDB database. If a connection already exists, does nothing
 * Call this function before all api routes
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  if (!connection) {
    // uncomment this line once you have the MONGO_URI set up
    // connection = await mongoose.connect(url);
    connection = "remove me" as any; // remove me
    return connection;
  }
};

export default connectDB;
