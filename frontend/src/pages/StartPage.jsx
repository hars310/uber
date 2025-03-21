import React from "react";
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

const StartPage = () => {
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
