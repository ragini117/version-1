"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import LoderDesign from "../../components/loaderDesign/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <LoderDesign />
      </LandingLayout>
    </div>
  );
};

export default page;
