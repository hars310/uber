import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import Map from "./Map"; // Importing the reusable Map component

const CaptainDashboard = () => {
  const [rides, setRides] = useState([]); // Store pending rides
  const [loading, setLoading] = useState(false); // Handle loading state
  const[rideStatus,setRideStatus] = useState("pending");
  const [selectedRide, setSelectedRide] = useState(null); // Store confirmed ride details
  const [route, setRoute] = useState(null); // Store route details for confirmed ride
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchRides();

    // Initialize WebSocket connection for real-time ride updates
    const socket = io("http://localhost:4000");
    socket.on("new-ride", (newRide) => {
      if (!selectedRide) {
        setRides((prevRides) => [...prevRides, newRide]);
        toast.success("New ride request received!");
      }
    });

    return () => socket.disconnect();
  }, []);

  // Fetch pending rides from the server
  const fetchRides = async () => {
    if (selectedRide) return; // Prevent fetching new rides after confirmation
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/rides/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data)
      setRides(response.data);
    } catch (error) {
      console.error("Error fetching rides", error);
      toast.error("Failed to load rides");
    } finally {
      setLoading(false);
    }
  };

  // Convert pickup/destination names to coordinates using OpenStreetMap API
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      if (response.data.length > 0) {
        return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
      } else {
        toast.error(`No coordinates found for ${address}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast.error("Failed to get location coordinates.");
      return null;
    }
  };

  // Handle ride confirmation
  const confirmRide = async (rideId, pickup, destination,fare) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/rides/confirm",
        { rideId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(response)
      // Get coordinates for pickup & destination
      setRideStatus(response.data.status)
      // console.log(response.data)
      const pickupCoords = await getCoordinates(pickup);
      const destinationCoords = await getCoordinates(destination);

      if (!pickupCoords || !destinationCoords) {
        toast.error("Failed to retrieve coordinates");
        return;
      }

      // Store ride details & fetch route
      setSelectedRide({ rideId, pickup, destination,user:response.data.user.fullname.firstname , pickupCoords, destinationCoords,fare ,rideStatus});
      setRides([]); // Clear all other rides
      fetchRoute(pickupCoords, destinationCoords);
      toast.success("Ride confirmed!");
    } catch (error) {
      console.error("Error confirming ride", error);
      toast.error("Failed to confirm ride");
    } finally {
      setLoading(false);
    }
  };

  // Fetch route between pickup & destination
  const fetchRoute = async (pickupCoords, destinationCoords) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=full&geometries=geojson`
      );
      if (response.data.routes.length > 0) {
        setRoute(response.data.routes[0].geometry.coordinates);
      } else {
        toast.error("No route found.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      toast.error("Failed to load route.");
    }
  };

  // Handle ride start
  const startRide = async (rideId) => {
    const otp = prompt("Enter OTP to start ride:");
    if (!otp) return;

    setLoading(true);
    try {
      await axios.get("http://localhost:4000/rides/start-ride", {
        params: { rideId, otp },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ride started!");
      setRideStatus('ongoing')
    } catch (error) {
      console.error("Error starting ride", error);
      toast.error("Invalid OTP or failed to start ride");
    } finally {
      setLoading(false);
    }
  };

  // Handle ride completion
  const endRide = async (rideId) => {
    setLoading(true);
    try {
      const res  = await axios.post(
        "http://localhost:4000/rides/end-ride",
        { rideId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.data.status==="completed"){
        setSelectedRide("completed");
        toast.success("Ride completed!");
        setRoute(null);
        fetchRides();
      }else{
        toast.error("ride not completed")
      }
    } catch (error) {
      console.error("Error ending ride", error);
      toast.error("Failed to end ride");
    } finally {
      setLoading(false);
    }
  };
  // console.log(selectedRide?.user)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Captain Dashboard</h1>
      {loading && <p className="text-blue-500">Loading rides...</p>}

      {/* Show only the confirmed ride */}
      {selectedRide ? (
        <div className="w-full  flex flex-row p-4 mb-2">
         <div className="border shadow-md p-4 w-1/3 h-fit rounded-md ">
         <h2 className="text-xl font-bold">Confirmed Ride</h2>
          <p><strong>Customer:</strong> {selectedRide.user}</p>
          <p><strong>Pickup:</strong> {selectedRide.pickup}</p>
          <p><strong>Destination:</strong> {selectedRide.destination}</p>
          <p><strong>Fare:</strong> ₹{selectedRide.fare}</p>
          {rideStatus === "accepted" && (
            <button
              onClick={() => startRide(selectedRide.rideId)}
              className="bg-green-600 text-white font-bold px-4 py-2 mt-2 rounded"
            >
              Start Ride
            </button>
          )}
          {rideStatus === "ongoing" && (
            <button
              onClick={() => endRide(selectedRide.rideId)}
              className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
            >
              End Ride
            </button>
          )}
         </div>

          {/* Show Map with Route */}
          
          {route && (
            <div className=" px-10">
              {/* <h2 className="text-xl font-bold">Route Map</h2> */}
              <Map
                center={selectedRide.pickupCoords}
                route={route}
                markers={[selectedRide.pickupCoords, selectedRide.destinationCoords]}
                mapStyles={{ height: "85vh", width: "65vw" }}
              />
            </div>
          )}
          
        </div>
      ) : (
        // List available rides if no ride is confirmed
        <div className="mt-4 flex flex-col px-6 py-12 gap-2">
          <p className="text-xl font-bold">Available requests for you</p>
          {rides.length === 0 ? (
            <p>No available rides</p>
          ) : (
            rides.map((ride) => (
              <div key={ride._id} className="border p-4 mb-2 shadow-md w-1/3 rounded-md">
                <p><strong>Pickup:</strong> {ride.pickup}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Fare:</strong> ₹{ride.fare}</p>
                <button
                  onClick={() => confirmRide(ride._id, ride.pickup, ride.destination,ride.fare)}
                  className="bg-zinc-900 text-white px-4 py-2 mt-2 rounded cursor-pointer"
                >
                  Confirm Ride
                </button>
              </div>
            ))
            
          )}
        </div>
      )}
    </div>
  );
};

export default CaptainDashboard;
