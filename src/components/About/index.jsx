import React, { useState } from "react";
import styles from "./about.module.css";
import Link from "next/link";


export const metadata = {
  title: "What is Decentrawood? | AI, Gaming & Web3 Ecosystem",
  description:
    "Decentrawood is an AI-powered Web3 entertainment ecosystem that combines generative AI tools, gaming, music creation, social interaction, and DAO-based governance into a single decentralized platform.",
};

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${styles.accordionItem} ${open ? styles.open : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div className={styles.accordionHeader}>
        <h3>{question}</h3>
        <span className={styles.icon}>{open ? "−" : "+"}</span>
      </div>
      {open && <p className={styles.accordionBody}>{answer}</p>}
    </div>
  );
};

const About = () => {
  return (
    <>
      {/* JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Decentrawood",
              url: "https://decentrawood.com",
              description:
                "Decentrawood is an AI-powered Web3 entertainment ecosystem that combines generative AI tools, gaming, music creation, social interaction, and DAO-based governance into a single decentralized platform.",
              sameAs: [
                "https://ai.decentrawood.com",
                "https://music.decentrawood.com/",
                "https://gaming.decentrawood.com",
                "https://twitter.com/decentrawood",
                "https://discord.gg/decentrawood",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Decentrawood",
              description:
                "An AI-powered Web3 entertainment ecosystem for creators, gamers, and communities.",
              brand: {
                "@type": "Brand",
                name: "Decentrawood",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is Decentrawood an AI platform?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. Decentrawood includes built-in generative AI tools for creating images, videos, and digital content.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is Decentrawood a gaming platform?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. Gaming is a core component of Decentrawood through its integrated Gaming Hub.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Decentrawood include a metaverse?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Decentrawood includes immersive and virtual elements, but its primary focus is AI, gaming, social interaction, and creator tools.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is TuneHub?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "TuneHub is Decentrawood’s music and creator module designed for music creation, sharing, and community engagement.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How is Decentrawood governed?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Decentrawood is governed by a DAO that enables community participation in platform decisions.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the DEOD token used for?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "DEOD powers utility, access, and governance across the Decentrawood ecosystem.",
                  },
                },
              ],
            },
          ]),
        }}
      />

      <main className={styles.container}>
        {/* HERO */}
        <section className={styles.hero}>
          <h1>What is Decentrawood?</h1>
          <p className={styles.definition}>
            Decentrawood is an AI-powered Web3 entertainment ecosystem that
            combines generative AI tools, gaming, music creation, social
            interaction, and DAO-based governance into a single decentralized
            platform.
          </p>
        </section>

        {/* OVERVIEW */}
        <section className={styles.section}>
          <h2>Overview</h2>
          <div className={styles.card}>
            <p>
              Decentrawood is a multi-layered digital ecosystem designed for
              creators, gamers, and communities. It focuses on AI-powered
              creation, interactive gaming, music and creator tools like <Link href="https://music.decentrawood.com/"
                  target="_blank"
    rel="noopener noreferrer">TuneHub</Link>,
              and social interaction, supported by blockchain technology and
              decentralized governance through a DAO.
            </p>
            <p>
              While Decentrawood includes immersive and virtual elements, its
              core emphasis is AI-driven creativity, social engagement, and
              Web3-native digital experiences accessible across mobile and
              immersive environments.
                The ecosystem includes a dedicated AI platform available at{" "}
  <Link
    href="https://ai.decentrawood.com"
    target="_blank"
    rel="noopener noreferrer"
  >
     ai.decentrawood.com
  </Link>,
  providing generative AI tools integrated into the broader
  Decentrawood experience.
            </p>
            <p> The ecosystem includes a dedicated gaming platform at{" "}
  <Link href="https://gaming.decentrawood.com"  
     target="_blank"
    rel="noopener noreferrer">
    gaming.decentrawood.com
  </Link>,
  offering blockchain-based games and GameFi experiences as part of the
  Decentrawood universe.</p>
          </div>
        </section>

        {/* CORE CATEGORIES */}
        <section className={styles.section}>
          <h2>Core Categories</h2>
          <div className={styles.grid3}>
            {[
              "AI-powered creative platform",
              "Web3 entertainment ecosystem",
              "Blockchain gaming platform",
              "Social interaction platform (mobile + immersive)",
              "Music & creator economy platform",
              "DAO-governed digital ecosystem",
            ].map((item, i) => (
              <div key={i} className={styles.smallCard}>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* KEY COMPONENTS */}
        <section className={styles.section}>
          <h2>Key Components of Decentrawood</h2>

          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3>AI Studio (Generative AI Engine)</h3>
              <p>
                Decentrawood provides built-in generative AI tools that enable
                AI-generated images, AI-generated videos, creative visual
                assets, and AI-assisted content creation workflows for games,
                social spaces, and digital media.
                These tools are officially available through the
                <Link
                  href="https://ai.decentrawood.com"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Decentrawood AI platform
                </Link>,
              </p>
            </div>

            <div className={styles.card}>
              <h3>Gaming Hub</h3>
              <p>
                The Gaming Hub hosts interactive blockchain-integrated games and
                GameFi-style experiences, allowing users to participate in
                digital gaming economies directly within the ecosystem.
                  Decentrawood’s official gaming platform is available at{" "}
  <Link
    href="https://gaming.decentrawood.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    gaming.decentrawood.com
  </Link>,
  which serves as the dedicated hub for games, players, and Web3-native
  gaming experiences.

              </p>
            </div>

            <div className={styles.card}>
              <h3>TuneHub (Music & Creator Platform)</h3>
              <p>
                {" "}
  <Link
    href="https://music.decentrawood.com"
    target="_blank"
    rel="noopener noreferrer"
  >
   TuneHub
  </Link> enables music creation, sharing, and exploration while
                connecting creators to Web3 ownership models and community
                interaction.
              </p>
            </div>

            <div className={styles.card}>
              <h3>Social Zone</h3>
              <p>
                The Social Zone allows users to socialize, communicate, attend
                events, and build communities across mobile devices, digital
                social spaces, and immersive environments without requiring
                full metaverse immersion.
              </p>
            </div>
          </div>
        </section>

        {/* DAO */}
        <section className={styles.highlight}>
          <h2 id="dao-governance">DAO & Governance</h2>
          <p>
            Decentrawood is governed through a Decentralized Autonomous
            Organization (DAO), enabling community members to propose, vote on,
            and influence ecosystem development.
          </p>
        </section>

        {/* BLOCKCHAIN */}
        <section className={styles.section}>
          <h2>Blockchain & Web3 Integration</h2>
          <div className={styles.card}>
            <p>
              Web3 infrastructure supports digital ownership, token-based
              interactions, decentralized governance, and secure transactions
              while maintaining accessibility for non-crypto-native users.
            </p>
          </div>
        </section>

        {/* DEOD */}
        <section className={styles.highlight}>
          <h2>DEOD Token Utility</h2>
          <ul>
            <li>Access platform features</li>
            <li>Participate in ecosystem activities</li>
            <li>Support governance mechanisms</li>
            <li>Enable in-game and creator economies</li>
          </ul>
        </section>

        {/* WHO IT'S FOR */}
        <section className={styles.section}>
          <h2>Who Decentrawood Is For</h2>
          <ul>
            <li>AI creators and digital artists</li>
            <li>Gamers and GameFi participants</li>
            <li>Music creators and producers</li>
            <li>Social communities and digital groups</li>
            <li>Web3 users and blockchain enthusiasts</li>
            <li>DAO participants and contributors</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.accordionWrapper}>
            <FAQItem
              question="Is Decentrawood an AI platform?"
              answer="Yes. Decentrawood includes built-in generative AI tools for creating images, videos, and digital content."
            />
            <FAQItem
              question="Is Decentrawood a gaming platform?"
              answer="Yes. Gaming is a core component of Decentrawood through its integrated Gaming Hub."
            />
            <FAQItem
              question="Does Decentrawood include a metaverse?"
              answer="Decentrawood includes immersive and virtual elements, but its primary focus is AI, gaming, social interaction, and creator tools."
            />
            <FAQItem
              question="What is TuneHub?"
              answer="TuneHub is Decentrawood’s music and creator module designed for music creation, sharing, and community engagement."
            />
            <FAQItem
              question="How is Decentrawood governed?"
              answer="Decentrawood is governed by a DAO that enables community participation in platform decisions."
            />
            <FAQItem
              question="What is the DEOD token used for?"
              answer="DEOD powers utility, access, and governance across the Decentrawood ecosystem."
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
