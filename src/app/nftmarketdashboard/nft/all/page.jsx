"use client";
import React from "react";
import NftDashbordLayout from "../../../../components/nftDashboardLayout"
import NftAllNfts from "../../../../components/nftMarketDashboardDesign/allNftsDesign";
const page = () => {
  return (
    <NftDashbordLayout>
      <NftAllNfts />
    </NftDashbordLayout>
  );
};

export default page;
