import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";

const Home = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  const handlePickupChange = (e) => {
    setPickupLocation(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestinationLocation(e.target.value);
  };

  const handleGoButtonClick = () => {
    if (pickupLocation && destinationLocation) {
      console.log(`Navigating from: ${pickupLocation} to: ${destinationLocation}`);
    } else {
      console.log('Please enter both pickup and destination locations');
    }
    setPickupLocation("")
    setDestinationLocation("")
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Section */}
      <div className="w-1/4  h-screen relative bg-white p-2">
        <img
          className="absolute top-5 left-5 w-20 z-[1000]"
          src="uber-removebg-preview.png"
          alt="Uber Logo"
        />

        {/* Find Trip Form */}
        <div className="h-full pt-12 p-4 ">
          <div className="h-1/3 mb-2 p-2 ">
            <h2 className="text-zinc-900 text-2xl mb-1 font-bold">
              Find a trip
            </h2>
            <form>
              <input
                type="text"
                placeholder="Add your pickup location"
                value={pickupLocation}
                onChange={handlePickupChange}
                className="w-full p-2 mb-2 rounded-md outline-none border-none bg-[#eeeeee]"
              />
              <div className="text-xl font-bold flex items-center justify-center">
                <i className="ri-arrow-down-line"></i>
              </div>
              <input
                type="text"
                placeholder="Add your destination location"
                value={destinationLocation}
                onChange={handleDestinationChange}
                className="w-full p-2 rounded-md outline-none border-none bg-[#eeeeee]"
              />
            </form>
            <button onClick={handleGoButtonClick} className="w-full p-2 rounded-md bg-green-600 mt-3 text-white font-bold text-xl cursor-pointer ">
              Go
            </button>
          </div>
          <div className="h-2/3 bg-white">
            <LocationSearchPanel />
          </div>
        </div>
      </div>

      {/* Right Section with Map */}
      <div className="w-3/4 h-screen relative">
        <Map />
      </div>
    </div>
  );
};

export default Home;
