import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicleOptions from "../components/VehicleOptions";
import SearchRide from "../components/SearchRide";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver"; // Import the LookingForDriver component

const Home = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentView, setCurrentView] = useState("location"); // "location", "vehicle", "confirm", "lookingForDriver"

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

  // Load saved state from localStorage on page load
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("rideState"));
    if (savedState) {
      setPickupLocation(savedState.pickupLocation);
      setDestinationLocation(savedState.destinationLocation);
      setSelectedLocation(savedState.selectedLocation);
      setSelectedVehicle(savedState.selectedVehicle);
    }
  }, []);

  const handlePickupChange = (e) => {
    setPickupLocation(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestinationLocation(e.target.value);
  };

  const handleGoButtonClick = () => {
    if (pickupLocation && destinationLocation) {
      setSelectedLocation({
        pickupLocation,
        destinationLocation,
      });
      setCurrentView("vehicle"); // Switch to the vehicle selection view
    } else {
      console.log("Please enter both pickup and destination locations");
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setCurrentView("vehicle"); // Switch to vehicle selection after location is selected
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentView("confirm"); // Switch to "confirm" view after vehicle selection
  };

  const handleConfirmRide = () => {
    setCurrentView("lookingForDriver"); // Switch directly to "Looking for Driver"
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
          {/* Render different views based on currentView */}
          {currentView === "location" && (
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
          )}

          {currentView === "vehicle" && (
            <>
              <h1
                className="text-3xl mt-4 font-bold"
                onClick={() => setCurrentView("location")} // Allow going back to location search
              >
                <i className="ri-arrow-left-s-line cursor-pointer"></i> Back
              </h1>
              <VehicleOptions
                selectedLocation={selectedLocation}
                onVehicleSelect={handleVehicleSelect}
              />
            </>
          )}

          {currentView === "confirm" && (
            <>
              <h1
                className="text-3xl mt-4 font-bold"
                onClick={() => setCurrentView("vehicle")} // Allow going back to vehicle selection
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

          {currentView === "lookingForDriver" && (
            <LookingForDriver
              selectedLocation={selectedLocation}
              selectedVehicle={selectedVehicle}
            />
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
