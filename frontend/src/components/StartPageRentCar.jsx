import React from 'react'

const StartPageRentCar = () => {
  return (
    <div>
        <div className="h-screen flex flex-col md:flex-row w-full mx-auto p-12 bg-white">
        {/* Image section */}
        <div className="w-full md:w-1/2 p-20">
          <img
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_1152,w_1152/v1696243819/assets/18/34e6fd-33e3-4c95-ad7a-f484a8c812d7/original/fleet-management.jpg"
            alt="Driver in car illustration"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Content section */}
        <div className="w-full md:w-1/2 p-24  flex flex-col justify-center">
          <h1 className="text-6xl mr-20 md:text-5xl font-bold text-black mb-6">
            Make money by renting out your car
          </h1>

          <p className="text-gray-800 text-lg mb-8">
            Connect with thousands of drivers and earn more per week with Uber’s
            free fleet management tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <button className="bg-black text-white font-medium py-3 px-6 rounded-md hover:bg-gray-800 transition duration-300 w-full sm:w-auto">
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartPageRentCar