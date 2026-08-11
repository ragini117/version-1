"use client";
import NextTopLoader from "nextjs-toploader";
// import NextNProgress from "nextjs-progressbar";

const NextNProgressClient = () => {
  return (
    <NextTopLoader
      color="#0084ff"
      initialPosition={0.08}
      crawlSpeed={200}
      height={6}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      // shadow="0 0 10px #2299DD,0 0 5px #2299DD"
    />
  );
};

export default NextNProgressClient;
