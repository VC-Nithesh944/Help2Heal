import React, { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: "richardjameswap@gmail.com",
    phone: "+1 123 456 789",
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Church Road, London",
    },
    gender: "Male",
    dob: "2001-01-25",
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="p-6 flex items-center bg-sky-200 rounded-lg shadow-2xl mb-4">
      <div className="max-w-lg flex flex-col gap-2 text-sm mx-10">
        <div className="relative p-1 w-48 h-48">
          <img
            className="w-full h-full rounded-full"
            src={userData.image}
            alt=""
          />
          <span className="absolute inset-0 rounded-full ring-5 ring-[#15d9fc] pointer-events-none"></span>
        </div>
        {isEdit ? (
          <input
            className="bg-sky-100 text-3xl font-medium max-w-60 mt-4 rounded px-3"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}

        <hr className="bg-black h-[1px] border-none" />
        <div>
          <p className="text-gray-900 text-lg mt-1">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 gap-x-15 mt-3 text-neutral-700">
            <p className="font-medium">EMAIL ID:</p>
            <p className=" text-blue-500">{userData.email}</p>
            <p className=" font-medium">PHONE:</p>
            {isEdit ? (
              <input
                className=" bg-sky-100 rounded max-w-52"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-500">{userData.phone}</p>
            )}
            <p className="font-medium">ADDRESS:</p>
            {isEdit ? (
              <p>
                <input
                  className="bg-sky-100"
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <br />
                <input
                  className="bg-sky-100"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  type="text"
                />
              </p>
            ) : (
              <p className="text-gray-800">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-gray-900 text-lg mt-1">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 gap-x-15 text-neutral-700 mt-3 ">
            <p className="font-medium ">GENDER:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-sky-100"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            ) : (
              <p className="text-gray-800">{userData.gender}</p>
            )}
            <p className="font-medium">BIRTHDAY:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-sky-100"
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-800">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          {isEdit ? (
            <button
              className="border font-medium cursor-pointer border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white"
              onClick={() => setIsEdit(false)}
            >
              SAVE
            </button>
          ) : (
            <button
              className="border font-medium cursor-pointer border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white"
              onClick={() => setIsEdit(true)}
            >
              EDIT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
