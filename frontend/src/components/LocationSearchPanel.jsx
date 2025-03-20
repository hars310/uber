import React from 'react';

const LocationSearchPanel = () => {
  const locations = [
    'New York, USA',
    'Los Angeles, USA',
    'Chicago, USA',
    'San Francisco, USA',
    'Houston, USA',
    'Miami, USA',
    'Boston, USA',
    'Dallas, USA',
  ];

  return (
    <div className="h-full  rounded-md overflow-y-auto z-10 shadow-lg ">
      <ul className=" bg-white w-full  mt-1 rounded-md max-h-60  z-10">
        {locations.map((location, index) => (
          <li
            key={index}
            className="p-3 border m-1 rounded-md cursor-pointer hover:bg-gray-100 flex items-center gap-2 border-b border-gray-200"
          >
            {/* Sample Icon for each location */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="ri-map-pin-line text-gray-600"></i> 
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">{location}</h3>
              <p className="text-xs text-gray-500">Suggested location</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationSearchPanel;
