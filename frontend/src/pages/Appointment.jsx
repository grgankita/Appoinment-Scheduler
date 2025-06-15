import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedProfessionals from "../components/RelatedProfessionals";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { profId } = useParams();
  const {
    userData,
    professionals,
    currencySymbol,
    backendUrl,
    token,
    getProfessionalsData,
  } = useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  const [profInfo, setProfInfo] = useState(null);
  const [profSlots, setProfSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  useEffect(() => {
    if (professionals.length > 0) {
      const foundProf = professionals.find((prof) => prof._id === profId);
      if (foundProf) {
        // Ensure default structure
        foundProf.slots_booked = foundProf.slots_booked || {};
        setProfInfo(foundProf);
      }
    }
  }, [professionals, profId]);

  useEffect(() => {
    if (profInfo) {
      getAvailableSlots();
    }
  }, [profInfo]);

  const getAvailableSlots = () => {
    const today = new Date();
    let tempSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() + 1 > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isSlotAvailable =
          !profInfo.slots_booked[slotDate]?.includes(formattedTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      tempSlots.push(timeSlots);
    }

    setProfSlots(tempSlots);
  };
  // console.log("📦 userData:", userData);

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    const selectedDate = profSlots[slotIndex]?.[0]?.datetime;

    if (!selectedDate || !slotTime) {
      toast.error("Please select a time slot.");
      return;
    }

    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const slotDate = `${day}_${month}_${year}`;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          profId,
          slotDate,
          slotTime,
          userId: userData._id,
          userData: userData.name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getProfessionalsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while booking.");
    }
  };

  return profInfo ? (
    <div>
      {/* Professional Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          className="bg-primary w-full sm:max-w-72 rounded-lg"
          src={profInfo.image}
          alt=""
        />
        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {profInfo.name}{" "}
            <img className="w-4" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {profInfo.degree} - {profInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {profInfo.experience}
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mt-3">About</p>
            <p className="text-sm text-gray-500 mt-1">{profInfo.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-600">
              {currencySymbol} {profInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>
        <div className="flex gap-3 overflow-x-scroll mt-4">
          {profSlots.map(
            (item, index) =>
              item.length > 0 && (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-[#DDDDDD]"
                  }`}
                >
                  <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0].datetime.getDate()}</p>
                </div>
              )
          )}
        </div>

        <div className="flex gap-3 overflow-x-scroll mt-4">
          {profSlots[slotIndex]?.map((item, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime
                  ? "bg-primary text-white"
                  : "text-[#949494] border border-[#B4B4B4]"
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      {/* Related Professionals */}
      <RelatedProfessionals speciality={profInfo.speciality} profId={profId} />
    </div>
  ) : null;
};

export default Appointment;
