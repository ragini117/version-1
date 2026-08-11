"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import PlayasguestSection from "../../components/PlayasguestDesign/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <PlayasguestSection />
      </LandingLayout>
    </div>
  );
};

export default page;
