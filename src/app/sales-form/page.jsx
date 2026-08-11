import React from 'react'
import LandingLayout from "../../components/landingLayout";
import SalesformDesign from "../../components/salesformDesign/index";
const page = () => {
  return (
    <div>
        <LandingLayout footer>
            <SalesformDesign />
        </LandingLayout>
    </div>
  )
}

export default page