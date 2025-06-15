import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGODB_URI}/${process.env.JWT_SECRET}`)
      .then((res) => {
        console.log("MongoDB connected successfully");
      });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
export default connectDB;
