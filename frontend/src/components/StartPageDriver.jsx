import React from 'react'
import { Link } from 'react-router-dom'

const StartPageDriver = () => {
  return (
    <div>
        <div className="h-screen flex flex-col md:flex-row w-full mx-auto p-12 bg-white">
        {/* Image section */}
        <div className="w-full md:w-1/2 p-20">
          <img
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_1152,w_1152/v1684855112/assets/96/4dd3d1-94e7-481e-b28c-08d59353b9e0/original/earner-illustra.png"
            alt="Driver in car illustration"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Content section */}
        <div className="w-full md:w-1/2 p-24  flex flex-col justify-center">
          <h1 className="text-6xl mr-20 md:text-5xl font-bold text-black mb-6">
            Drive when you want, make what you need
          </h1>

          <p className="text-gray-800 text-lg mb-8">
            Make money on your schedule with deliveries or rides—or both. You
            can use your own car or choose a rental through Uber.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Link to={"/captain-register"} className="bg-black text-white font-medium py-3 px-6 rounded-md hover:bg-gray-800 transition duration-300 w-full sm:w-auto">
              Get started
            </Link>

            <Link to={"/captain-login"} className="text-gray-800 text-lg underline cursor-pointer">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default StartPageDriver