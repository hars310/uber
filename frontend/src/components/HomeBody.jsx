import React, { useContext, useState, useEffect, useCallback } from "react";
import Map from "./Map";
import { TripDataContext } from "../context/TripContext";
import axios from "axios";
import debounce from "lodash.debounce";
import "remixicon/fonts/remixicon.css";
import { toast } from "react-hot-toast";

function HomeBody() {
  const { tripDetails, setTripDetails } = useContext(TripDataContext);
  const [pickup, setPickup] = useState(tripDetails.pickup || "");
  const [destination, setDestination] = useState(tripDetails.destination || "");
  const [suggestions, setSuggestions] = useState({
    pickup: [],
    destination: [],
  });
  const [rideOptionsVisible, setRideOptionsVisible] = useState(false);
  const [route, setRoute] = useState(tripDetails.route || null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]);
  const [markers, setMarkers] = useState([
    tripDetails.pickupCoords || null,
    tripDetails.destinationCoords || null,
  ]);
  const [isLoading, setIsLoading] = useState({
    pickup: false,
    destination: false,
  });
  const [fareData, setFareData] = useState([]);
  const [fareLoading, setFareLoading] = useState(false);
  const [creatingRide, setCreatingRide] = useState(false);

  const isTripSelected = markers[0] && markers[1];
  const token = localStorage.getItem("token");
  const val = localStorage.getItem("vehicleoptions");
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

    const savedFare = localStorage.getItem("fareData");
    if (savedFare) {
      setFareData(JSON.parse(savedFare));
      setRideOptionsVisible(true);
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
          )}&limit=10`
        );
        setSuggestions((prev) => ({ ...prev, [type]: response.data }));
      } catch (error) {
        console.error(`Error fetching ${type} suggestions:`, error);
      } finally {
        setIsLoading((prev) => ({ ...prev, [type]: false }));
      }
    }, 400),
    []
  );

  const handleLocationChange = (e, type) => {
    const value = e.target.value;
    setIsLoading((prev) => ({ ...prev, [type]: true }));
    // console.log(isLoading)
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

    if (isTripSelected && !route) fetchRoute();
  }, [markers]);

  /** Handle Find Ride Button */
  const handleFindRide = async () => {
    if (!markers[0] || !markers[1]) {
      toast.error("Please select both pickup and destination locations");
      return;
    }
    // console.log(fareData)
    if (fareData == []) {
      setRideOptionsVisible(true);
      return;
    }

    setFareLoading(true);
    try {
      const tripData = {
        pickup,
        destination,
        pickupCoords: markers[0],
        destinationCoords: markers[1],
        route,
      };

      // console.log(pickup,destination,tripData.pickupCoords,tripData.destinationCoords)

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            pickup: pickup,
            destination: destination,
            pickupCoordinates: tripData.pickupCoords,
            destinationCoordinates: tripData.destinationCoords,
          },
        }
      );
      // console.log(data);
      if (!data || data.error) {
        console.error("Error fetching fare:", data);
        alert("Failed to fetch fare. Try again.");
        return;
      }

      setFareData(data);
      localStorage.setItem("fareData", JSON.stringify(data));
      localStorage.setItem("tripDetails", JSON.stringify(tripData));
      localStorage.setItem("vehicleoptions", "true");
      setTripDetails(tripData);
      setRideOptionsVisible(true);
    } catch (error) {
      console.log("handlefindride error", error);
    } finally {
      setFareLoading(false);
    }
  };

  // const handleCreateRide = async (vehicleType, price) => {
  //   setCreatingRide(true);
  //   try {
  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/rides/create`,
  //       {
  //         pickup,
  //         destination,
  //         pickupCoords: markers[0],
  //         destinationCoords: markers[1],
  //         vehicleType,
  //         fare: price,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (!data || data.error) {
  //       toast.error("Failed to create ride. Try again.");
  //       return;
  //     }

  //     toast.success(`Ride booked successfully! Ride ID: ${data.rideId}`);
  //     localStorage.setItem("rideDetails", JSON.stringify(data));
  //   } catch (error) {
  //     toast.error("Error creating ride.");
  //   } finally {
  //     setCreatingRide(false);
  //   }
  // };
  const handleCreateRide = async (vehicleType, price) => {
    setCreatingRide(true);
    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/create`,
            {
                pickup,
                destination,
                pickupCoords: markers[0],  // Array format [latitude, longitude]
                destinationCoords: markers[1],
                vehicleType,
                fare: price,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!data || data.error) {
            toast.error("Failed to create ride. Try again.");
            return;
        }

        toast.success(`Ride booked successfully! Ride ID: ${data.rideId}`);
        localStorage.setItem("rideDetails", JSON.stringify(data));

    } catch (error) {
        toast.error("Error creating ride.");
    } finally {
        setCreatingRide(false);
    }
};

  return (
    <div className="flex flex-col py-8 px-8 md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-[90vh]">
      {/* Left Section: Enter Trip Details */}
      <div className={tripDetails ? "w-1/5" : "w-1/3"}>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-bold mb-2">Get a Ride</h2>

          {/* Pickup Location Input */}
          <div className="relative">
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
              <ul className="absolute bg-white border rounded shadow-md  z-10 max-h-60 overflow-y-auto">
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
          {/* Destination Location Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Dropoff location"
              value={destination}
              onChange={(e) => handleLocationChange(e, "destination")}
              className="mt-2 p-3 w-full rounded-md bg-gray-100"
            />
            {isLoading.destination && (
              <div className="absolute right-3 top-5">
                <i className="ri-loader-4-line animate-spin"></i>
              </div>
            )}
            {suggestions.destination.length > 0 && (
              <ul className="absolute bg-white border rounded shadow-md z-10 max-h-60 overflow-y-auto">
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
          {/* Find Ride Button */}
          <button
            className="bg-black cursor-pointer hover:bg-zinc-800 text-white px-4 py-2 rounded-lg w-full mt-4"
            onClick={handleFindRide}
            // disabled={!markers[0] || !markers[1]}
          >
            Find Ride
          </button>
        </div>
      </div>

      {/* Middle Section: Ride Options */}
      <div className="w-1/4 flex flex-col gap-4">
        {fareLoading ? (
          <div className="h-[50vh]  flex flex-col p-10 justify-center items-center">
            <i className="ri-loader-2-line text-7xl animate-spin"></i>
            <p className="text-xl font-semibold">Loading fare details...</p>
          </div>
        ) : fareData && Object.keys(fareData).length > 0 ? (
          Object.entries(fareData).map(([type, price]) => (
            <button
              key={type}
              onClick={() => handleCreateRide(type, price)}
              className="border cursor-pointer text-black p-4 rounded-lg flex items-center justify-between shadow-md hover:bg-gray-300 transition-all"
              disabled={creatingRide}
            >
              <img src={`uber-${type}.png`} alt={type} className="w-16 h-16 object-contain" />
              <div>
                <h3 className="text-lg font-bold">{type.toUpperCase()}</h3>
                <p className="text-sm text-gray-500">A {type} for your ride</p>
                <p className="text-md font-semibold">₹{price}</p>
                {creatingRide && <p className="text-blue-500 text-sm">Booking...</p>}
              </div>
            </button>
          ))
        ) : (
          <></>
        )}
      </div>

      {/* Right Section: Map */}
      <div className={mapContainerClass}>
        {tripDetails.pickup && rideOptionsVisible ? (
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
