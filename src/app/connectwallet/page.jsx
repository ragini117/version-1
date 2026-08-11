"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import ConnectWalletSection from "../../components/connectwalletDesign/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <ConnectWalletSection />
      </LandingLayout>
    </div>
  );
};

export default page;
