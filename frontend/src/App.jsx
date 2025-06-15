import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Professionals from "./pages/Professionals";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Failure from "./components/failure";
import EsewaPayment from "./components/Payment";
import Success from "./components/Success";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Professionals" element={<Professionals />} />
        <Route path="/Professionals/:speciality" element={<Professionals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment/:profId" element={<Appointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/esewa-payment" element={<EsewaPayment />} />

        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failure" element={<Failure />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
