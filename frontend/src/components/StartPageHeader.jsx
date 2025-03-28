import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const StartPageHeader = () => {
  const token = localStorage.getItem("token");
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  /** ✅ Load User from Local Storage on Mount */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Restore user data from local storage
    }
  }, []);

  /** ✅ Fetch User Profile if Logged In */
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return; // Skip if no token

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response)
        if (response.status === 200) {
          const userData = {
            fullName: {
              firstName: response.data.fullname.firstname,
              lastName: response.data.fullname.lastname,
            },
            email: response.data.email,
          };

          localStorage.setItem("user", JSON.stringify(userData)); // Save user in local storage
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // localStorage.removeItem("user"); // Remove user if API call fails
      }
    };

    fetchUserProfile();
  }, [token]); // Run on token change

  /** ✅ Logout Function */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem('tripDetails')
    localStorage.removeItem('fareData')
    localStorage.removeItem('vehicleoptions')
    localStorage.removeItem('rideDetails')
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-black text-white px-6 py-3 flex justify-between items-center">
      {/* Left Section - Logo and Navigation */}
      <div className="flex px-20 items-center gap-6">
        <span className="text-2xl font-bold">Uber</span>
        <nav className="hidden md:flex gap-6">
          <Link to="#" className="text-md font-medium">Ride</Link>
          <Link to="#" className="text-md font-medium">Drive</Link>
          <Link to="#" className="text-md font-medium">Business</Link>
          <Link to="#" className="flex items-center text-sm font-medium">
            About <i className="ri-arrow-down-s-line ml-1"></i>
          </Link>
        </nav>
      </div>

      {/* Right Section - User Info or Auth Links */}
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium flex items-center">
          <i className="ri-global-line mr-2"></i> EN
        </button>
        <Link to="#" className="text-sm font-medium">Help</Link>

        {/* ✅ If user is logged in, show username and logout button */}
        {token && user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm bg-white rounded-full px-4  font-bold p-2 text-black">
              {user.fullName?.firstName || "User"} {/* ✅ Fix fullname reference */}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          /* ✅ If user is NOT logged in, show Login & Signup buttons */
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium">Log in</Link>
            <Link
              to="/register"
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default StartPageHeader;
