import React, { useEffect } from 'react'

const RideOptions = ({captainDetails,isSearching,fareData,handleCreateRide,creatingRide}) => {
  useEffect(() => {
    if (captainDetails) {
      console.log("Captain Details Updated:", captainDetails);
    }
  }, [captainDetails]);
  return (
    <div className=' w-1/4 h-fit border rounded-md p-4 border-gray-200 shadow-md'>
         <div className="flex flex-col gap-4">
        {isSearching ? (
          <div className="h-[50vh] flex flex-col justify-center items-center">
            <i className="ri-loader-2-line text-7xl animate-spin"></i>
            <p className="text-xl font-semibold">Looking for a captain...</p>
          </div>
        ) : captainDetails ?   (
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
          <div className="w-full flex flex-col gap-4">
            {fareData && Object.keys(fareData).length > 0 ? (
              Object.entries(fareData).map(([type, price]) => (
                <button
                  key={type}
                  onClick={() => handleCreateRide(type, price)}
                  className="cursor-pointer text-black w-full p-4 rounded-lg flex items-center justify-between border border-gray-300 shadow-md hover:bg-zinc-200 transition-all"
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
              )
            )
            
            ) : (
             <div className='hidden'>
               <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-blue-700 font-medium">
                Please click on <span class="font-semibold">Find Ride</span> to get fare and vehicle details.
              </p>
            </div>
             </div>

            
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RideOptions