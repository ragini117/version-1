"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import RegisterSection from "../../components/registerDesign/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <RegisterSection />
      </LandingLayout>
    </div>
  );
};

export default page;
