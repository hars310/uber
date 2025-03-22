import React, { useContext, useState, useEffect } from "react";
import Map from "./Map";
import { TripDataContext } from "../context/TripContext";
import axios from "axios";
import debounce from "lodash.debounce";

function HomeBody() {
  const rideOptions = [
    {
      id: 1,
      name: "Go Intercity 24",
      time: "7 mins away - 2:32 AM",
      description: "Affordable outstation rides in compact cars",
      price: "₹6,801.17",
      image: "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/IntercityUberX.png"
    },
    {
      id: 2,
      name: "Uber Sedan",
      time: "5 mins away - 2:30 AM",
      description: "Luxury travel with comfortable seating",
      price: "₹7,299.00",
      image: "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/Black.png"
    },
    {
      id: 3,
      name: "Uber XL",
      time: "8 mins away - 2:35 AM",
      description: "Spacious rides for larger groups",
      price: "₹8,499.50",
      image: "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/UberXL.png"
    }
  ];

  const { tripDetails, setTripDetails } = useContext(TripDataContext);
  const [pickupInput, setPickupInput] = useState(tripDetails.pickup || "");
  const [destinationInput, setDestinationInput] = useState(tripDetails.destination || "");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [rideOptionsVisible, setRideOptionsVisible] = useState(false);
  const [route, setRoute] = useState(tripDetails.route || null);

  const isTripSelected = tripDetails.pickup && tripDetails.destination;
  const validMarkers = [tripDetails.pickupCoords, tripDetails.destinationCoords].filter(m => m !== null);
  
  // **Dynamic Map Styles**
  const mapContainerClass = rideOptionsVisible ? "w-1/3 transition-all duration-300" : "w-3/4 transition-all duration-300";
  const mapStyles = rideOptionsVisible ? { height: "85vh", width: "40vw" } : { height: "85vh", width: "70vw" };
  /** Load Trip Details from Local Storage on Mount */
  useEffect(() => {
    const savedTrip = localStorage.getItem("tripDetails");
    if (savedTrip) {
      setTripDetails(JSON.parse(savedTrip));
    }
  }, []);

  /** Save Trip Details to Local Storage Whenever It Updates */
  useEffect(() => {
    if (tripDetails.pickup && tripDetails.destination) {
      localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
    }
  }, [tripDetails]);

  /** Debounced Function to Fetch Location Suggestions */
  const fetchLocationSuggestions = debounce(async (query, type) => {
    if (query.length < 3) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      if (type === "pickup") {
        setPickupSuggestions(response.data);
      } else {
        setDestinationSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  }, 600);

  const handlePickupChange = (e) => {
    setPickupInput(e.target.value);
    fetchLocationSuggestions(e.target.value, "pickup");
  };

  const handleDestinationChange = (e) => {
    setDestinationInput(e.target.value);
    fetchLocationSuggestions(e.target.value, "destination");
  };

  /** Update Trip Details and Map When Location is Selected */
  const handleSelectLocation = (location, type) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    if (type === "pickup") {
      setTripDetails(prev => ({ ...prev, pickup: location.display_name, pickupCoords: [lat, lon] }));
      setPickupInput(location.display_name);
      setPickupSuggestions([]);
    } else {
      setTripDetails(prev => ({ ...prev, destination: location.display_name, destinationCoords: [lat, lon] }));
      setDestinationInput(location.display_name);
      setDestinationSuggestions([]);
    }
  };

  /** Fetch Route Every 5 Seconds */
  useEffect(() => {
    let routeInterval;

    const fetchRoute = async () => {
      const { pickupCoords, destinationCoords } = tripDetails;
      if (!pickupCoords || !destinationCoords) return;

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=full&geometries=geojson`;
        const response = await axios.get(url);

        if (response.data.routes && response.data.routes.length > 0) {
          const routeCoordinates = response.data.routes[0].geometry.coordinates;
          
          setRoute(routeCoordinates);
          setTripDetails(prev => ({ ...prev, route: routeCoordinates }));
          localStorage.setItem("tripDetails", JSON.stringify({ ...tripDetails, route: routeCoordinates }));
        } else {
          console.error("No routes found");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (isTripSelected) {
      fetchRoute(); // Initial fetch
      routeInterval = setInterval(fetchRoute, 5000);
    }

    return () => clearInterval(routeInterval);
  }, [tripDetails.pickupCoords, tripDetails.destinationCoords]);

  /** Handle Find Ride Button */
  const handleFindRide = () => {
    if (isTripSelected) {
      setRideOptionsVisible(true);
    }
  };

  return (
    <div className={`flex flex-col py-8  px-8 md:flex-row space-y-4 md:space-y-0 md:space-x-4 ${!rideOptionsVisible ? "h-screen" : ""}`}>
      
      {/* Left Section: Enter Trip Details */}
      <div className={rideOptionsVisible ? "w-1/4" : "w-1/3"}>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-bold mb-2">Get a Ride</h2>

          {/* Pickup Location Input with Suggestions */}
          <div className="mb-2 relative">
            <label className="text-gray-500 text-sm">Pickup Location</label>
            <input type="text" value={pickupInput} onChange={handlePickupChange} className="mt-1 p-3 bg-gray-100 block w-full border-gray-300 rounded-md shadow-sm text-md" />
            {pickupSuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded shadow-md w-full z-10 max-h-60 overflow-y-auto">
                {pickupSuggestions.map((loc, index) => (
                  <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => handleSelectLocation(loc, "pickup")}>
                    {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination Location Input with Suggestions */}
          <div className="mb-2 relative">
            <label className="text-gray-500 text-sm">Dropoff Location</label>
            <input type="text" value={destinationInput} onChange={handleDestinationChange} className="mt-1 p-3 bg-gray-100 block w-full border-gray-300 rounded-md shadow-sm text-md" />
            {destinationSuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded shadow-md w-full z-10 max-h-60 overflow-y-auto">
                {destinationSuggestions.map((loc, index) => (
                  <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => handleSelectLocation(loc, "destination")}>
                    {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Find Ride Button */}
          {isTripSelected && !rideOptionsVisible && (
            <button className="bg-black text-white px-4 py-2 rounded-lg w-full mt-4" onClick={handleFindRide}>
              Find Ride
            </button>
          )}
        </div>
      </div>

      {/* Middle Section: Ride Options (Hidden Initially) */}
      {rideOptionsVisible && (
        <div className="w-1/3 transition-all duration-300">
          <div className="bg-white rounded-lg px-4">
            <h2 className="text-4xl font-extrabold mb-4">Choose a Ride</h2>
            {rideOptions.map((option) => (
            <div key={option.id} className="border flex flex-row items-center gap-8 h-36 rounded-lg p-2 mb-2">
              <div className="flex items-center mb-2">
                <img src={option.image} className="w-32" alt={option.name} />
                <div>
                  <h3 className="text-xl font-semibold">{option.name}</h3>
                  <p className="text-xs text-gray-500">{option.time}</p>
                  <p className="text-md leading-4 text-gray-500">{option.description}</p>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-right">{option.price}</p>
              </div>
            </div>
          ))}
          {/* Add ride options dynamically */}
          <div className="flex justify-between items-center mt-12 p-5 shadow rounded-md">
            <select className="border-gray-300 rounded-md shadow-sm text-md">
              <option>Cash</option>
              <option>Online Payment</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded-lg">Confirm Ride</button>
          </div>
          </div>
        </div>
      )}

      {/* Right Section: Map */}
      <div className={mapContainerClass}>
        <div className="bg-gray-100 font-bold rounded-lg">
          <Map markers={validMarkers} route={route} mapStyles={mapStyles} />
        </div>
      </div>
    </div>
  );
}

export default HomeBody;
