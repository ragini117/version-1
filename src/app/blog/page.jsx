"use client";
import React from "react";
import LandingLayout from "../../components/landingLayout";
import BlogSection from "../../components/blogDesign/index";
const page = () => {
  return (
    <div>
      <LandingLayout>
        <BlogSection />
      </LandingLayout>
    </div>
  );
};

export default page;
