import React from 'react';
import { useNavigate } from 'react-router-dom';

const LookingForDriver = ({ selectedLocation, selectedVehicle }) => {
  const navigate = useNavigate();

  // Handle the driver finding process. You can replace this with an actual API call to find a driver.
  // Once a driver is found, navigate to the confirmation screen.
  
  // For demonstration, we use a timeout to simulate finding a driver.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/assigned-driver");  // Navigate to ride confirmation once the driver is found
    }, 5000);  // Simulating 5 seconds to find a driver

    return () => clearTimeout(timer);  // Clean up the timeout when the component is unmounted
  }, [navigate]);

  return (
    <div className="flex flex-col p-4 mt-8 w-full">
      <div className="flex flex-col">
        <p className="text-4xl font-bold">Hold On!</p>
        <p className="text-xl">We are finding one of our best Pilots for you</p>
      </div>
      <div className="flex items-center justify-center p-10">
        {/* You can add a loading spinner here */}
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  );
};

export default LookingForDriver;
