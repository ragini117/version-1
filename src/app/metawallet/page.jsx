"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import MetaWalletSection from "../../components/metawallet/index";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <MetaWalletSection />
      </LandingLayout>
    </div>
  );
};

export default page;
