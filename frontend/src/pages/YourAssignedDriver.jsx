import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "remixicon/fonts/remixicon.css";

const YourAssignedDriver = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [driverInfo, setDriverInfo] = useState({
    name: "John Doe",
    vehicle: "Grand Vitara",
    vehicleNumber: "UP 37 0909",
    contact: "+1234567890",
    rating: 4.9,
    profilePic: "driver-photo.jpg", // Assuming you have a driver's photo
  });

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <img
        className="absolute top-5 left-5 w-20 z-[1000]"
        src="uber-removebg-preview.png"
        alt="Uber Logo"
      />

      {/* Left Section */}
      <div className="w-1/4 mt-16 h-screen relative bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between gap-2 items-center border-b-2 py-2 border-b-gray-600 mb-4">
          <p className="text-xl font-bold">Meet at the pickup location</p>
          <p className="text-2xl font-bold text-white text-center bg-zinc-900 p-2">
            2 min
          </p>
        </div>

        {/* Driver Info Section */}
        <div className="flex gap-5 items-center mb-6 relative ">
          <div className="flex flex-row relative w-40 h-20">
            {/* Card 1 */}
            <div className="w-20 h-20 bg-white  rounded-full flex items-center justify-center absolute left-10 z-20">
              <img src="https://imgs.search.brave.com/eg0CHO4ut-6ODRZnzkH0CXmxUe0Ir23RfJLngSgQSrs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z2xvYmFsc3V6dWtp/LmNvbS9hdXRvbW9i/aWxlL2xpbmV1cC9n/cmFuZHZpdGFyYS9p/bWcvZXhfaW1nMDYu/anBn" className="w-20 rounded-full" alt="Uber Car" />
            </div>

            <div className="w-20 h-20 bg-zinc-300 rounded-full flex items-center justify-center absolute left-0 z-10">
              <img src="https://randomuser.me/api/portraits/men/45.jpg" className="w-20 rounded-full" alt="Uber Car" />
            </div>

            {/* Card 2 */}
            
          </div>

          <div>
            <p className="text-xl font-bold">{driverInfo.name}</p>
            <p className="text-2xl font-semibold text-zinc-600">
              {driverInfo.vehicleNumber}
            </p>
            <p className="text-md text-gray-500">{driverInfo.vehicle}</p>
            <p className="text-xl font-bold text-zinc-900">
              ★ {driverInfo.rating}
            </p>
          </div>
        </div>

        {/* Ride Info Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6">
          <p className="font-semibold text-lg">Ride Details</p>
          <div className="flex justify-between mt-2">
            <p className="text-gray-600">Pickup Location</p>
            <p className="text-blue-600 font-semibold">
              {pickupLocation || "Not set"}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-600">Destination Location</p>
            <p className="text-blue-600 font-semibold">
              {destinationLocation || "Not set"}
            </p>
          </div>
        </div>

        {/* Contact Driver Button */}
        <button
          onClick={() => alert("Calling driver...")}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-green-700 transition duration-300"
        >
          Call Driver
        </button>
      </div>

      {/* Right Section with Map */}
      <div className="w-3/4 h-screen relative">
        <Map />
      </div>
    </div>
  );
};

export default YourAssignedDriver;
