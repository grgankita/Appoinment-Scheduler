import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  // useEffect(() => {
  //   if (userData === null && token) {
  //     loadUserProfileData();
  //   }
  // }, [token, userData]);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Show loading while profile data is being fetched
  if (userData === null) {
    return (
      <div className="p-5 text-center text-gray-600">Loading profile...</div>
    );
  }
  console.log("userData:", userData);
  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 h-36 rounded opacity-75"
                src={
                  image
                    ? URL.createObjectURL(image)
                    : userData.image || assets.default_profile
                }
                alt=""
              />
              {!image && (
                <img
                  className="w-10 h-10 absolute bottom-12 right-12"
                  src={assets.upload_area}
                  alt=" "
                />
              )}
            </div>
            <input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.image} alt="profile" />
        )}

        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-[#262626] mt-4">
            {userData.name}
          </p>
        )}

        <hr className="bg-[#ADADAD] h-[1px] border-none" />

        <div>
          <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
            <p className="font-medium">Email id:</p>
            {isEdit ? (
              <input
                className="bg-gray-50 max-w-52"
                type="text"
                value={userData.email}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-500">{userData.email}</p>
            )}
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-50 max-w-52"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-500">{userData.phone}</p>
            )}

            <div className="font-medium">
              <strong>Address:</strong>
            </div>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-50"
                  type="text"
                  value={userData.address?.line1 || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value,
                      },
                    }))
                  }
                />
                <br />
                <input
                  className="bg-gray-50"
                  type="text"
                  value={userData.address?.line2 || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value,
                      },
                    }))
                  }
                />
              </p>
            ) : (
              <div className="text-gray-500">
                {userData?.address?.["line 1"]} <br />{" "}
                {userData?.address?.["line 2"]}
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-28 bg-gray-50 border p-1"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-500">{userData.gender}</p>
            )}

            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-50"
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-500">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <button
              onClick={updateUserProfileData}
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Save information
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
