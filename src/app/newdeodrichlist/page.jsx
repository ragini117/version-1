"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import NewdeodrichlistSection from "../../components/NewdeodrichlistSection/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <NewdeodrichlistSection />
      </LandingLayout>
    </div>
  );
};

export default page;
