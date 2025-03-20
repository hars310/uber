import React from "react";

const ConfirmRide = ({ selectedLocation, selectedVehicle, onConfirmRide }) => {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold text-center">Confirm your ride</h1>
      <div>
        <img src={selectedVehicle.imageSrc} className="w-full" alt="vehicle" />
      </div>
      <div className="flex flex-row gap-5 items-center mt-2 border-b-2 border-b-gray-300">
        <div>
          <i className="ri-map-pin-user-fill text-lg"></i>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-xl">{selectedLocation.pickupLocatio}</p>
          <p>{selectedLocation.pickupLocation}</p>
        </div>
      </div>
      <div className="flex flex-row gap-5 items-center mt-2 border-b-2 border-b-gray-300">
        <div>
          <i className="ri-map-pin-2-fill text-lg"></i>
        </div>
        <div>
          <p className="font-bold text-xl">{selectedLocation.destinationLocation }</p>
          <p>{selectedLocation.destinationLocation}</p>
        </div>
      </div>
      <div className="flex flex-row gap-5 items-center mt-2">
        <div>
          <i className="ri-bill-fill text-lg"></i>
        </div>
        <div>
          <p className="font-bold text-xl">₹ {selectedVehicle.price}</p>
          <p>{selectedVehicle.description}</p>
        </div>
      </div>
      <button
        onClick={onConfirmRide}
        className="w-full bg-green-600 rounded-md cursor-pointer p-3 text-xl text-white font-bold"
      >
        Confirm
      </button>
    </div>
  );
};

export default ConfirmRide;
