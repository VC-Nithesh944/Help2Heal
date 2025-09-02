import React from "react";
import { doctors } from "../assets/assets_frontend/assets";

const TopDoctors = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img className="bg-blue-50" src={item.image} alt={item.name} />
            <div className="p-4 flex flex-col items-center">
              <p className="text-blue-700 font-semibold">Available</p>
              <p className="text-blue-700 font-semibold">{item.name}</p>
              <p className="text-blue-700 font-semibold">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button>more</button>
    </div>
  );
};

export default TopDoctors;
