import React, { useState, useEffect, useCallback, useContext } from "react";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import axios from "axios";
import debounce from "lodash.debounce";
import {  TripDataContext } from "../context/TripContext";

const StartPageHero = () => {
  const navigate = useNavigate();
  const {tripDetails, setTripDetails }= useContext(TripDataContext)
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: New Delhi
  const [markers, setMarkers] = useState([null, null]);
  const [route, setRoute] = useState(null);
  const [suggestions, setSuggestions] = useState({ pickup: [], destination: [] });
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState({ pickup: false, destination: false });



  const mapStyles = {height: "70vh", width: "40vw",borderRadius:"20px"}



  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLoggedIn(!!token);
  }, []);



  // Create the debounced function using useCallback to avoid recreation on each render
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query, type) => {
      if (query.length < 3) {
        setSuggestions(prev => ({ ...prev, [type]: [] }));
        setIsLoading(prev => ({ ...prev, [type]: false }));
        return;
      }
      
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        );
        setSuggestions(prev => ({ ...prev, [type]: response.data }));
      } catch (error) {
        console.error(`Error fetching ${type} suggestions:`, error);
      } finally {
        setIsLoading(prev => ({ ...prev, [type]: false }));
      }
    }, 500),
    []
  );

  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
    setIsLoading(prev => ({ ...prev, pickup: true }));
    debouncedFetchSuggestions(value, "pickup");
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setIsLoading(prev => ({ ...prev, destination: true }));
    debouncedFetchSuggestions(value, "destination");
  };

  const handleSelectLocation = (location, type) => {
    // Ensure we have valid lat/lon values
    if (!location.lat || !location.lon) {
      console.error("Invalid location data:", location);
      return;
    }
    
    // Parse the coordinates as floats and validate them
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      console.error("Invalid coordinates:", lat, lon);
      return;
    }
    
    const coords = [lat, lon];
    
    setSuggestions(prev => ({ ...prev, [type]: [] }));

    if (type === "pickup") {
      setPickup(location.display_name);
      setMapCenter(coords);
      setMarkers(prev => [coords, prev[1]]);
    } else {
      setDestination(location.display_name);
      setMarkers(prev => [prev[0], coords]);
    }
  };

  useEffect(() => {
    // Only fetch route if both markers are valid
    if (markers[0] && markers[1]) {
      fetchRoute(markers[0], markers[1]);
    }
  }, [markers]);

  const fetchRoute = async (pickupCoords, destCoords) => {
    // Additional validation to prevent the error
    if (!pickupCoords || !pickupCoords[0] || !pickupCoords[1] || 
        !destCoords || !destCoords[0] || !destCoords[1]) {
      console.error("Invalid coordinates for route:", pickupCoords, destCoords);
      return;
    }
    
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
      const response = await axios.get(url);
      
      if (response.data.routes && response.data.routes.length > 0) {
        setRoute(response.data.routes[0].geometry.coordinates);
      } else {
        console.error("No routes found");
        setRoute(null);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setRoute(null);
    }
  };

  

  const handleSeePrices = () => {
    if (!markers[0] || !markers[1]) {
      alert("Please select both pickup and destination locations");
      return;
    }
  
    const tripData = {
      pickup, 
      destination,
      pickupCoords: markers[0],
      destinationCoords: markers[1],
      route:route
    };
  
    // Save trip details in LocalStorage before navigating
    localStorage.setItem("tripDetails", JSON.stringify(tripData));
  
    if (!userLoggedIn) {
      navigate("/login");  // Go to login first if user is not logged in
    } else {
      setTripDetails(tripData);  // Directly update the context if user is logged in
      navigate("/home");
    }
  };
  
  

  return (
    <main className="lg:h-auto flex flex-col lg:flex-row justify-around items-center px-6 py-12">
      <div className="w-1/2 lg:w-1/2 space-y-6 px-24 py-12 ml-20">
        <h1 className="text-5xl font-bold">Go anywhere with Uber</h1>
        <div className="space-y-3 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Pickup location"
              value={pickup}
              onChange={handlePickupChange}
              className="bg-gray-100 p-3 rounded-lg w-full text-sm"
            />
            {isLoading.pickup && (
              <div className="absolute right-3 top-3">
                <i className="ri-loader-4-line animate-spin"></i>
              </div>
            )}
            {suggestions.pickup.length > 0 && (
              <ul className="absolute bg-white border rounded shadow-md w-full z-10 max-h-60 overflow-y-auto">
                {suggestions.pickup.map((loc, index) => (
                  <li 
                    key={index} 
                    className="p-2 hover:bg-gray-200 cursor-pointer text-sm" 
                    onClick={() => handleSelectLocation(loc, "pickup")}
                  >
                    <i className="ri-map-pin-line mr-2"></i>
                    {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Dropoff location"
              value={destination}
              onChange={handleDestinationChange}
              className="bg-gray-100 p-3 rounded-lg w-full text-sm"
            />
            {isLoading.destination && (
              <div className="absolute right-3 top-3">
                <i className="ri-loader-4-line animate-spin"></i>
              </div>
            )}
            {suggestions.destination.length > 0 && (
              <ul className="absolute bg-white border rounded shadow-md w-full z-10 max-h-60 overflow-y-auto">
                {suggestions.destination.map((loc, index) => (
                  <li 
                    key={index} 
                    className="p-2 hover:bg-gray-200 cursor-pointer text-sm" 
                    onClick={() => handleSelectLocation(loc, "destination")}
                  >
                    <i className="ri-map-pin-line mr-2"></i>
                    {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button 
          className={`px-6 py-3 rounded-lg mt-4 ${
            markers[0] && markers[1] 
              ? "bg-black text-white" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`} 
          onClick={handleSeePrices}
          disabled={!markers[0] || !markers[1]}
        >
          See prices
        </button>
      </div>
      <div className="w-1/2 p-14 mr-12 lg:w-1/2 mt-10 lg:mt-0">
        {/* <Map center={mapCenter} markers={markers.filter(m => m !== null)} route={route} /> */}
        <Map center={mapCenter} markers={markers.filter(m => m !== null)} route={route} mapStyles={mapStyles} />
      </div>
    </main>
  );
};

export default StartPageHero;