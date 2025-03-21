import { createContext, useContext, useState, useEffect } from "react";

// Create context
export const TripDataContext = createContext();

// Custom hook for consuming the context
export const useTrip = () => useContext(TripDataContext);

export const TripProvider = ({ children }) => {
  const [tripDetails, setTripDetails] = useState(() => {
    // Load trip details from localStorage (if available)
    const savedTrip = localStorage.getItem("tripDetails");
    return savedTrip ? JSON.parse(savedTrip) : {
      pickup: "",
      destination: "",
      pickupCoords: null,
      destinationCoords: null,
      route:null,
    };
  });

  return (
    <TripDataContext.Provider value={{ tripDetails, setTripDetails }}>
      {children}
    </TripDataContext.Provider>
  );
};
