import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets.js";
// import { generateUniqueId } from "esewajs";

// const navigate = useNavigate();

// on click of button/icon

const MyAppointments = () => {
  const { backendUrl, token, professionals, getProfessionalsData } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const goToEsewa = () => {
    navigate("/esewa-payment");
  };
  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  console.log("→ GET:", `${backendUrl}/api/user/appointments`);

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Appointments received:", data);
      // setAppointments(data.appointments.reverse());
      if (data.appointments) {
        setAppointments(data.appointments.reverse());
      } else {
        console.warn("No appointments found in response", data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getProfessionalsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      console.log("token in useEffect:", token);
      getUserAppointments();
    }
  }, [token]);

  useEffect(() => {
    setAppointments([
      {
        _id: "123",
        profData: {
          image: assets.prof3,
          name: "Sabina Thapa",
          speciality: "Massage Therapist",
          address: {
            line1: "Durbar Marg",
            line2: "Kathmandu, Nepal - 44600",
          },
        },
        slotDate: "21_05_2025",
        slotTime: "10:30 AM",
        cancelled: false,
        payment: false,
        isCompleted: false,
      },
    ]);
  }, []);
  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My appointments
      </p>
      <div className="">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            <div>
              <img
                className="w-36 bg-[#EAEFFF]"
                src={item.profData?.image || assets.default_profile}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.profData?.name || "N/A"}
              </p>
              <p>{item.profData.speciality || "N/A"}</p>
              <p className="text-[#464646] font-medium mt-1">Address:</p>
              <p className="">{item.profData.address.line1}</p>
              <p className="">{item.profData.address.line2}</p>
              <p className=" mt-1">
                <span className="text-sm text-[#3C3C3C] font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                payment !== item._id && (
                  <button
                    onClick={() => setPayment(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}

              {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                payment === item._id && (
                  <button
                    onClick={goToEsewa}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <img
                      className="max-w-20 max-h-5"
                      src={assets.esewa_icon}
                      alt="eSewa"
                    />
                  </button>
                )}

              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]">
                  Paid
                </button>
              )}

              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}

              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyAppointments;
