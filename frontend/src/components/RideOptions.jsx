import React from 'react'

const RideOptions = ({captainDetails,isSearching,fareData,handleCreateRide,creatingRide}) => {
    // console.log(isSearching)
  return (
    <div className=' w-1/4'>
         <div className="flex flex-col gap-4">
        {isSearching ? (
          <div className="h-[50vh] flex flex-col justify-center items-center">
            <i className="ri-loader-2-line text-7xl animate-spin"></i>
            <p className="text-xl font-semibold">Looking for a captain...</p>
          </div>
        ) : captainDetails ? (
          <div className="border p-4 rounded-lg shadow-md flex flex-col items-center">
            <img
              src={captainDetails.profileImage || "/default-captain.png"}
              alt="Captain"
              className="w-24 h-24 rounded-full mb-2"
            />
            <h3 className="text-lg font-bold">{captainDetails.name}</h3>
            <p className="text-sm text-gray-500">
              Rating: {captainDetails.rating || "N/A"} ⭐
            </p>
            <p className="text-sm text-gray-500">
              Vehicle: {captainDetails.vehicleType}
            </p>
            <p className="text-md font-semibold">
              Arriving in {captainDetails.eta || "5 mins"}
            </p>
          </div>
        ) : (
          <div className="w-full  flex flex-col gap-4">
            {fareData && Object.keys(fareData).length > 0 ? (
              Object.entries(fareData).map(([type, price]) => (
                <button
                  key={type}
                  onClick={() => handleCreateRide(type, price)}
                  className="cursor-pointer text-black w-full p-4 rounded-lg flex items-center justify-between shadow-md hover:bg-gray-300 transition-all"
                  // disabled={creatingRide}
                >
                  <img
                    src={`uber-${type}.png`}
                    alt={type}
                    className="w-24 h-24 object-contain"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{type.toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">7 mins Away</p>
                  </div>
                  <p className="text-xl font-semibold">₹{price}</p>
                  {creatingRide && (
                    <p className="text-blue-500 text-sm">Booking...</p>
                  )}
                </button>
              ))
            ) : (
              <p>No available ride options</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RideOptions