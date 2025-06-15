import express from "express";
import cors from "cors";
import "dotenv/config";
// import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import professionalRouter from "./routes/professionalRoute.js";
import adminRouter from "./routes/adminRoute.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {
  EsewaInitiatePayment,
  paymentStatus,
} from "./controllers/esewaController.js";
import connectDB from "./DB/ev.js";

dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4001;
connectDB();
connectCloudinary();

app.get("/", (req, res) => {
  res.send("API is reachable ");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middlewares
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//http://localhost:4001/api/admin/add-professional
// api endpoints
app.use("/api/user", userRouter);
console.log("Mounted /api/admin routes");
app.use("/api/admin", adminRouter);
app.use("/api/professional", professionalRouter);
app.post("/initiate-payment", EsewaInitiatePayment);
app.post("/payment-status", paymentStatus);

app.post("/", (req, res) => {
  res.send("API Working ");
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));
