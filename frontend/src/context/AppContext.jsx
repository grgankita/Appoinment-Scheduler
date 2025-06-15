import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { professionals as initialProfessionals } from "../assets/assets.js";

export const AppContext = createContext();
const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [professionals, setProfessionals] = useState(initialProfessionals);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  // Getting professionals using API
  const getProfessionalsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/professional/list");
      if (data.success) {
        setProfessionals(data.professionals);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Getting User Profile using API
  const loadUserProfileData = async () => {
    try {
      console.log("Calling API with token:", token);

      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getProfessionalsData();
  }, []);

  useEffect(() => {
    console.log("🔥 Token changed:", token);
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value = {
    professionals,
    getProfessionalsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
