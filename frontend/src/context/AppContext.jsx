import { createContext, useEffect, useRef, useState } from "react";
export const AppContext = createContext();
import axios from "axios";
import { toast } from "react-toastify";

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
   try {
    const { data } = await axios.get(`${backendUrl}/api/doctor/list`, {
      timeout: 8000 // 8 second timeout
    });

    if (data.success) {
      setDoctors(data.doctors);
    } else {
      toast.error(data.message || "Failed to load doctors");
    }
  } catch (error) {
    console.error("getDoctorsData error:", error);
    // Check for timeout
    if (error.code === 'ECONNABORTED') {
      toast.error("Request timed out - please refresh");
    } else {
      toast.error(error.response?.data?.message || "Failed to load doctors");
    }
    // Set empty array to prevent undefined errors
    setDoctors([]);
  }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData, setUserData,
    loadUserProfileData,
  };

  //we need to run this function whenever the user will be logged in
  useEffect(() => { 
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false)
    }
  }, [token])
  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
