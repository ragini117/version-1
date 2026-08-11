"use client";
import React from "react";
import styles from "./daoDesign.module.css";
import Head from "next/head";
import Link from "next/link";

const page = () => {
  return (
    <>
<Head>
      <title>Decentrawood DAO - Decentralized Governance for the Metaverse</title>
      <meta name="description" content={`The Decentrawood DAO, a decentralized governance system empowering users to shape the metaverse. Participate in proposals, vote, and contribute to the future of virtual worlds, games, and digital experiences on Decentrawood.`}/>
    </Head>
      <section className={`${styles.bgdao}`}>
        <div className="container py-5">
          <div className="row py-5">
            <div className="col-12 col-md-6">
              <div className={` ${styles.heading_caption}`}>
                <h3>What Is a Decentralized Autonomous organization (DAO)?</h3>
              </div>
              <div className={` ${styles.caption_box}`}>
                <p>
                  One of the major features of digital currencies is that they
                  are decentralized. This means they are not controlled by a
                  single institution like a government or central bank, but
                  instead are divided among a variety of computers, networks,
                  and nodes.
                </p>
                <p>
                  A decentralized autonomous organization (DAO) is a legal
                  central governing body that is formed to take decisions and
                  act in the best interest of an entity. It is popular in the
                  community of cryptocurrency enthusiasts and blockchain
                  technology
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className={` ${styles.dao_img}`}>
                <img src="/assets/dao1.png" className="img-fluid" alt="not" />
              </div>
            </div>
          </div>

          <div className="row py-5">
            <div className="col-12 col-md-6">
              <div className={` ${styles.dao_img}`}>
                <img src="/assets/dao2.png" className="img-fluid" alt="not" />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className={` ${styles.heading_caption}`}>
                <h3>What is Decentrawood DAO? </h3>
              </div>
              <div className={` ${styles.caption_box}`}>
                <p>
                  Decentrawood DAO is the local governing body for <Link href="/what-is-decentrawood#dao-governance">
    decentrawood platform
  </Link>{" "} which owns a majority of assets which includes smart
                  contracts,  Meta Land contracts, Avatar clothing, accessories,
                  and Market place
                </p>
              </div>
            </div>
          </div>

          <div className="row py-5">
            <div className="col-12 col-md-6">
              <div className={` ${styles.heading_caption}`}>
                <h3>Purpose of Decentrawood DAO, how it is linked to me?</h3>
              </div>
              <div className={` ${styles.caption_box}`}>
                <p>
                  As Decentrawood is a decentralized virtual world, we emphasize
                  on the idea of “PEOPLE IN CONTROL” that creates DAO, which
                  means you the user who indulge, create and own the virtual
                  space will hold the policies that determine how this metaverse
                  behaves. This includes deciding on what items are allowed (or
                  disallowed) to launch, auction, and many more
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className={` ${styles.dao_img}`}>
                <img src="/assets/dao3.png" className="img-fluid" alt="not" />
              </div>
            </div>
          </div>

          <div className="row py-5">
            <div className="col-12 col-md-6">
              <div className={` ${styles.dao_img}`}>
                <img src="/assets/dao4.png" className="img-fluid" alt="not" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className={` ${styles.heading_caption}`}>
                <h3>How does the DAO work?</h3>
              </div>
              <div className={` ${styles.caption_box}`}>
                <p>
                  The community will put forward an idea and vote on upgrades,
                  Meta land auction, policy updates, whitelisting of NFT
                  contracts and whatever the community deems appropriate. The
                  voting is governed by decentrawood DAO's governance interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default page;
