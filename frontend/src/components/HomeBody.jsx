import React, { useContext, useState, useEffect, useCallback } from "react";
import Map from "./Map";
import { TripDataContext } from "../context/TripContext";
import axios from "axios";
import debounce from "lodash.debounce";
import "remixicon/fonts/remixicon.css";

function HomeBody() {
  const rideOptions = [
    {
      id: 1,
      name: "Go Intercity 24",
      time: "7 mins away - 2:32 AM",
      description: "Affordable outstation rides in compact cars",
      price: "₹6,801.17",
      image:
        "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/IntercityUberX.png",
    },
    {
      id: 2,
      name: "Uber Sedan",
      time: "5 mins away - 2:30 AM",
      description: "Luxury travel with comfortable seating",
      price: "₹7,299.00",
      image:
        "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/Hatchback.png",
    },
    {
      id: 3,
      name: "Uber XL",
      time: "8 mins away - 2:35 AM",
      description: "Spacious rides for larger groups",
      price: "₹8,499.50",
      image:
        "https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/TukTuk_Green_v1.png",
    },
  ];

  const { tripDetails, setTripDetails } = useContext(TripDataContext);
  const [pickup, setPickup] = useState(tripDetails.pickup || "");
  const [destination, setDestination] = useState(tripDetails.destination || "");
  const [suggestions, setSuggestions] = useState({
    pickup: [],
    destination: [],
  });
  const [rideOptionsVisible, setRideOptionsVisible] = useState(false);
  const [route, setRoute] = useState(tripDetails.route || null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]); // Default: New Delhi
  const [markers, setMarkers] = useState([
    tripDetails.pickupCoords || null,
    tripDetails.destinationCoords || null,
  ]);
  const [isLoading, setIsLoading] = useState({
    pickup: false,
    destination: false,
  });

  const isTripSelected = markers[0] && markers[1];

  // **Dynamic Map Styles**
  const mapContainerClass = tripDetails
    ? "w-1/3 transition-all duration-300"
    : "w-1/4 transition-all duration-300";
  
  /** Load Trip Details from Local Storage on Mount */
  useEffect(() => {
    const savedTrip = localStorage.getItem("tripDetails");
    if (savedTrip) {
      const tripData = JSON.parse(savedTrip);
      setTripDetails(tripData);
      setMarkers([tripData.pickupCoords, tripData.destinationCoords]);
      setRoute(tripData.route || null);
    }
  }, []);

  /** Debounced Function to Fetch Location Suggestions */
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query, type) => {
      if (query.length < 3) {
        setSuggestions((prev) => ({ ...prev, [type]: [] }));
        setIsLoading((prev) => ({ ...prev, [type]: false }));
        return;
      }

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        setSuggestions((prev) => ({ ...prev, [type]: response.data }));
      } catch (error) {
        console.error(`Error fetching ${type} suggestions:`, error);
      } finally {
        setIsLoading((prev) => ({ ...prev, [type]: false }));
      }
    }, 500),
    []
  );

  const handleLocationChange = (e, type) => {
    const value = e.target.value;
    setIsLoading((prev) => ({ ...prev, [type]: true }));
    debouncedFetchSuggestions(value, type);
    if (type === "pickup") setPickup(value);
    else setDestination(value);
  };

  const handleSelectLocation = (location, type) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    if (isNaN(lat) || isNaN(lon)) return;

    const coords = [lat, lon];

    setSuggestions((prev) => ({ ...prev, [type]: [] }));

    if (type === "pickup") {
      setPickup(location.display_name);
      setMarkers((prev) => [[lat, lon], prev[1]]);
    } else {
      setDestination(location.display_name);
      setMarkers((prev) => [prev[0], [lat, lon]]);
    }
    
    
      setMapCenter(coords);
  };

  /** Fetch Route */
  useEffect(() => {
    const fetchRoute = async () => {
      if (!markers[0] || !markers[1]) return;

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${markers[0][1]},${markers[0][0]};${markers[1][1]},${markers[1][0]}?overview=full&geometries=geojson`;
        const response = await axios.get(url);

        if (response.data.routes.length > 0) {
          setRoute(response.data.routes[0].geometry.coordinates);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (isTripSelected) fetchRoute();
  }, [markers]);

  /** Handle Find Ride Button */
  const handleFindRide = () => {
    if (!markers[0] || !markers[1]) {
      alert("Please select both pickup and destination locations");
      return;
    }

    const tripData = {
      pickup,
      destination,
      pickupCoords: markers[0],
      destinationCoords: markers[1],
      route,
    };

    localStorage.setItem("tripDetails", JSON.stringify(tripData));
    setTripDetails(tripData);
    setRideOptionsVisible(true);
  };
  // console.log(tripDetails)

  return (
    <div className="flex flex-col py-8 px-8 md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-[90vh]">
      {/* Left Section: Enter Trip Details */}
      <div className={tripDetails ? "w-1/5" : "w-1/3"}>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-bold mb-2">Get a Ride</h2>

          {/* Pickup Location Input */}
          <input
            type="text"
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => handleLocationChange(e, "pickup")}
            className="p-3 w-full rounded-md bg-gray-100"
          />
          {isLoading.pickup && (
            <div className="absolute right-3 top-3">
              <i className="ri-loader-4-line animate-spin"></i>
            </div>
          )}
          {suggestions.pickup.length > 0 && (
            <ul className="absolute bg-white border rounded shadow-md w-1/3 z-10 max-h-60 overflow-y-auto">
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

          {/* Destination Location Input */}
          <input
            type="text"
            placeholder="Dropoff location"
            value={destination}
            onChange={(e) => handleLocationChange(e, "destination")}
            className="mt-2 p-3 w-full rounded-md bg-gray-100"
          />
          {isLoading.destination && (
            <div className="absolute right-3 top-3">
              <i className="ri-loader-4-line animate-spin"></i>
            </div>
          )}
          {suggestions.destination.length > 0 && (
            <ul className="absolute bg-white border rounded shadow-md w-1/3 z-10 max-h-60 overflow-y-auto">
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
          {/* Find Ride Button */}
          <button
            className="bg-black text-white px-4 py-2 rounded-lg w-full mt-4"
            onClick={handleFindRide}
            disabled={!markers[0] || !markers[1]}
          >
            Find Ride
          </button>
        </div>
      </div>
      {/* Middle Section: Ride Options */}
      {tripDetails.pickup   && (
        <div className="w-1/4 flex flex-col  gap-4 transition-all duration-300">
          {rideOptions.map((option) => (
            <div
              key={option.id}
              className="border  p-4 rounded-lg flex flex-row gap-12 items-center justify-between"
            >
              <img src={option.image} alt={option.name} className="w-24" />
              <div className="w-2/3">
                <h3 className="text-lg font-bold">{option.name}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
                <p className="text-md font-semibold">{option.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Right Section: Map */}
      <div className={mapContainerClass}>
        {tripDetails.pickup && rideOptionsVisible  ? (
          <Map
            center={mapCenter}
            markers={markers.filter(Boolean)}
            route={route}
            mapStyles={{ height: "85vh", width: "30vw" }}
          />
        ) : (
          <Map
            center={mapCenter}
            markers={markers.filter(Boolean)}
            route={route}
            mapStyles={{ height: "85vh", width: "50vw" }}
          />
        )}
      </div>
    </div>
  );
}

export default HomeBody;
