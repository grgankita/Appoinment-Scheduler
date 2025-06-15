import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { ProfessionalsContext } from "../context/ProfessionalsContext";
import { AdminContext } from "../context/AdminContext";

const Sidebar = () => {
  const { pToken } = useContext(ProfessionalsContext);
  const { aToken } = useContext(AdminContext);

  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to={"/admin-dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img className="min-w-5" src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            to={"/all-appointments"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img className="w-7 h-7" src={assets.booking_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            to={"/add-Professional"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img className="min-w-5" src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Professional</p>
          </NavLink>

          <NavLink
            to={"/Professional-list"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img className="min-w-5" src={assets.people_icon} alt="" />
            <p className="hidden md:block">Professionals List</p>
          </NavLink>
        </ul>
      )}

      {pToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to={"/Professional-dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img className="min-w-5" src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            to={"/Professional-appointments"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img className="w-7 h-7" src={assets.booking_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            to={"/Professional-profile"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img className="min-w-5" src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
