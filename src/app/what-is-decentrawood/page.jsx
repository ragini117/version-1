"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import About from "@/components/About";


const page = () => {
    return (
      <LandingLayout>
       <About />
      </LandingLayout>
    );
};
  
export default page;