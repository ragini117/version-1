"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import LoginSection from "../../components/loginDesign/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <LoginSection />
      </LandingLayout>
    </div>
  );
};

export default page;
