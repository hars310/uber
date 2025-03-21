import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import StartPageHeader from "../components/StartPageHeader";
import StartPageHero from "../components/StartPageHero";
import StartPageFooter from "../components/StartPageFooter";
import StartPageQRPart from "../components/StartPageQRPart";
import StartPageRentCar from "../components/StartPageRentCar";
import StartPageBusiness from "../components/StartPageBusiness";
import StartPageDriver from "../components/StartPageDriver";
import StartPageLogin from "../components/StartPageLogin";
import StartPageSuggestions from "../components/StartPageSuggestions";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  // const token = localStorage.getItem('token')
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: New Delhi

  // useEffect(()=>{
  //   if(!token){
  //     navigate('/login')
  //   }
  // },[navigate,token])

  const handleLocationChange = async () => {
    try {
      const pickupRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          pickup
        )}`
      );
      const destRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          destination
        )}`
      );
      if (pickupRes.data.length > 0 && destRes.data.length > 0) {
        setMapCenter([
          parseFloat(pickupRes.data[0].lat),
          parseFloat(pickupRes.data[0].lon),
        ]);
      }
    } catch (error) {
      console.error("Error fetching coordinates", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
     <StartPageHeader/>

      {/* Hero Section */}
      <StartPageHero/>

      {/* Suggestions Section */}
      <StartPageSuggestions />

      {/* login to see your recent activity */}
      <StartPageLogin />

      {/* driver section*/}
      <StartPageDriver/>

      {/* The Uber you know, reimagined for business */}
      <StartPageBusiness/>

      {/* rent your car */}
      <StartPageRentCar/>


      {/* QR SECTION */}
      <StartPageQRPart/>

      {/* footer section */}
      <StartPageFooter/>
    </div>
  );
};

export default StartPage;
