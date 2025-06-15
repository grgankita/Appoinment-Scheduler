import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import professionalModel from "../models/professionalModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
console.log("professionalModel imported:", typeof professionalModel);
// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      //   expiresIn: "1h",
      // });
      const token = jwt.sign(
        {
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find().sort({ createdAt: -1 }); // get all, latest first

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments, // this goes to frontend
    });
  } catch (error) {
    console.error(" Failed to fetch appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
    });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for adding Professional
const addProfessional = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add Professional
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const ProfessionalData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newProfessional = new professionalModel(ProfessionalData);
    await newProfessional.save();
    res.json({ success: true, message: "Professional Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allProfessionals = async (req, res) => {
  console.log(" allProfessionals route handler reached");

  const professionals = await professionalModel.find({}).select("-password");
  res.json({ success: true, professionals });
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const professionals = await professionalModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      professionals: professionals.length,
      appointments: appointments.length,
      clients: users.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addProfessional,
  allProfessionals,
  adminDashboard,
};
