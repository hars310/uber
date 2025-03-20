import React from "react";
import VehicleOption from "./VehicleOption";

const VehicleOptions = ({ selectedLocation, onVehicleSelect }) => {
  const vehicleData = [
    {
      vehicleType: "UberGO",
      capacity: 4,
      time: "2 mins",
      price: 400,
      description: "Affordable, compact Rides",
      imageSrc: "uber-car.png",
    },
    {
      vehicleType: "UberRickshaw",
      capacity: 6,
      time: "5 mins",
      price: 650,
      description: "Spacious, large rides",
      imageSrc: "uber-auto.png",
    },
    {
      vehicleType: "UberTaxi",
      capacity: 4,
      time: "8 mins",
      price: 1200,
      description: "Premium, luxury rides",
      imageSrc: "uber-taxi.png",
    },
    {
      vehicleType: "UberBike",
      capacity: 3,
      time: "3 mins",
      price: 200,
      description: "Shared rides with others",
      imageSrc: "uber-bike.png",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Choose a vehicle</h2>
      {vehicleData.map((vehicle, index) => (
        <VehicleOption
          key={index}
          vehicle={vehicle}
          onVehicleSelect={onVehicleSelect}
        />
      ))}
    </div>
  );
};

export default VehicleOptions;
