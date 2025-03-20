import React, { useState } from 'react';
import "remixicon/fonts/remixicon.css";

const SearchRide = ({ handlePickupChange, handleDestinationChange, pickupLocation, destinationLocation, handleGoButtonClick }) => {
  return (
    <div className="h-1/3 mb-2 p-2">
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
    <button
      onClick={handleGoButtonClick}
      className="w-full p-2 rounded-md bg-green-600 mt-3 text-white font-bold text-xl cursor-pointer "
    >
      Go
    </button>
  </div>
  );
};

export default SearchRide;
