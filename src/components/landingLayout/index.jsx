import React from "react";
import Header from "./header";
import Footer from "./footer";

const Index = (props) => {
  const { children, footer } = props;
  return (
    <div>
      <Header />
      {children}
      {!footer && <Footer />}
    </div>
  );
};

export default Index;
