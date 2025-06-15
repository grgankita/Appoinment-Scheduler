import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import professionalModel from "../models/professionalModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking for all data to register user
    if (!name || !email || !password) {
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

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token: token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId; // from token, not from body

    console.log(" Received userId:", userId);

    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    //  Upload image if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    // Perform one update
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile Updated", updatedUser });
  } catch (error) {
    console.log(" Update error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, profId, slotDate, slotTime } = req.body;
    const profData = await professionalModel
      .findById(profId)
      .select("-password");

    if (!profData.available) {
      return res.json({
        success: false,
        message: "professional Not Available",
      });
    }

    let slots_booked = profData.slots_booked;

    // checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete profData.slots_booked;

    const appointmentData = {
      userId,
      profId,
      userData,
      profData,
      amount: profData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in profData
    await professionalModel.findByIdAndUpdate(profId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const userId = req.userId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    console.log(" appointmentData.userId:", appointmentData.userId);
    console.log(" req.userId:", userId);

    // verify appointment user
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing professional slot
    const { profId, slotDate, slotTime } = appointmentData;

    const professionalData = await professionalModel.findById(profId);

    let slots_booked = professionalData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await professionalModel.findByIdAndUpdate(profId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
};
