import React, { useContext, useEffect } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';

const Home = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user]);

  return (
    <div className="relative w-full h-screen">
      {/* Full-Screen Map */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      {/* Uber Logo on Top of Map */}
      <img
        className="absolute top-5 left-16 w-20 z-[1000]" // Higher z-index
        src="uber-removebg-preview.png"
        alt="Uber Logo"
      />
    </div>
  );
};

export default Home;
