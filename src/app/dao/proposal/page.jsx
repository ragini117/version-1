"use client";
import React from "react";
import LandingLayout from "@/components/landingLayout";
import ProposalSection from "@/components/daoDesign/proposal"; // Assuming you want the same component

const Page = () => {
  return (
    <LandingLayout footer>
      <ProposalSection />
    </LandingLayout>
  );
};

export default Page;
