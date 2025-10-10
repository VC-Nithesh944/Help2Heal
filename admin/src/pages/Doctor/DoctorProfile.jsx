import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { currency, backendUrl } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);
  return (
    profileData && (
      <div>
        <div>
          <div>
            <img src={profileData.image} alt="" />
          </div>
          <div>
            {/* DocInfo Name Degree and Experience  */}
            <p>{profileData.name}</p>
            <div>
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button>{profileData.experience}</button>
            </div>

            {/* Doctor About  */}
            <div>
              <p>About:</p>
              <p>{profileData.about}</p>
            </div>

            <p>
              Appointment Fees:{" "}
              <span>
                {currency} {profileData.fees}
              </span>
            </p>
            <div>
              <p>Address: </p>
              <p>{profileData.address.line1}</p>
              <p>{profileData.address.line2}</p>
            </div>
            <div>
              <input type="checkbox" />
              <label htmlFor="">Available</label>
            </div>

            <button>Edit</button>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
