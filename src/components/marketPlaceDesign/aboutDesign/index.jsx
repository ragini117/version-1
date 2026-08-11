import React from 'react';
import styles from "./aboutDesign.module.css";

const index = () => {
  return (
<div className={styles["about-container"]}>
      <div className={styles["image-container"]}>
        <img src="../assets/dashbordbanner.png" alt="Background" className={styles["background-image"]} />
      </div>
      <div className={styles["content"]}>
        <h2 className={styles["section-title"]}>The Decentrawood:</h2>
        <p>Welcome to Decentrawood, a groundbreaking virtual world at the intersection of blockchain technology, virtual reality, and artificial intelligence. Decentrawood offers users an immersive experience like no other, where the boundaries between the physical and digital realms blur, and endless possibilities await exploration.</p>
        <p>At Decentrawood, we believe in creating a new paradigm for virtual living, where users can socialize, communicate, travel, game, and entertain themselves in ways previously unimaginable. Our platform is powered by cutting-edge technology, including blockchain, which ensures data integrity, transparency, and security, enabling users to truly own and control their digital assets.</p>
        <p>With Decentrawood, anyone can become a citizen of this virtual world, where they can buy land, build or import non-fungible tokens (NFTs), create avatars, and immerse themselves in entirely different realities. Whether you're a content creator, gamer, entrepreneur, or simply looking for new experiences, Decentrawood welcomes you to join our growing community and shape the future of virtual reality.</p>
      </div>
      <div className={styles["content"]}>
        <h2 className={styles["section-title"]}>What is LAND?</h2>
        <p>In Decentrawood, LAND represents digital parcels of virtual real estate that users can own, develop, and monetize within the virtual world. These LAND parcels serve as the foundation for building immersive experiences, whether it's creating virtual homes, businesses, entertainment venues, or entire ecosystems.</p>
        <p>Owning LAND in Decentrawood grants users exclusive rights to develop and customize their virtual properties, including the ability to design landscapes, construct buildings, and host events. Additionally, LANDowners have the opportunity to earn passive income by leasing or selling their virtual properties to other users, fostering a dynamic and vibrant virtual economy.</p>
        <p>With LAND, users can unleash their creativity and entrepreneurial spirit, transforming virtual landscapes into thriving communities and digital destinations. Whether you're a seasoned developer or a novice explorer, LAND offers endless possibilities for innovation and expression within the Decentrawood metaverse.</p>
      </div>
      <div className={styles["content"]}>
        <h2 className={styles["section-title"]}>DEOD Token:</h2>
        <p>The DEOD token is the native utility token of Decentrawood, designed to facilitate transactions, incentivize user participation, and govern the decentralized ecosystem. DEOD tokens serve as the primary medium of exchange within the platform, enabling users to purchase virtual assets, pay for services, and participate in decentralized governance.</p>
        <p>As the backbone of the Decentrawood economy, DEOD tokens play a vital role in driving value and fostering community engagement. Users can earn DEOD tokens through various activities, such as creating and trading digital assets, participating in events, contributing to the platform's development, and staking tokens to secure the network.</p>
        <p>Furthermore, DEOD tokens enable users to take part in the governance of Decentrawood through decentralized autonomous organizations (DAOs), where they can propose and vote on changes, upgrades, and initiatives that shape the future of the platform. By leveraging blockchain technology and decentralized governance, DEOD tokens empower users to collectively govern and evolve the Decentrawood ecosystem for the benefit of all participants.</p>
      </div>
    </div>
  );
};

export default index;
