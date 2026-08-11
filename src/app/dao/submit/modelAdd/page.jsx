"use client";
import React from "react";
import LandingLayout from "../../../../components/landingLayout";
import Add from "@/components/daoDesign/proposalCategory/modelBuild/add";
const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <Add />
      </LandingLayout>
    </div>
  );
};

export default page;
