import React from "react";

const RideStatus = ({ isSearching, captainDetails }) => {
  if (isSearching) {
    return (
      <div className="h-[50vh] flex flex-col justify-center items-center">
        <i className="ri-loader-2-line text-7xl animate-spin"></i>
        <p className="text-xl font-semibold">Looking for a captain...</p>
      </div>
    );
  }

  if (captainDetails) {
    return (
      <div className="border p-4 rounded-lg shadow-md flex flex-col items-center">
        <img src={captainDetails.profileImage || "/default-captain.png"} className="w-24 h-24 rounded-full mb-2" />
        <h3 className="text-lg font-bold">{captainDetails.name}</h3>
        <p className="text-sm text-gray-500">Vehicle: {captainDetails.vehicleType}</p>
      </div>
    );
  }

  return null;
};

export default RideStatus;
