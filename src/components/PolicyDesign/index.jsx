import React, { useState } from "react";
import styles from "./privacyDesign.module.css";
import Head from "next/head";

const page = () => {
  return (
    <>
    <Head>
      <title>Decentrawood Privacy Policy - Your Data Protection and Rights</title>
      <meta name="description" content={`Read Decentrawood's Privacy Policy to learn how we handle, protect, and use your data. Understand your rights regarding privacy, data collection, and secure interactions within our metaverse platform.`}/>
    </Head>
    <section className={` ${styles.policy_bg}`}>
      <div className={`${styles["faq-container"]} container p-4 mt-4 bg-dark`}>
        <h3 className="mb-3 text-white">Privacy Policy for Decentrawood:</h3>
        <div className="accordion accordion-flush" id="accordionFlushExample">
          {/* FAQ 1 */}
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
                >
                Information We Collect
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
              >
              <div className="accordion-body">
                <h5>Personal Information:</h5>
                <p>
                  When you create an account or interact with Decentrawood, we
                  may collect personal information such as your name, email
                  address, and contact information.
                </p>
                <h5>Usage Data:</h5>
                <p>
                  We collect information about how you use Decentrawood,
                  including your interactions with the website, IP address,
                  browser type, and device information.
                </p>
                <h5>Cookies:</h5>
                <p>
                  Decentrawood uses cookies and similar tracking technologies to
                  enhance your browsing experience and analyze website usage.
                </p>
              </div>
            </div>
          </div>
          {/* FAQ 2 */}
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
                >
                How We Use Your Information
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#accordionFlushExample"
              >
              <div className="accordion-body">
                <p>
                  We use the information we collect to provide, maintain, and
                  improve Decentrawood's services, including personalizing your
                  experience and analyzing website performance.
                </p>
                <p>
                  Your personal information may be used to communicate with you,
                  respond to inquiries, and send you important updates and
                  notifications.
                </p>
                <p>
                  We may use aggregated and anonymized data for statistical and
                  research purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
                >
                Information Sharing and Disclosure
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#accordionFlushExample"
              >
              <div className="accordion-body">
                <p>
                  Decentrawood employs industry-standard security measures to
                  protect your information from unauthorized access, disclosure,
                  alteration, or destruction.
                </p>
                <p>
                  However, no method of transmission over the internet or
                  electronic storage is completely secure, so we cannot
                  guarantee absolute security.
                </p>
              </div>
            </div>
          </div>

          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFour"
                aria-expanded="false"
                aria-controls="flush-collapseFour"
                >
                Children's Privacy
              </button>
            </h2>
            <div
              id="flush-collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingFour"
              data-bs-parent="#accordionFlushExample"
              >
              <div className="accordion-body">
                <p>
                  Decentrawood is not directed to children under the age of 18.
                  We do not knowingly collect personal information from
                  individuals under 18 years of age.
                </p>
              </div>
            </div>
          </div>

          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFive"
                aria-expanded="false"
                aria-controls="flush-collapseFive"
                >
                Third-Party Links
              </button>
            </h2>
            <div
              id="flush-collapseFive"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingFive"
              data-bs-parent="#accordionFlushExample"
              >
              <div className="accordion-body">
                <p>
                  Decentrawood may contain links to third-party websites or
                  services. We are not responsible for the privacy practices or
                  content of these third parties.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ 6 */}
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseSix"
                aria-expanded="false"
                aria-controls="flush-collapseSix"
                >
                Changes to Privacy Policy
              </button>
            </h2>
            <div
              id="flush-collapseSix"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingSix"
              data-bs-parent="#accordionFlushExample"
              >
              <div className="accordion-body">
                <p>
                  We reserve the right to modify this Privacy Policy at any
                  time. Any changes will be effective immediately upon posting.
                  We encourage you to review this Privacy Policy periodically
                  for updates.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ 7 */}
          <div className="accordion-item rounded-3 border-0 shadow mb-2">
            <h2 className="accordion-header">
              <button
                className="accordion-button border-bottom collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseSeven"
                aria-expanded="false"
                aria-controls="flush-collapseSeven"
                >
                Contact Us
              </button>
            </h2>
            <div
              id="flush-collapseSeven"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingSeven"
              data-bs-parent="#accordionFlushExample"
              >
              <div className="accordion-body">
                <p>
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us at{" "}
                  <span className={styles["contact"]}>
                    info.decentrawood.com
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
              </>
  );
};

export default page;
