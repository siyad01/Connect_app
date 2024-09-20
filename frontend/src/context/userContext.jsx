/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  async function registerUser(formData, navigate) {
    try {
      // Make sure that you're sending the form data with the appropriate content-type
      const { data } = await axios.post("/api/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      localStorage.setItem("authToken", data.token);

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, navigate) {
    setBtnLoading(true)
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      localStorage.setItem("authToken", data.token);

    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  const [Loading, setLoading] = useState("");
  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setLoading(true);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }
  async function updateUser(formData, navigate) {
    try {
      const { data } = await axios.put("/api/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set appropriate headers for form data
        },
      });

      toast.success(data.message);
      setUser(data.user); // Update local user state with the new data
      setIsAuth(true); // Set user authentication status
      setBtnLoading(false); // Stop loading animation/button
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
      setBtnLoading(false); // Stop loading animation/button on error
    }
  }

  async function addData(formData, navigate) {
    try {
      const { data } = await axios.post("/api/user/add-data", formData);
      toast.success(data.message);
      setUser(data.user); // Update local user state with the new data
      setIsAuth(true); // Set user authentication status
    } catch (error) {
      toast.error(error.response?.data?.message || "Data adding failed");
      setBtnLoading(false); // Stop loading animation/button on error
    }
  }

  async function addSkillData(skillName, skillLevel, navigate) {
    try {
      const { data } = await axios.post("/api/user/add-skilldata", {
        skillName,
        skillLevel,
      });
      toast.success(data.message);
      setUser(data.user);
      //setIsAuth(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Data adding failed");
      setBtnLoading(false); // St
    }
  }

  async function addCertificationData(certName, issuedDate, navigate) {
    try {
      const { data } = await axios.post("/api/user/add-certificatesdata", {
        certName,
        issuedDate,
      });
      toast.success(data.message);
      setUser(data.user);
      //setIsAuth(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Data adding failed");
      setBtnLoading(false); // St
    }
  }
  return (
    <UserContext.Provider
      value={{
        registerUser,
        loginUser,
        isAuth,
        Loading,
        user,
        updateUser,
        addData,
        addSkillData,
        addCertificationData,
        setIsAuth,
        setUser,
        fetchUser
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
