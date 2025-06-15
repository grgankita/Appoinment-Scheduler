import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ProfessionalsContext = createContext();

const ProfessionalsContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [pToken, setPToken] = useState(
    localStorage.getItem("pToken") ? localStorage.getItem("pToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Getting Professional appointment data from Database using API
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/professional/appointments",
        { headers: { Authorization: `Bearer ${pToken}` } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Getting Professional profile data from Database using API
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/Professional/profile",
        {
          headers: { Authorization: `Bearer ${pToken}` },
        }
      );
      console.log(data.profileData);
      setProfileData(data.profileData);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to cancel Professional appointment using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/professional/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${pToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        // after creating dashboard
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Function to Mark appointment completed using API
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/professional/complete-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${pToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        // Later after creating getDashData Function
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Getting Professional dashboard data using API
  const getDashData = async () => {
    console.log("📤 Getting Dashboard Data with token:", pToken);
    try {
      const { data } = await axios.get(
        backendUrl + "/api/professional/dashboard",
        {
          headers: { Authorization: `Bearer ${pToken}` },
        }
      );
      console.log("📦 Dashboard data:", data);
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    pToken,
    setPToken,
    backendUrl,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <ProfessionalsContext.Provider value={value}>
      {props.children}
    </ProfessionalsContext.Provider>
  );
};

export default ProfessionalsContextProvider;
