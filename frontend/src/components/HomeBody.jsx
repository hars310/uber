import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Map from "./Map";
import { TripDataContext } from "../context/TripContext";


function HomeBody() {
    // const {tripDetails} = localStorage.getItem('tripDetails')
    // console.log(tripDetails)

    const {tripDetails} = useContext(TripDataContext)
    console.log(tripDetails)

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

  return (
    <div className="flex flex-col py-8 px-12 md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      {/* Left Section: Ride Details */}
      <div className="w-1/3">
        <div className="bg-white rounded-lg shadow-md p-4 border-1 border-gray-100">
          <h2 className="text-lg font-bold mb-4">Your Trip Details</h2>
          <div className="mb-2">
            <label className="text-gray-500 text-sm">Pickup Location</label>
            <input
              type="text"
              value={tripDetails.pickup || "Not Selected"}
              className="mt-1 p-3 bg-gray-100 font-bold block w-full border-gray-300 rounded-md shadow-sm text-md"
              readOnly
            />
          </div>
          <div className="mb-2">
            <label className="text-gray-500 text-sm">Dropoff Location</label>
            <input
              type="text"
              value={tripDetails.destination || "Not Selected"}
              className="mt-1 p-3 bg-gray-100 font-bold block w-full border-gray-300 rounded-md shadow-sm text-md"
              readOnly
            />
          </div>
          <div className="mb-2">
            <label className="text-gray-500 text-sm">Trip Type</label>
            <select className="mt-1 p-3 bg-gray-100 font-bold block w-full border-gray-300 rounded-md shadow-sm text-md">
              <option>One-way trip</option>
              <option>Round trip</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">Booking For</label>
            <input
              type="text"
              value="For me"
              className="mt-1 p-3 bg-gray-100 font-bold block w-full border-gray-300 rounded-md shadow-sm text-md"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Middle Section: Ride Options */}
      <div className="w-1/2">
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

          <div className="flex justify-between items-center mt-12 p-5 shadow rounded-md">
            <select className="border-gray-300 rounded-md shadow-sm text-md">
              <option>Cash</option>
              <option>Online Payment</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded-lg">Confirm Ride</button>
          </div>
        </div>
      </div>

      {/* Right Section: Map */}
      <div className="w-1/3">
        <div className="bg-gray-100 font-bold rounded-lg">
          <Map markers={[tripDetails.pickupCoords, tripDetails.destinationCoords]} route={tripDetails.route} />
        </div>
      </div>
    </div>
  );
}

export default HomeBody;
