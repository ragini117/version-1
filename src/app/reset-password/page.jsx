"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import ResetSection from "../../components/forgotDesign/resetdesign";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <ResetSection />
      </LandingLayout>
    </div>
  );
};

export default page;
