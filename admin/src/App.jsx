import React, { useContext } from "react";
import { ProfessionalsContext } from "./context/ProfessionalsContext";
import { AdminContext } from "./context/AdminContext";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddProfessional from "./pages/Admin/AddProfessional";
import ProfessionalsList from "./pages/Admin/ProfessionalsList";
import Login from "./pages/Login";
import ProfessionalAppointments from "./pages/Professionals/ProfesssionalAppointments";
import ProfessionalDashboard from "./pages/Professionals/ProfesssionalDashboard";
import ProfessionalProfile from "./pages/Professionals/ProfesssionalProfile";

const App = () => {
  const { pToken } = useContext(ProfessionalsContext);
  const { aToken } = useContext(AdminContext);

  return pToken || aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-Professional" element={<AddProfessional />} />
          <Route path="/Professional-list" element={<ProfessionalsList />} />
          <Route
            path="/Professional-dashboard"
            element={<ProfessionalDashboard />}
          />
          <Route
            path="/Professional-appointments"
            element={<ProfessionalAppointments />}
          />
          <Route
            path="/Professional-profile"
            element={<ProfessionalProfile />}
          />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  );
};

export default App;
