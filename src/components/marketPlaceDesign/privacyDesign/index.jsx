import React, { useState } from "react";
import styles from "./privacyDesign.module.css";

const Index = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const byDefaultContent = (
    <div className={styles["default-content"]}>
      <p>
        At Decentrawood, we are committed to protecting your privacy. This
        Privacy Policy explains how we collect, use, and disclose information
        when you use our website and services. By accessing or using
        Decentrawood, you consent to the collection and use of your information
        as described in this Privacy Policy.
      </p>
    </div>
  );

  const privacyPolicyContent = {
    "Information We Collect": (
      <div>
        <h3>Personal Information:</h3>
        <p>
          When you create an account or interact with Decentrawood, we may
          collect personal information such as your name, email address, and
          contact information.
        </p>
        <h3>Usage Data:</h3>
        <p>
          We collect information about how you use Decentrawood, including your
          interactions with the website, IP address, browser type, and device
          information.
        </p>
        <h3>Cookies:</h3>
        <p>
          Decentrawood uses cookies and similar tracking technologies to enhance
          your browsing experience and analyze website usage.
        </p>
      </div>
    ),
    "How We Use Your Information": (
      <div>
        <p>
          We use the information we collect to provide, maintain, and improve
          Decentrawood's services, including personalizing your experience and
          analyzing website performance.
        </p>
        <p>
          Your personal information may be used to communicate with you, respond
          to inquiries, and send you important updates and notifications.
        </p>
        <p>
          We may use aggregated and anonymized data for statistical and research
          purposes.
        </p>
      </div>
    ),
    "Information Sharing and Disclosure": (
      <div>
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. However, we may share your information with trusted service
          providers who assist us in operating Decentrawood.
        </p>
        <p>
          Your information may be disclosed if required by law or in response to
          legal requests, such as court orders or subpoenas.
        </p>
      </div>
    ),
    "Data Security": (
      <div>
        <p>
          Decentrawood employs industry-standard security measures to protect
          your information from unauthorized access, disclosure, alteration, or
          destruction.
        </p>
        <p>
          However, no method of transmission over the internet or electronic
          storage is completely secure, so we cannot guarantee absolute
          security.
        </p>
      </div>
    ),
    "Children's Privacy": (
      <div>
        <p>
          Decentrawood is not directed to children under the age of 18. We do
          not knowingly collect personal information from individuals under 18
          years of age.
        </p>
      </div>
    ),
    "Third-Party Links": (
      <div>
        <p>
          Decentrawood may contain links to third-party websites or services. We
          are not responsible for the privacy practices or content of these
          third parties.
        </p>
      </div>
    ),
    "Changes to Privacy Policy": (
      <div>
        <p>
          We reserve the right to modify this Privacy Policy at any time. Any
          changes will be effective immediately upon posting. We encourage you
          to review this Privacy Policy periodically for updates.
        </p>
      </div>
    ),
    "Contact Us": (
      <div>
        <p>
          If you have any questions about this Privacy Policy or our privacy
          practices, please contact us at{" "}
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

<div className={styles["about-container"]}>
      <div className={styles["image-container"]}>
        <img src="../assets/dashbordbanner.png" alt="Background" className={styles["background-image"]} />
        <div className={styles["headingFor-Pricvacy"]}>
          <h1>Privacy Policy</h1>
        </div>
      </div>
      <div className={styles["content"]}>
        <h2 className={styles["section-title"]}>Privacy Policy</h2>
        <p>
          At Decentrawood, we are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and disclose information
          when you use our website and services. By accessing or using
          Decentrawood, you consent to the collection and use of your
          information as described in this Privacy Policy.
        </p>
        <ol>
          <li>
            <h5>Information We Collect:</h5>
            <ul>
              <li>
                <strong>Personal Information:</strong> When you create an
                account or interact with Decentrawood, we may collect personal
                information such as your name, email address, and contact
                information.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about how
                you use Decentrawood, including your interactions with the
                website, IP address, browser type, and device information.
              </li>
              <li>
                <strong>Cookies:</strong> Decentrawood uses cookies and similar
                tracking technologies to enhance your browsing experience and
                analyze website usage.
              </li>
            </ul>
          </li>
          <li>
            <h5>How We Use Your Information:</h5>
            <p>
              We use the information we collect to provide, maintain, and
              improve Decentrawood's services, including personalizing your
              experience and analyzing website performance. Your personal
              information may be used to communicate with you, respond to
              inquiries, and send you important updates and notifications. We
              may use aggregated and anonymized data for statistical and
              research purposes.
            </p>
          </li>
          <li>
            <h5>Information Sharing and Disclosure:</h5>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. However, we may share your information with trusted
              service providers who assist us in operating Decentrawood. Your
              information may be disclosed if required by law or in response to
              legal requests, such as court orders or subpoenas.
            </p>
          </li>
          <li>
            <h5>Data Security:</h5>
            <p>
              Decentrawood employs industry-standard security measures to
              protect your information from unauthorized access, disclosure,
              alteration, or destruction. However, no method of transmission
              over the internet or electronic storage is completely secure, so
              we cannot guarantee absolute security.
            </p>
          </li>
          <li>
            <h5>Children's Privacy:</h5>
            <p>
              Decentrawood is not directed to children under the age of 18. We
              do not knowingly collect personal information from individuals
              under 18 years of age.
            </p>
          </li>
          <li>
            <h5>Third-Party Links:</h5>
            <p>
              Decentrawood may contain links to third-party websites or
              services. We are not responsible for the privacy practices or
              content of these third parties.
            </p>
          </li>
          <li>
            <h5>Changes to Privacy Policy:</h5>
            <p>
              We reserve the right to modify this Privacy Policy at any time.
              Any changes will be effective immediately upon posting. We
              encourage you to review this Privacy Policy periodically for
              updates.
            </p>
          </li>
          <li>
            <h5>Contact Us:</h5>
            <p>
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us at <span>info.decentrawood.com</span>
            </p>
          </li>
        </ol>
        <p>
          By using Decentrawood, you acknowledge that you have read, understood,
          and agree to this Privacy Policy. Thank you for trusting us with your
          information and being a part of the Decentrawood community!
        </p>
      </div>
    </div>
    </>
  );
};

export default Index;
