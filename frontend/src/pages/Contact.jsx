import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-700">
        <p>
          CONTACT <span className="text-gray-900 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px] shadow-gray-400 shadow-lg rounded"
          src={assets.contact_image}
          alt=""
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-500">
            576230 Flyover Station <br /> Suite 350, Karnataka, India
          </p>
          <p className="text-gray-500">
            Tel: (415) 555-0132 <br /> help2heal@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600">
            CAREERS AT HELP2HEAL
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm rounded hover:bg-black hover:text-white transition-all duration-500 active:bg-black active:text-white active:duration-100">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
