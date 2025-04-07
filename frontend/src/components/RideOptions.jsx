import React, { useEffect } from "react";

const RideOptions = ({
  // captainDetails,
  isSearching,
  fareData,
  handleCreateRide,
  creatingRide,
}) => {
  // time out after 5 seconds to get ride details
  const captainDetails = localStorage.getItem("captainDetails")
    ? JSON.parse(localStorage.getItem("captainDetails"))
    : null;

  return (
    <div className=" w-1/4 h-fit border rounded-md p-4 border-gray-200 shadow-md">
      <div className="flex flex-col gap-4">
        {isSearching ? (
          <div className="h-[50vh] flex flex-col justify-center items-center space-y-4">
            <div className="relative flex justify-center items-center">
              <div className="w-20 h-20 border-4 border-dashed rounded-full border-blue-500 animate-spin"></div>
              <div className="absolute w-10 h-10 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <p className="text-xl font-semibold text-gray-700 animate-pulse">
              Searching for a captain...
            </p>
            <p className="text-sm text-gray-500">
              Hang tight! We're connecting you with the nearest available
              captain.
            </p>
          </div>
        ) : captainDetails ? (
          <div className="border p-4 rounded-lg shadow-md flex flex-col items-center">
            <img
              src={captainDetails.profileImage || "https://100k-faces.glitch.me/random-image"}
              alt="Captain"
              className="w-24 h-24 rounded-full mb-2"
            />
            <h3 className="text-lg font-bold">{captainDetails.fullname.firstname} {captainDetails.fullname.lastname}</h3>
            {/* <p className="text-sm text-gray-500">
              Rating: {captainDetails.rating || "N/A"} ⭐
            </p> */}
            
            <p className="text-sm text-center text-gray-500">
              Vehicle Color: {captainDetails.vehicle.color}
            </p>
            <p className="text-sm text-center text-gray-500">
              Vehicle Capacity: {captainDetails.vehicle.capacity}
            </p>

            <p className="text-sm text-center text-gray-500">
              Vehicle Plate: {captainDetails.vehicle.plate}
            </p>
            <p className="text-sm text-center text-gray-500">
              Vehicle: {captainDetails.vehicle.vehicleType}
            </p>
            <p className="text-md font-semibold">
              Arriving in {captainDetails.eta || "5 mins"}
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {fareData && Object.keys(fareData).length > 0 ? (
              Object.entries(fareData).map(([type, price]) => (
                <button
                  key={type}
                  onClick={() => handleCreateRide(type, price)}
                  className={`cursor-pointer text-black w-full p-4 rounded-lg flex items-center justify-between border border-gray-300 shadow-md hover:bg-zinc-200 transition-all ${
                    creatingRide ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={creatingRide}
                >
                  <img
                    src={`uber-${type}.png`}
                    alt={type}
                    className="w-24 h-24 object-contain"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{type.toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">7 mins Away</p>
                  </div>
                  <p className="text-xl font-semibold">₹{price}</p>
                  {creatingRide && (
                    <p className="text-blue-500 text-sm">Booking...</p>
                  )}
                </button>
              ))
            ) : (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-blue-700 font-medium">
                  Please click on{" "}
                  <span className="font-semibold">Find Ride</span> to get fare
                  and vehicle details.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideOptions;
