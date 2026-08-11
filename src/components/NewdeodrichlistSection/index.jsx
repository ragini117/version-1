"use client";

import styles from "./newdeodrichlistSection.module.css";

const page = () => {
  const TOKEN_ADDRESS = "0x3510fbbc13090f991ffa523527113a166161683e";

  const data = [
    {
      title: "Liquidity (CEX & DEX)",
      address: "0x565ee4a6ac5c278cbf2f02b2d92671feab132766",
      amount: "198,655,814.6832",
      color: styles.cardBlue,
    },
    {
      title: "Team",
      address: "0xF4677f834C03bCb9D30E664138Ed1fB34058296D",
      amount: "100,000,000",
      color: styles.cardPurple,
    },
    {
      title: "DAO & Reserve",
      address: "0xBFD715bfdf83007E0551325AbaB5b312f84A0B7F",
      amount: "60,000,000",
      color: styles.cardGreen,
    },
    {
      title: "Marketing & Promotions",
      address: "0xED0c630a4AF2d4e0766E88907AfeFaCF3aa753A0",
      amount: "195,700,000",
      color: styles.cardOrange,
    },
    {
      title: "Staking",
      address: "0x4BB60C0C1545508C7f717d1f9583cE011c57403C",
      amount: "569,230,700",
      color: styles.cardPink,
    },
    {
      title: "Staking & Reward",
      address: "0x37187c14F2fC126806473b6d2e0B21EB15c4BfB7",
      amount: "170,769,300",
      color: styles.cardCyan,
    },
  ];

  const shortAddress = (addr) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;




const handleView = (walletAddress) => {
  const url = `https://bscscan.com/token/${TOKEN_ADDRESS}?a=${walletAddress}`;
  window.open(url, "_blank"); // opens in new tab
};
  return (
    <section className={styles.richlist_bg}>
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className={styles.page_title}>RichList</h1>
            <p className={styles.page_subtitle}>
              Wallet distribution & fund allocation overview
            </p>
          </div>
        </div>

        <div className="row g-4">
          {data.map((item, index) => (
            <div className="col-12 col-sm-6 col-lg-4" key={index}>
              <div className={`${styles.rich_card} ${item.color}`}>
                <h3 className={styles.card_title}>{item.title}</h3>

                <div className={styles.info_row}>
                  <span>Address</span>
                  <strong>{shortAddress(item.address)}</strong>
                </div>

                <div className={styles.info_row}>
                  <span>Amount</span>
                  <strong>{item.amount}</strong>
                </div>

             <button
  className={styles.view_btn}
  onClick={() => handleView(item.address)}
>
  View
</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default page;
