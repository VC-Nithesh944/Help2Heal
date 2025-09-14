import React from "react";
import { assets } from "../assets/assets_admin/assets";

const AddDoctor = () => {
  return (
    <form>
      <p>Add Doctor</p>
      <div>
        <div>
          <label htmlFor="">
            <img src={assets.upload_area} alt=" " />
          </label>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
