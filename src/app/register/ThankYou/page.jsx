"use client";
import React from "react";
import LandingLayout from "../../../components/landingLayout";
import { useSearchParams } from "next/navigation";


const page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <LandingLayout footer>

    
   <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white px-4 py-5">
  <div className="d-flex flex-column flex-md-row align-items-center gap-4 gap-md-5">
    {/* Text Section */}
    <div className="text-start">
      <h1 className="fs-2 fw-bold text-dark">
        Thank You For <br />
        <span className="text-primary">Signing Up!</span>
      </h1>
      <p className="mt-3 fs-5 text-secondary">
        Check the confirmation email at
        <span className="fw-semibold text-dark">
          {' '} {email}
        </span>
      </p>
      <div className="mt-4 text-muted small">
        <p>Note: If you do not receive the email in few minutes:</p>
        <ul className="ps-3">
          <li>Check spam folder</li>
          <li>Verify if you typed your email correctly</li>
        </ul>
      </div>
    </div>
    {/* Illustration */}
    <div className="position-relative" style={{width: '12rem', height: '12rem'}}>
      <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle bg-warning bg-opacity-25" />
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email Sent" className="img-fluid" style={{width: '6rem', height: '6rem', objectFit: 'contain'}} />
      </div>
    </div>
  </div>
</div>

</LandingLayout>
  );
};

export default page;