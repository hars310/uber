import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicleOptions from "../components/VehicleOptions";
import SearchRide from "../components/SearchRide";
import ConfirmRide from "../components/ConfirmRide";

const Home = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  const savedState = JSON.parse(localStorage.getItem("rideState")) || {};
  const [pickupLocation, setPickupLocation] = useState(savedState.pickupLocation || "");
  const [destinationLocation, setDestinationLocation] = useState(savedState.destinationLocation || "");
  const [selectedLocation, setSelectedLocation] = useState(savedState.selectedLocation || null);
  const [selectedVehicle, setSelectedVehicle] = useState(savedState.selectedVehicle || null);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  // Save state to localStorage whenever any relevant state changes
  useEffect(() => {
    const stateToSave = {
      pickupLocation,
      destinationLocation,
      selectedLocation,
      selectedVehicle,
    };
    localStorage.setItem("rideState", JSON.stringify(stateToSave));
  }, [pickupLocation, destinationLocation, selectedLocation, selectedVehicle]);

  const handlePickupChange = (e) => {
    setPickupLocation(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestinationLocation(e.target.value);
  };

  const handleGoButtonClick = () => {
    if (pickupLocation && destinationLocation) {
      setSelectedLocation({ pickupLocation, destinationLocation });
    } else {
      console.log("Please enter both pickup and destination locations");
    }
    setPickupLocation("");
    setDestinationLocation("");
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleConfirmRide = () => {
    navigate("/ride-confirmation");
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

        <div className="pt-12 p-4 h-full">
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
          ) : !selectedVehicle ? (
            // Show VehicleOptions if location is selected
            <>
              <h1
                className="text-3xl mt-4 font-bold"
                onClick={() => setSelectedLocation(null)} // Allow going back to location search
              >
                <i className="ri-arrow-left-s-line cursor-pointer"></i> Back
              </h1>
              <VehicleOptions
                selectedLocation={selectedLocation}
                onVehicleSelect={handleVehicleSelect}
              />
            </>
          ) : (
            // Show ConfirmRide if vehicle is selected
            <>
             <h1
                className="text-3xl mt-4 font-bold"
                onClick={() => setSelectedVehicle(null)} // Allow going back to location search
              >
                <i className="ri-arrow-left-s-line cursor-pointer"></i> Back
              </h1>
              <ConfirmRide
                selectedLocation={selectedLocation}
                selectedVehicle={selectedVehicle}
                onConfirmRide={handleConfirmRide}
              />
            </>
          )}
        </div>
      </div>

      <div className="w-3/4 h-screen relative">
        <Map />
      </div>
    </div>
  );
};

export default Home;
