"use client";
import React from "react";
import NftDashbordLayout from "../../../../components/nftDashboardLayout"
import NftDigitalArtNfts from "../../../../components/nftMarketDashboardDesign/digitalArtDesign";

const page = () => {
  return (
    <NftDashbordLayout>
      <NftDigitalArtNfts />
    </NftDashbordLayout>
  );
};
export default page;
