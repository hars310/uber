import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicleOptions from "../components/VehicleOptions";
import SearchRide from "../components/SearchRide";

const Home = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null); // Track selected location

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
      setSelectedLocation(true);
    } else {
      console.log("Please enter both pickup and destination locations");
    }
    setPickupLocation("");
    setDestinationLocation("");
  };

  // Handle click on a location
  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Section */}
      <div className="w-1/4 h-screen relative bg-white p-2">
        <img
          className="absolute top-5 left-5 w-20 z-[1000]"
          src="uber-removebg-preview.png"
          alt="Uber Logo"
        />

        {/* Find Trip Form */}
        <div className="pt-12 p-4 h-full">
          {/* Only show SearchRide and LocationSearchPanel when no location is selected */}
          {!selectedLocation ? (
            <>
              <SearchRide
                handlePickupChange={handlePickupChange}
                handleDestinationChange={handleDestinationChange}
                pickupLocation={pickupLocation}
                destinationLocation={destinationLocation}
                handleGoButtonClick={handleGoButtonClick}
              />
              <div className="h-2/3 bg-white">
                <LocationSearchPanel onLocationClick={handleLocationClick} />
              </div>
            </>
          ) : (
            <VehicleOptions selectedLocation={selectedLocation} />
          )}
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
