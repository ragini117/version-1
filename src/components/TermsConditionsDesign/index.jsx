import React, { useState } from "react";
import styles from "./termsDesign.module.css";
import Head from "next/head";

const page = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const byDefaultContent = (
    <div className={styles["default-content"]}>
      <p>
        Welcome to Decentrawood! These Terms of Use ("Terms") govern your access
        to and use of the Decentrawood website located at [website URL] and any
        related services provided by Decentrawood (collectively referred to as
        the "Service"). Please read these Terms carefully before accessing or
        using the Service.
      </p>
    </div>
  );

  const termsContent = {
    "1. Acceptance of Terms": (
      <div>
        <p>
          By accessing or using the Service, you agree to be bound by these
          Terms and our Privacy Policy. If you do not agree to these Terms or
          our Privacy Policy, you may not access or use the Service.
        </p>
      </div>
    ),
    "2. Use of the Service": (
      <div>
        <p>Decentrawood is open to all individuals, regardless of age.</p>
      </div>
    ),
    "3. User Accounts": (
      <div>
        <p>
          To access certain features of the Service, you may be required to
          create a user account. You are responsible for maintaining the
          confidentiality of your account credentials and for all activities
          that occur under your account.
        </p>
      </div>
    ),
    "4. Content": (
      <div>
        <p>
          You are solely responsible for any content that you create, upload,
          post, display, or otherwise make available on or through the Service
          ("User Content"). By submitting User Content, you grant Decentrawood a
          worldwide, non-exclusive, royalty-free, fully-paid, sublicensable, and
          transferable license to use, reproduce, distribute, modify, adapt,
          publicly perform, and publicly display your User Content in connection
          with the Service.
        </p>
      </div>
    ),
    "5. Intellectual Property": (
      <div>
        <p>
          The Service and its original content, features, and functionality are
          owned by Decentrawood and are protected by international copyright,
          trademark, patent, trade secret, and other intellectual property or
          proprietary rights laws.
        </p>
      </div>
    ),
    "6. Prohibited Conduct": (
      <div>
        <p>
          You may not access or use the Service for any purpose that is unlawful
          or prohibited by these Terms. You agree to comply with all applicable
          laws and regulations regarding your use of the Service.
        </p>
      </div>
    ),
    "7. Termination": (
      <div>
        <p>
          We may terminate or suspend your access to the Service immediately,
          without prior notice or liability, for any reason whatsoever,
          including without limitation if you breach these Terms.
        </p>
      </div>
    ),
    "8. Disclaimer": (
      <div>
        <p>
          The Service is provided on an "as-is" and "as available" basis,
          without any warranties of any kind, express or implied. Decentrawood
          does not warrant that the Service will be uninterrupted, timely,
          secure, or error-free.
        </p>
      </div>
    ),
    "9. Limitation of Liability": (
      <div>
        <p>
          In no event shall Decentrawood, nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential, or punitive damages,
          including without limitation loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your access to or use of
          or inability to access or use the Service; (ii) any conduct or content
          of any third party on the Service; (iii) any content obtained from the
          Service; and (iv) unauthorized access, use, or alteration of your
          transmissions or content, whether based on warranty, contract, tort
          (including negligence), or any other legal theory, whether or not we
          have been informed of the possibility of such damage.
        </p>
      </div>
    ),
    "10. Governing Law": (
      <div>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Decentralized Autonomous Organization (DAO), without regard to
          its conflict of law provisions.
        </p>
      </div>
    ),
    "11. Changes to Terms": (
      <div>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material, we will provide at
          least 30 days' notice prior to any new terms taking effect. What
          constitutes a material change will be determined at our sole
          discretion.
        </p>
      </div>
    ),
    "12. Contact Us": (
      <div>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <span className={styles["contact"]}>info.decentrawood.com</span>
        </p>
      </div>
    ),
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
       <Head>
      <title>Decentrawood Terms & Conditions - User Agreement and Platform Guidelines</title>
      <meta name="description" content={`The Terms & Conditions for using Decentrawood. Understand the rules, user rights, and obligations governing access to our metaverse platform, games, and digital services. `}/>
    </Head>
    <section className={` ${styles.terms_bg}`}>
      <div className={styles["terms-container"]}>
        <div className={styles["terms-list"]}>
          <h2>Terms of Use</h2>
          <ul>
            {Object.keys(termsContent).map((item, index) => (
              <li key={index} onClick={() => handleItemClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* Right side to display selected headline content */}
        <div className={styles["terms-content"]}>
          <h2>{selectedItem}</h2>
          {/* Render content based on selected item */}
          {selectedItem ? termsContent[selectedItem] : byDefaultContent}
        </div>
      </div>
    </section>
    </>
  );
};

export default page;
