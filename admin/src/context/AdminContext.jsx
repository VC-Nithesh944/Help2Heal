import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  //To prevent going back to admin login on reload, we will set aToken using LocalStorage of Application
  //   const [aToken, setAToken] = useState("");
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const value = {
    aToken,
    setAToken,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
