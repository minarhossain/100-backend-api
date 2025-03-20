import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { DB_NAME } from "../constants.js";

// console.log(process.env.MONGODB_URL);

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("DB Connected");
  } catch (error) {
    console.log("MongoDB Connection fail :", error);
  }
};

export default connectDB;
