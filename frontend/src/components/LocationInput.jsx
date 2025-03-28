import React from 'react'

const LocationInput = ({isLoading,pickup,handleLocationChange,destination,suggestions,handleSelectLocation,handleFindRide}) => {
    
  return (
    <div className='w-1/5 '>
         <div >
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
    </div>
  )
}

export default LocationInput