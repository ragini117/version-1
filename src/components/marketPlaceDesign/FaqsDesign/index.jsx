import React from "react";
import styles from "./faqsDesign.module.css";

const Index = () => {
  return (
    // <div className={`${styles["faq-container"]} container p-4 bg-dark`}>
    //   <h3 className="mb-3 text">FAQs for Decentrawood:</h3>
    //   <div className="accordion accordion-flush" id="accordionFlushExample">
    //     {/* FAQ 1 */}
    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
    //           What is Decentrawood?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //           Decentrawood is a revolutionary virtual world powered by blockchain technology, virtual reality, and artificial intelligence. It offers users the opportunity to explore immersive landscapes, interact with others, create and monetize digital assets, and participate in a vibrant decentralized ecosystem.
    //         </div>
    //       </div>
    //     </div>
    //     {/* FAQ 2 */}
    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
    //           How does Decentrawood work?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //           Decentrawood operates on a decentralized web 0.3 platform, leveraging blockchain technology to ensure data integrity, privacy, and security. Users can access the virtual world through compatible devices, immerse themselves in virtual environments, interact with other users, and engage in various activities such as gaming, socializing, and content creation.
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTree" aria-expanded="false" aria-controls="flush-collapseTree">
    //         What can I do in Decentrawood?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseTree" className="accordion-collapse collapse" aria-labelledby="flush-headingTree" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         In Decentrawood, users can engage in a wide range of activities, including exploring virtual landscapes, socializing with others, creating and trading digital assets such as NFTs, developing games and applications, participating in virtual events, and contributing to the decentralized governance of the platform.
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
    //         How do I get started with Decentrawood?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         To get started with Decentrawood, simply create an account on the platform and download the necessary software or applications. Once logged in, users can customize their avatars, explore the virtual world, connect with other users, and begin participating in various activities offered within the ecosystem.
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
    //         What is the DEOD token and how is it used?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         The DEOD token is the native utility token of Decentrawood, used for various purposes within the platform's ecosystem. It serves as a medium of exchange for goods and services, facilitates transactions, incentivizes user participation and contributions, and enables governance within the decentralized autonomous organization (DAO).
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">
    //         Can I monetize my creations in Decentrawood?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseSix" className="accordion-collapse collapse" aria-labelledby="flush-headingSix" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         Yes, users have the opportunity to monetize their creations in Decentrawood through various means. Whether it's creating and selling digital assets such as NFTs, developing games and applications, or offering services within the virtual world, users can earn rewards and revenue for their contributions to the ecosystem.
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSeven" aria-expanded="false" aria-controls="flush-collapseSeven">
    //         Is Decentrawood compatible with different devices and platforms?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseSeven" className="accordion-collapse collapse" aria-labelledby="flush-headingSeven" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         Yes, Decentrawood is designed to be cross-platform compatible, supporting a wide range of devices and platforms, including smartphones, tablets, PCs, virtual reality headsets, and more. This ensures accessibility and inclusivity, allowing users to seamlessly access and experience the virtual world from their preferred devices.
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseEight" aria-expanded="false" aria-controls="flush-collapseEight">
    //         How does Decentrawood ensure security and privacy?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseEight" className="accordion-collapse collapse" aria-labelledby="flush-headingEight" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         Decentrawood prioritizes security and privacy by leveraging blockchain technology to decentralize data storage and encryption protocols to protect user information. Additionally, users have control over their data and can choose to remain anonymous or selectively share information within the virtual world as per their preferences.
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseNine" aria-expanded="false" aria-controls="flush-collapseNine">
    //         What sets Decentrawood apart from other virtual worlds?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseNine" className="accordion-collapse collapse" aria-labelledby="flush-headingNine" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         Decentrawood distinguishes itself through its decentralized architecture, user-centric design, immersive virtual reality experiences, robust AI ecosystem, and commitment to empowering users with true ownership of digital assets. It offers a unique blend of technology, creativity, and community-driven governance, setting it apart as a leading platform in the evolving metaverse landscape.
    //         </div>
    //       </div>
    //     </div>

    //     <div className="accordion-item rounded-3 border-0 shadow mb-2">
    //       <h2 className="accordion-header">
    //         <button className="accordion-button border-bottom collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTen" aria-expanded="false" aria-controls="flush-collapseTen">
    //         How can I contribute to Decentrawood's development?
    //         </button>
    //       </h2>
    //       <div id="flush-collapseTen" className="accordion-collapse collapse" aria-labelledby="flush-headingTen" data-bs-parent="#accordionFlushExample">
    //         <div className="accordion-body">
    //         There are several ways to contribute to Decentrawood's development, including participating in community events and discussions, providing feedback and suggestions for improvement, creating and sharing content within the virtual world, and supporting the platform's growth through token-based incentives and governance participation.
    //         </div>
    //       </div>
    //     </div>
    //     {/* Repeat the same structure for other FAQ items */}

    //   </div>
    // </div>
    <div className={`${styles["faq-container"]} container p-4 bg-dark`}>
      <h3 className="mb-3 text-white">FAQs for Decentrawood:</h3>
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
              What is Decentrawood?
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Decentrawood is a revolutionary virtual world powered by
              blockchain technology, virtual reality, and artificial
              intelligence. It offers users the opportunity to explore immersive
              landscapes, interact with others, create and monetize digital
              assets, and participate in a vibrant decentralized ecosystem.
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
              How does Decentrawood work?
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingTwo"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Decentrawood operates on a decentralized web 0.3 platform,
              leveraging blockchain technology to ensure data integrity,
              privacy, and security. Users can access the virtual world through
              compatible devices, immerse themselves in virtual environments,
              interact with other users, and engage in various activities such
              as gaming, socializing, and content creation.
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
              What can I do in Decentrawood?
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingThree"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              In Decentrawood, users can engage in a wide range of activities,
              including exploring virtual landscapes, socializing with others,
              creating and trading digital assets such as NFTs, developing games
              and applications, participating in virtual events, and
              contributing to the decentralized governance of the platform.
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
              How do I get started with Decentrawood?
            </button>
          </h2>
          <div
            id="flush-collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingFour"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              To get started with Decentrawood, simply create an account on the
              platform and download the necessary software or applications. Once
              logged in, users can customize their avatars, explore the virtual
              world, connect with other users, and begin participating in
              various activities offered within the ecosystem.
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
              What is the DEOD token and how is it used?
            </button>
          </h2>
          <div
            id="flush-collapseFive"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingFive"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              The DEOD token is the native utility token of Decentrawood, used
              for various purposes within the platform's ecosystem. It serves as
              a medium of exchange for goods and services, facilitates
              transactions, incentivizes user participation and contributions,
              and enables governance within the decentralized autonomous
              organization (DAO).
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
              Can I monetize my creations in Decentrawood?
            </button>
          </h2>
          <div
            id="flush-collapseSix"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingSix"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Yes, users have the opportunity to monetize their creations in
              Decentrawood through various means. Whether it's creating and
              selling digital assets such as NFTs, developing games and
              applications, or offering services within the virtual world, users
              can earn rewards and revenue for their contributions to the
              ecosystem.
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
              Is Decentrawood compatible with different devices and platforms?
            </button>
          </h2>
          <div
            id="flush-collapseSeven"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingSeven"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Yes, Decentrawood is designed to be cross-platform compatible,
              supporting a wide range of devices and platforms, including
              smartphones, tablets, PCs, virtual reality headsets, and more.
              This ensures accessibility and inclusivity, allowing users to
              seamlessly access and experience the virtual world from their
              preferred devices.
            </div>
          </div>
        </div>

        {/* FAQ 8 */}
        <div className="accordion-item rounded-3 border-0 shadow mb-2">
          <h2 className="accordion-header">
            <button
              className="accordion-button border-bottom collapsed fw-semibold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseEight"
              aria-expanded="false"
              aria-controls="flush-collapseEight"
            >
              How does Decentrawood ensure security and privacy?
            </button>
          </h2>
          <div
            id="flush-collapseEight"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingEight"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Decentrawood prioritizes security and privacy by leveraging
              blockchain technology to decentralize data storage and encryption
              protocols to protect user information. Additionally, users have
              control over their data and can choose to remain anonymous or
              selectively share information within the virtual world as per
              their preferences.
            </div>
          </div>
        </div>

        {/* FAQ 9 */}
        <div className="accordion-item rounded-3 border-0 shadow mb-2">
          <h2 className="accordion-header">
            <button
              className="accordion-button border-bottom collapsed fw-semibold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseNine"
              aria-expanded="false"
              aria-controls="flush-collapseNine"
            >
              What sets Decentrawood apart from other virtual worlds?
            </button>
          </h2>
          <div
            id="flush-collapseNine"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingNine"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Decentrawood distinguishes itself through its decentralized
              architecture, user-centric design, immersive virtual reality
              experiences, robust AI ecosystem, and commitment to empowering
              users with true ownership of digital assets. It offers a unique
              blend of technology, creativity, and community-driven governance,
              setting it apart as a leading platform in the evolving metaverse
              landscape.
            </div>
          </div>
        </div>

        {/* FAQ 10 */}
        <div className="accordion-item rounded-3 border-0 shadow mb-2">
          <h2 className="accordion-header">
            <button
              className="accordion-button border-bottom collapsed fw-semibold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTen"
              aria-expanded="false"
              aria-controls="flush-collapseTen"
            >
              How can I contribute to Decentrawood's development?
            </button>
          </h2>
          <div
            id="flush-collapseTen"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingTen"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              There are several ways to contribute to Decentrawood's
              development, including participating in community events and
              discussions, providing feedback and suggestions for improvement,
              creating and sharing content within the virtual world, and
              supporting the platform's growth through token-based incentives
              and governance participation.
            </div>
          </div>
        </div>

        {/* Repeat the same structure for other FAQ items */}
      </div>
    </div>
  );
};

export default Index;
