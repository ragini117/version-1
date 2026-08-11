// dao/proposal/proposalDetail/[slug]/page.jsx
"use client";
import React from 'react';
import LandingLayout from "@/components/landingLayout";
import ProposalDetail from "@/components/daoDesign/proposalDetail";

const Page = () => {
  return (
    <LandingLayout footer>
      <ProposalDetail />
    </LandingLayout>
  );
};

export default Page;
