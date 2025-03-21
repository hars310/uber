import React from 'react'

const StartPageBusiness = () => {
  return (
    <div>
        <main className="h-screen flex flex-col lg:flex-row justify-around p-12">
        {/* Left Section */}

        <div className="flex flex-col w-1/2 px-24 mt-12 py-24">
          <h1 className="text-6xl mb-10  font-bold">
            The Uber you know, reimagined for business
          </h1>
          <p className="text-md font-semibold mr-12 mb-4 ">
            Uber for Business is a platform for managing global rides and meals,
            and local deliveries, for companies of any size.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-8 mt-8">
            <button className="bg-black text-white font-medium py-3 px-6 rounded-md hover:bg-gray-800 transition duration-300 w-full sm:w-auto">
              Get started
            </button>

            <div className="text-gray-800 text-lg underline cursor-pointer">
              Check out our Solutions
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-1/2 p-12  ">
          <img
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_1152,w_1152/v1684887108/assets/76/baf1ea-385a-408c-846b-59211086196c/original/u4b-square.png"
            className="w-[90%]"
            alt=""
          />
        </div>
      </main>
    </div>
  )
}

export default StartPageBusiness