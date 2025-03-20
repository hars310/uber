import React from 'react';

const VehicleOption = ({ vehicleType, capacity, time, price, description, imageSrc }) => {
  return (
    <div className="h-1/3 mb-2 bg-[#eeeeee] rounded-md p-2 flex flex-row gap-3">
      <div className="w-1/5 flex items-center">
        <img src={imageSrc} className="w-24" alt={`${vehicleType} image`} />
      </div>
      <div className="w-3/5 ml-2">
        <div className="flex flex-row gap-3 items-center">
          <h1 className="text-xl font-bold">{vehicleType}</h1>
          <p className="text-sm">
            <i className="ri-user-fill"></i>{capacity}
          </p>
        </div>
        <div className="flex flex-row gap-4 text-sm">
          <h1>{time} away</h1>
          <p>10:22</p>
        </div>
        <h1 className="text-sm">{description}</h1>
      </div>
      <div className="w-1/5">
        <p className="text-xl text-center font-bold">₹ {price}</p>
      </div>
    </div>
  );
};

export default VehicleOption;
