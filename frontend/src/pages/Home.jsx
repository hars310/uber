import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TripDataContext } from "../context/TripContext";
import StartPageHeader from "../components/StartPageHeader";
import HomeBody from "../components/HomeBody";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setTripDetails } = useContext(TripDataContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      // Retrieve trip details from LocalStorage after login
      const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
      if (storedTrip) {
        setTripDetails(storedTrip);
        // localStorage.removeItem("tripDetails"); // Clean up after restoring
      }
    }
  }, [token, navigate, setTripDetails]);

  return (
    <div className="w-full">
      <StartPageHeader />
      <HomeBody />
    </div>
  );
};

export default Home;
