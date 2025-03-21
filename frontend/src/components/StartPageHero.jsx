import React from 'react'
import Map from "../components/Map";
import { Link } from 'react-router-dom';

const StartPageHero = () => {
  return (
    <div>
        <main className="lg:h-auto flex flex-col lg:flex-row justify-around items-center px-6 py-12">
        {/* Left Section */}
        <div className="w-1/2 lg:w-1/2 space-y-6 px-24 py-12 ml-20">
          <h1 className="text-5xl font-bold">Go anywhere with Uber</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 border-b-2 border-black pb-1">
              <i className="ri-car-line"></i>
              <span className="text-lg font-medium">Ride</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500">
              <i className="ri-box-3-line"></i>
              <span className="text-lg">Courier</span>
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            <div className="relative bg-gray-100 p-3 rounded-lg flex items-center">
              <span className="text-gray-500">•</span>
              <input
                type="text"
                placeholder="Pickup location"
                className="bg-transparent outline-none ml-2 w-full text-sm"
              />
              <i className="ri-map-pin-line text-gray-500"></i>
            </div>
            <div className="relative bg-gray-100 p-3 rounded-lg flex items-center">
              <span className="text-gray-500">■</span>
              <input
                type="text"
                placeholder="Dropoff location"
                className="bg-transparent outline-none ml-2 w-full text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center w-1/2 bg-gray-100 p-3 rounded-lg text-sm">
                <i className="ri-calendar-line mr-2"></i>
                Today
              </button>
              <button className="flex items-center w-1/2 bg-gray-100 p-3 rounded-lg text-sm">
                <i className="ri-time-line mr-2"></i>
                Now <i className="ri-arrow-down-s-line ml-auto"></i>
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg">
              See prices
            </button>
            <Link to={"/login"} className="text-md font-bold self-center underline">
              Log in to see your recent activity
            </Link>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-1/2 p-14 mr-12   lg:w-1/2 mt-10 lg:mt-0">
          <Map />
        </div>
      </main>
    </div>
  )
}

export default StartPageHero