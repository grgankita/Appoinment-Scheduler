import express from "express";
import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addProfessional,
  allProfessionals,
  adminDashboard,
} from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/professionalController.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-professional", upload.single("image"), addProfessional);

adminRouter.post("/all-professionals", authAdmin, allProfessionals);
adminRouter.post("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/dashboard", authAdmin, adminDashboard);
console.log("✅ adminRoutes loaded");

adminRouter.post("/test", (req, res) => {
  console.log(" test route hit");
  res.json({ success: true, message: "Test route works" });
});

export default adminRouter;
