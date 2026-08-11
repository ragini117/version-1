"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import DeodToken from "@/components/DeodToken";
import DepositDeodOnMexc from "@/components/DeodToken/depositDeodOnMexc";


const page = () => {
    return (
      <LandingLayout>
       <DepositDeodOnMexc />
      </LandingLayout>
    );
};
  
export default page;