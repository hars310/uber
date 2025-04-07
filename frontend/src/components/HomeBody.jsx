import React, { useContext, useState,useRef, useEffect, useCallback } from "react";
import Map from "./Map";
import { TripDataContext } from "../context/TripContext";
import axios from "axios";
import debounce from "lodash.debounce";
import "remixicon/fonts/remixicon.css";
import { toast } from "react-hot-toast";
import socket from '../socket/socket.js';
import LocationInput from "./LocationInput";
import RideOptions from "./RideOptions";


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
  const [sockets, setSocket] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [captainDetails, setCaptainDetails] = useState(null);
  const [rideId, setRideId] = useState(null);
  const rideIdRef = useRef(null); 
  // const isTripSelected = markers[0] && markers[1];
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
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

 /** Join socket room once on mount */
 useEffect(() => {
  if (parsedUser._id) {
    setSocket(socket);
    socket.connect();
    socket.emit("join", { userId: parsedUser._id, userType: "user" });
  }

  return () => {
    socket.disconnect(); 
  };
}, []);
  
/** Handle captain assignment */
const handleRideConfirmed = async (rideData) => {
  console.log("Socket event received in HomeBody:", rideData);
  if (rideData.rideId !== rideIdRef.current) return;

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/${rideData.rideId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log(data)
    localStorage.setItem("captainDetails", JSON.stringify(data.captain));
    setRideOptionsVisible(false);
    setCaptainDetails(data.captain);
    setIsSearching(false);
    toast.success("Captain assigned! 🚖");
  } catch (err) {
    toast.error("Failed to fetch ride details");
    setIsSearching(false);
  }
};

useEffect(() => {
  const rideConfirmedHandler = (data) => handleRideConfirmed(data);
  
  socket.on("ride-confirmed", rideConfirmedHandler);

  return () => {
    socket.off("ride-confirmed", rideConfirmedHandler);
  };
}, [handleRideConfirmed]); 

  

  



  useEffect(() => {
    rideIdRef.current = rideId;
  }, [rideId]);
  
  useEffect(() => {
    if (!isSearching || captainDetails) return;
  
    const timeout = setTimeout(() => {
      setIsSearching(false);
      toast.error("No captains found. Try again.");
    }, 20000); // 20 seconds
  
    return () => clearTimeout(timeout);
  }, [isSearching, captainDetails]);
  


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

  const fetchRoute = useCallback(async () => {
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
  }, [markers]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);
  const mapKey = JSON.stringify(route);

  /** Handle Find Ride Button */
  const handleFindRide = async () => {
    if (!markers[0] || !markers[1]) {
      toast.error("Please select both pickup and destination locations");
      return;
    }
   
    // if (!fareData || fareData.length === 0 || Object.keys(fareData).length === 0) {
    //   setRideOptionsVisible(true);
    //   return;
    // }
    

    setFareLoading(true);
    setIsSearching(true);
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
        toast.error("Failed to fetch fare. Try again.");
        return;
      }

      setFareData(data);
      localStorage.setItem("fareData", JSON.stringify(data));
      localStorage.setItem("tripDetails", JSON.stringify(tripData));
      localStorage.setItem("vehicleoptions", "true");
      setTripDetails(tripData);
      setIsSearching(false);
      setRideOptionsVisible(true);
    } catch (error) {
      console.log("handlefindride error", error);
    } finally {
      setFareLoading(false);
    }
  };

  const handleCreateRide = async (vehicleType, price) => {
    setCreatingRide(true);
    setIsSearching(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          pickupCoords: markers[0],
          destinationCoords: markers[1],
          vehicleType,
          fare: price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data || data.error) {
        toast.error("Failed to create ride. Try again.");
        setIsSearching(false);
        return;
      }
      // console.log(data)
      setRideId(data.rideId);
      rideIdRef.current = data.rideId;
      localStorage.setItem("rideDetails", JSON.stringify(data));
      // toast.success(`Ride booked successfully!`);
    } catch (error) {
      toast.error("Error creating ride.");
      setIsSearching(false);
    } finally {
      setCreatingRide(false);
    }
  };

  return (
    <div className="flex flex-col py-8 px-8 md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-[90vh]">
      <LocationInput
        isLoading={isLoading}
        pickup={pickup}
        handleLocationChange={handleLocationChange}
        destination={destination}
        suggestions={suggestions}
        tripDetails={tripDetails}
        handleSelectLocation={handleSelectLocation}
        handleFindRide={handleFindRide}
      />

      <RideOptions
        // captainDetails={captainDetails}
        isSearching={isSearching}
        fareData={fareData}
        handleCreateRide={handleCreateRide}
        creatingRide={creatingRide}
      />

      <div className={mapContainerClass}>
        <Map
          key={mapKey}
          center={mapCenter}
          markers={markers.filter(Boolean)}
          route={route}
          mapStyles={{ height: "85vh", width: "50vw" }}
        />
      </div>
    </div>
  );
}

export default HomeBody;
