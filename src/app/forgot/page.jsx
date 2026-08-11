"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import ForgotSection from "../../components/forgotDesign/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <ForgotSection />
      </LandingLayout>
    </div>
  );
};

export default page;
