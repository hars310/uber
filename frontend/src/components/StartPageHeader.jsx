import React from 'react'
import { Link } from 'react-router-dom'

const StartPageHeader = () => {
  return (
    <div>
         <header className="bg-black text-white px-6 py-3 flex justify-between items-center">
        <div className="flex px-20 items-center gap-6">
          <span className="text-2xl font-bold">Uber</span>
          <nav className="hidden md:flex gap-6">
            <Link to="#" className="text-md font-medium">
              Ride
            </Link>
            <Link to="#" className="text-md font-medium">
              Drive
            </Link>
            <Link to="#" className="text-md font-medium">
              Business
            </Link>
            <Link to="#" className="flex items-center text-sm font-medium">
              About <i className="ri-arrow-down-s-line ml-1"></i>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium flex items-center">
            <i className="ri-global-line mr-2"></i> EN
          </button>
          <Link to="#" className="text-sm font-medium">
            Help
          </Link>
          <Link to="/login" className="text-sm font-medium">
            Log in
          </Link>
          <Link to="/register"
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
          >
            Sign up
          </Link>
        </div>
      </header>
    </div>
  )
}

export default StartPageHeader