import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [aToken, setAToken] = useState(localStorage.getItem("adminToken"));

  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log(" Admin token in context:", aToken);

  // Getting all professionals data from Database using API
  const getAllProfessionals = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-professionals",
        {},
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      if (data.success) {
        setProfessionals(data.professionals);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to change prof. availability using API
  const changeAvailability = async (profId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { profId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllProfessionals();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Getting all appointment data from Database using API
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/appointments",
        {},
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Function to cancel appointment using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Getting Admin Dashboard data from Database using API
  const getDashData = async () => {
    try {
      console.log(" Sending token to backend:", aToken);
      const { data } = await axios.post(
        backendUrl + "/api/admin/dashboard",
        {},
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      console.log(" Dashboard response:", data);
      setDashData(data.dashData);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAToken(token);
    }
    setLoading(false); // after checking token
  }, []);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const value = {
    aToken,
    setAToken,
    professionals,
    getAllProfessionals,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    dashData,
    getDashData,
    cancelAppointment,
    // getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
