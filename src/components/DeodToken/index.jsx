import React from "react";
import styles from "./deodtoken.module.css";

const DeodToken = () => {
  return (
    <main className={styles.container}>
      <div className={styles.card}>

        <h1 className={styles.title}>Deod Tokenomics Overview</h1>

        <p className={styles.text}>
          This page explains the tokenomics of Deod, covering both the new upgraded contract (Deod v2) and the old legacy contracts on BNB and Polygon. The goal is to provide full transparency around supply, allocation, and circulating tokens.
        </p>

        {/* ===================== NEW TOKENOMICS ===================== */}
        <div className={styles.newSection}>
          <span className={styles.labelNew}>Deod v2 — Current Contract</span>

          <section>
            <h2 className={styles.sectionTitle}>
              New Deod Tokenomics (v2 – Current Contract)
            </h2>

            <p className={styles.text}>
              <strong>Network:</strong> BNB Chain
              <br/>Current Live Contract Address:

            </p>

            <p className={styles.address}>
              <strong>Contract:</strong>{" "}
              0x3510FbBC13090F991Ffa523527113A166161683e
            </p>

            <h3 className={styles.sectionTitle}>Supply Summary</h3>
            <ul>
              <li className={styles.listItem}>
                 <strong> Maximum supply</strong> is same as old token contract 2 billion.
                 <p>Out of which 110 million was burnt in the old contract so the same amount is burnt in the new contract too
So maximum supply after burning = 189 million
</p>
              </li>
              {/* <li className={styles.listItem}><strong>Tokens Burned:</strong> 11 Cr</li> */}
              {/* <li className={styles.listItem}>
                <strong>Maximum Supply After Burn:</strong> 1.89 Billion (189 Cr)
              </li> */}
            </ul>
          </section>

          {/* ===== NEW: TEXT + IMAGE SIDE BY SIDE ===== */}
          <div className={styles.sideBySide}>
            <section className={styles.textBlock}>
              <h2 className={styles.sectionTitle}>Allocation Breakdown</h2>
              <p>Keeping security and scalability aspect in mind. All token in the new contract is pre minted. And alloted as follows
              
              </p>

              <ul className={styles.allocation}>
                <li className={styles.listItem}>
                  <strong>1. Holder airdrop all the amount</strong>: 594,300,000
                  <p>Holders of minted token is  
Allocated to ensure a smooth migration for the minted token holders in the old contract to the new deod v2 contract keeping circulating supply same as the old contract. In previous contract tokens are allocated and available for minting daily to the allottee. <br/>For 1st year 40% <br/>
2nd year 30%<br/>
3rd year - 30%. </p>
                </li>
                <li className={styles.listItem}>
                  <strong>2. Old Allotted Tokens (Staked – 7 Years):</strong>{" "}
                  564,230,700
                  <p>As in the new contract minting function was removed old allottees were provided allotted token vested upto 7yrs. The vesting contract will go live before 15th feb 2026 .</p>
<p>Vesting contract logic is as follows:<br/>
Allottees will get 0.5% monthly reward on their staked amount. After 3 years 20% of staked amount will be released annually till 7yrs. </p>
                </li>
                    <li className={styles.listItem}>
                  <strong>3. Staking Reward Provision:</strong> 170,769,300
                  <p>Allocated for incentivizing long-term token holders through staking rewards.<br/>
                  Allocated for providing reward on staked token. </p>
                </li>
                <li className={styles.listItem}>
                  <strong>4. Liquidity Reserve (CEX & DEX):</strong> 200,000,000
                  <p>Reserved to support exchange listings and maintain healthy on-chain liquidity.</p>
                </li>
                <li className={styles.listItem}>
                  <strong>5. Marketing & Promotion:</strong> 195,700,000
                  <p>Dedicated to ecosystem growth, partnerships, airdrop, bounty and brand expansion.</p>
                </li>
            
                {/* <li className={styles.listItem}>
                  <strong>Token Burn:</strong> 110,000,000
                  <p>Permanently removed from circulation to reduce supply and support long-term value.</p>
                </li> */}
                <li className={styles.listItem}>
                  <strong>6. Team (Vested for 3 Years):</strong> 100,000,000
                  <p>Locked allocation ensuring long-term commitment from the core team.Release monthly equally for 36 months. </p>
                </li>
                <li className={styles.listItem}>
                  <strong>7. DAO + Treasury:</strong> 60,000,000
                  <p>Reserved for governance, ecosystem grants, and future strategic initiatives.It is controlled by dao committee</p>
                </li>

                <li className={styles.listItem}>
                  <strong>8. Token in Circulation:</strong>Total supply= maximum supply  that is 189
Circulating supply = total supply - holding on 2,3,4,5,6 and 7 allocated wallets.
                </li>
              </ul>
            </section>

            <div className={styles.imageWrapper}>
              <img
                src="/assets/newdeodtoken.png"
                alt="New Deod Token Pie Chart"
                className={styles.chartImage}
              />
            </div>
          </div>

          <section className={styles.takeaway}>
            <h2 className={styles.sectionTitle}>Key Takeaway</h2>
            <p className={styles.text}>
              Deod v2 is designed with long-term sustainability, reduced
              circulating supply, and clear vesting mechanisms, ensuring
              fairness for holders and alignment with ecosystem growth.
            </p>
          </section>
        </div>

        {/* ============ GLOW DIVIDER ============ */}
        <div className={styles.sectionDivider}></div>

        {/* ===================== OLD TOKENOMICS ===================== */}
        <div className={styles.oldSection}>
          <span className={styles.labelOld}>
            Legacy Contracts (Polygon & BNB)
          </span>

          <section className={styles.note}>
            <h2 className={styles.sectionTitle}>
              Old Deod Tokenomics (Legacy Contracts)
            </h2>
            <p>The following data represents the legacy Deod contracts that were active prior to the v2 upgrade</p>

            <p className={styles.text}>
              <strong>Polygon(Old Deod) : </strong>{" "}
              0xE77aBB1E75D2913B2076DD16049992FFeACa5235
            </p>

            <p className={styles.text}>
              <strong>BNB Chain(Old Deod) : </strong>{" "}
              0x7f4B7431a4E1B9f375EF0A94224eA4Ef09B4F668
            </p>
          </section>

          {/* ===== OLD: SUPPLY OVERVIEW + IMAGE SIDE BY SIDE ===== */}
          {/* <div className={styles.sideBySide}>
            <section className={styles.textBlock}>
              <h3 className={styles.sectionTitle}>
                Supply Overview (Old Contracts)
              </h3>

              <ul>
                <li className={styles.listItem}>
                  Total Minted Tokens: 62 Cr
                </li>
                <li className={styles.listItem}>
                  Total Burned Tokens: 20.6 Cr
                  <p>
                    Polygon: 11 Cr <br/>
                    BNB: 9.6 Cr
                  </p>
                </li>
                <li className={styles.listItem}>
                  Total Staked Tokens: 27.67 Cr
                  <p>
                    Polygon: 18.54 Cr <br/>
                    BNB: 9.13 Cr
                  </p>
                </li>
                <li className={styles.listItem}>
                  Circulating Supply: 5.03 Cr
                </li>
              </ul>
            </section>

            <div className={styles.imageWrapper}>
              <img
                src="/assets/olddeodtoken.png"
                alt="Old Deod Token Pie Chart"
                className={styles.chartImage}
              />
            </div>
          </div> */}

          {/* <section>
            <h2 className={styles.sectionTitle}>
              Circulating Supply Calculation
            </h2>

            <p className={styles.calc}>
              62 Cr (Minted)<br/> – 20.6 Cr (Burned)<br/> – 27.67 Cr (Staked)<br/> – 1.5 Cr
              (System Holding)<br/> – 4.5 Cr (Whale Holdings – Polygon)<br/> – 2.7 Cr
              (Whale Holdings – BNB)<br/> = <strong>5.03 Cr Circulating Supply</strong>
            </p>
          </section>

          <section className={styles.note}>
            <h2 className={styles.sectionTitle}>Distribution Insight</h2>

            <p className={styles.text}>
             The majority of tokens in the old contracts were either burned, staked, or held in long-term system
and whale wallets, resulting in a very limited circulating supply. This structure laid the foundation for
migrating toward a more scalable and transparent Deod v2 tokenomics model.
            </p>
          </section> */}

          <section className={styles.note}>
            <h2 className={styles.sectionTitle}>Migration Note</h2>

            <p className={styles.text}>
              All eligible holders from the old Deod contracts on Polygon and
              BNB are supported through the Holder Migration Swap / Airdrop
              mechanism in Deod v2, ensuring continuity, fairness, and value preservation.
            </p>

            <p className={styles.address}>
              <strong>Latest Deod v2 Contract (Live):</strong>{" "}
              0x3510FbBC13090F991Ffa523527113A166161683e
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DeodToken;
