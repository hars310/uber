import React from 'react'

const StartPageSuggestions = () => {
  return (
    <div>
        <section className="px-20 py-12">
        <div className="p-24">
          <h2 className="text-4xl font-bold mb-6">Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Courier</h3>
                <p className="text-gray-600 text-sm">
                  Uber makes same-day item delivery easier than ever.
                </p>
                <button className="mt-2 px-4 py-2 bg-white border rounded-full text-sm font-medium">
                  Details
                </button>
              </div>
              <img
                src="https://cn-geo1.uber.com/static/mobile-content/Courier.png"
                alt="Courier"
                className="h-32 w-32"
              />
            </div>

            <div className="bg-gray-100 p-6 rounded-lg flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Reserve</h3>
                <p className="text-gray-600 text-sm">
                  Reserve your ride in advance so you can relax on the day of
                  your trip.
                </p>
                <button className="mt-2 px-4 py-2 bg-white border rounded-full text-sm font-medium">
                  Details
                </button>
              </div>
              <img
                src="https://mobile-content.uber.com/uber_reserve/reserve_clock.png"
                alt="Courier"
                className="h-32 w-32"
              />
            </div>

            <div className="bg-gray-100 p-6 rounded-lg flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Ride</h3>
                <p className="text-gray-600 text-sm">
                  Go anywhere with Uber. Request a ride, hop in, and go.
                </p>
                <button className="mt-2 px-4 py-2 bg-white border rounded-full text-sm font-medium">
                  Details
                </button>
              </div>
              <img
                src="https://mobile-content.uber.com/launch-experience/ride.png"
                alt="Courier"
                className="h-32 w-32"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StartPageSuggestions