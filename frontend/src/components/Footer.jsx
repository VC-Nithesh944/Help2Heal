import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/*-----Left section-----*/}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Help to Heal brings doctors and patients closer with simple, secure
            booking. Easily schedule, manage, and track appointments anytime,
            anywhere. Your health, our priority — making care accessible for
            everyone.
          </p>
        </div>
        {/*----middle section----*/}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/*-----right section-----*/}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>91+987654321</li>
            <li>help2heal@gmail.com</li>
          </ul>
        </div>
      </div>
      {/*-----copyright text-----*/}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          © 2024 Help2Heal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
