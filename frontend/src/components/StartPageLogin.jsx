import React from 'react'
import { Link } from 'react-router-dom'

const StartPageLogin = () => {
  return (
    <div>
        <main className="lg:h-[75vh] flex flex-col lg:flex-row justify-around py-12 px-20">
        {/* Left Section */}

        <div className="flex flex-col w-1/2 px-20 py-20 ">
          <h1 className="text-5xl mb-10 font-bold">
            Log in to see your recent activity
          </h1>
          <p className="text-md font-semibold mr-12 mb-4 ">
            View past trips, tailored suggestions, support resources, and more.
          </p>
          <button className="w-2/3 mt-4 bg-zinc-900 text-white text-xl rounded-lg p-3">
            Log in to your Account
          </button>
          <Link className="mt-6 text-lg" href="/register">
            Don’t have an Uber account? Sign up
          </Link>
        </div>

        {/* Map Section */}
        <div className="w-1/2 p-12  lg:w-1/2 mt-10 lg:mt-0">
          <img
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_768,w_1152/v1730197725/assets/0f/48c7ba-da13-4fdc-b54c-42878042f513/original/Airport-Fall.png"
            className=""
            alt=""
          />
        </div>
      </main>
    </div>
  )
}

export default StartPageLogin