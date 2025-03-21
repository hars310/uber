import React from 'react'

const StartPageHeader = () => {
  return (
    <div>
         <header className="bg-black text-white px-6 py-3 flex justify-between items-center">
        <div className="flex px-20 items-center gap-6">
          <span className="text-2xl font-bold">Uber</span>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-md font-medium">
              Ride
            </a>
            <a href="#" className="text-md font-medium">
              Drive
            </a>
            <a href="#" className="text-md font-medium">
              Business
            </a>
            <a href="#" className="flex items-center text-sm font-medium">
              About <i className="ri-arrow-down-s-line ml-1"></i>
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium flex items-center">
            <i className="ri-global-line mr-2"></i> EN
          </button>
          <a href="#" className="text-sm font-medium">
            Help
          </a>
          <a href="#" className="text-sm font-medium">
            Log in
          </a>
          <a
            href="#"
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
          >
            Sign up
          </a>
        </div>
      </header>
    </div>
  )
}

export default StartPageHeader