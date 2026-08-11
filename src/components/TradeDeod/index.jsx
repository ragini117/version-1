"use client";
import React from "react";
import Link from "next/link";
import buydeodstyles from "./tradedeod.module.css";

export default function Page() {
  return (
    <div className={buydeodstyles.container}>

      {/* HERO */}
      <section className={buydeodstyles.hero}>
        <div className={buydeodstyles.heroLeft}>
          <h1>Buy DEOD Instantly</h1>
          <p>
            Trade DEOD on top exchanges like MEXC, BitMart, Toobit & PancakeSwap.
          </p>

          <div className={buydeodstyles.ctaRow}>
            <Link href="https://www.mexc.co/en-IN/exchange/DEOD_USDT?_from=header" target="_blank" className={buydeodstyles.primary}>Trade on MEXC</Link>
            <Link href="https://www.bitmart.com/en-US/trade/DEOD_USDT?type=spot" target="_blank" className={buydeodstyles.secondary}>BitMart</Link>
            <Link href="https://www.toobit.com/en-US/spot/DEOD_USDT" target="_blank" className={buydeodstyles.secondary}>Toobit</Link>
            <Link href="https://pancakeswap.finance/swap?outputCurrency=0x3510FbBC13090F991Ffa523527113A166161683e&inputCurrency=0x55d398326f99059fF775485246999027B3197955" target="_blank" className={buydeodstyles.secondary}>PancakeSwap</Link>
            <Link href="https://coindcx.com/" target="_blank" className={buydeodstyles.secondary}>CoinDCX Web3</Link>
            <Link href="https://www.weex.com/spot/DEOD-USDT" target="_blank" className={buydeodstyles.secondary}>WEEX</Link>

          </div>
          

          {/* TICKER (UI) */}
<div className={buydeodstyles.ticker}>
  <span>DEOD/USDT</span>
  <span>$0.024 ▲ 3.2%</span>
</div>
        </div>

        <div className={buydeodstyles.heroRight}>
          <div className={buydeodstyles.glowCard}>
            <h3>Start Trading Now</h3>
            <p>Best liquidity on MEXC</p>
            <Link href="https://www.mexc.co/en-IN/exchange/DEOD_USDT?_from=header" target="_blank" className={buydeodstyles.primary}>Trade Now →</Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className={buydeodstyles.section}>
        <h2>Choose Your Platform</h2>

        <div className={buydeodstyles.cards}>

          {/* MEXC (highlight) */}
          <div className={`${buydeodstyles.card} ${buydeodstyles.highlight}`}>
            <h3>MEXC ⭐</h3>
            <ul>
              <li>High liquidity</li>
              <li>Beginner friendly</li>
              <li>Spot & futures</li>
            </ul>
            <Link href="https://www.mexc.co/en-IN/exchange/DEOD_USDT?_from=header" target="_blank" className={buydeodstyles.primary}>Trade DEOD →</Link>
          </div>

          {/* BitMart */}
          <div className={buydeodstyles.card}>
            <h3>BitMart</h3>
            <ul>
              <li>Global exchange</li>
              <li>Easy onboarding</li>
              <li>Secure</li>
            </ul>
            <Link href="https://www.bitmart.com/en-US/trade/DEOD_USDT?type=spot" target="_blank" className={buydeodstyles.secondary}>Trade →</Link>
          </div>

          {/* Toobit */}
          <div className={buydeodstyles.card}>
            <h3>Toobit</h3>
            <ul>
              <li>Advanced tools</li>
              <li>Smooth UI</li>
              <li>Low fees</li>
            </ul>
            <Link href="https://www.toobit.com/en-US/spot/DEOD_USDT" target="_blank" className={buydeodstyles.secondary}>Trade →</Link>
          </div>

          {/* Pancake */}
          <div className={buydeodstyles.card}>
            <h3>PancakeSwap</h3>
            <ul>
              <li>No account</li>
              <li>Wallet trading</li>
              <li>Full control</li>
            </ul>
            <Link href="https://pancakeswap.finance/swap?outputCurrency=0x3510FbBC13090F991Ffa523527113A166161683e&inputCurrency=0x55d398326f99059fF775485246999027B3197955" target="_blank" className={buydeodstyles.secondary}>Buy →</Link>
          </div>

            <div className={buydeodstyles.card}>
            <h3>CoinDCX Web3</h3>
            <ul>
              <li>Self-custody trading</li>
              <li>Secure Web3 wallet</li>
              <li>Easy token access</li>
            </ul>
            <Link href="https://coindcx.com/" target="_blank" className={buydeodstyles.secondary}>Buy →</Link>
          </div>


            <div className={buydeodstyles.card}>
            <h3>WEEX</h3>
            <ul>
              <li>Global crypto exchange</li>
              <li>Fast execution</li>
              <li>Competitive trading fees</li>
            </ul>
            <Link href="https://www.weex.com/spot/DEOD-USDT" target="_blank" className={buydeodstyles.secondary}>Buy →</Link>
          </div>


        </div>
      </section>

      {/* SECTION 3 */}
      <section className={buydeodstyles.sectionAlt}>
        <h2>How to Buy DEOD</h2>

        {/* Video Section */}
        <div className={buydeodstyles.videoContainer}>
          <video controls width="100%" src="https://backend.decentrawood.com/uploads/deodai.mp4" autoPlay muted loop>
            Your browser does not support the video tag.
          </video>
        </div>

        <div className={buydeodstyles.steps}>

          <div className={buydeodstyles.stepCard}>
            <h3>Using Exchanges</h3>
            <ol>
              <li>Sign up</li>
              <li>Deposit USDT</li>
              <li>Search DEOD/USDT</li>
              <li>Trade</li>
            </ol>
            {/* <a href="#" className={buydeodstyles.primary}>Trade Now</a> */}
          </div>

          <div className={buydeodstyles.stepCard}>
            <h3>PancakeSwap</h3>
            <ol>
              <li>Connect wallet</li>
              <li>Have BNB</li>
              <li>Paste contract</li>
              <li>Swap</li>
            </ol>
            <Link href="https://pancakeswap.finance/swap?outputCurrency=0x3510FbBC13090F991Ffa523527113A166161683e&inputCurrency=0x55d398326f99059fF775485246999027B3197955" target="_blank" className={buydeodstyles.secondary}>Buy Now</Link>
          </div>

        </div>
      </section>

      {/* ARBITRAGE SECTION */}
      <section className={buydeodstyles.section}>
        <h2>Trade Smarter: DEOD Arbitrage Opportunity</h2>
        
        <div className={buydeodstyles.arbitrageCard}>
          <div className={buydeodstyles.arbInfo}>
            <h3>What is Arbitrage?</h3>
            <p>Arbitrage means taking advantage of price differences for the same asset across different exchanges.</p>
          </div>

          <div className={buydeodstyles.arbInfo}>
            <h3>Why DEOD?</h3>
            <p>DEOD is available on multiple platforms — MEXC, Bitmart, Toobit, and PancakeSwap. Due to varying liquidity, prices may differ across exchanges, creating trading opportunities.</p>
          </div>

          <div className={buydeodstyles.arbInfo}>
            <h3>How It Works</h3>
            <ol>
              <li>Buy DEOD at a lower price on one exchange</li>
              <li>Sell at a higher price on another</li>
              <li>Capture the price difference</li>
            </ol>
          </div>

          {/* <div className={buydeodstyles.arbAction}>
            <h3>Start Trading</h3>
            <p>Check prices across exchanges and act when opportunities appear.</p>
            <div className={buydeodstyles.exchangeLinks}>
              <span style={{ fontSize: "20px", marginRight: "8px" }}>👉</span> Trade DEOD on:{' '}
              <Link href="https://www.mexc.co/en-IN/exchange/DEOD_USDT?_from=header" target="_blank">MEXC</Link> |{' '}
              <Link href="https://www.bitmart.com/en-US/trade/DEOD_USDT?type=spot" target="_blank">Bitmart</Link> |{' '}
              <Link href="https://www.toobit.com/en-US/spot/DEOD_USDT" target="_blank">Toobit</Link> |{' '}
              <Link href="https://pancakeswap.finance/swap?outputCurrency=0x3510FbBC13090F991Ffa523527113A166161683e&inputCurrency=0x55d398326f99059fF775485246999027B3197955" target="_blank">PancakeSwap</Link>
            </div>
            <p className={buydeodstyles.note}>
              Note: Opportunities depend on market conditions. Always consider fees and execution timing.
            </p>
          </div> */}
        </div>
      </section>

      {/* SECTION 4 */}
      <section className={buydeodstyles.section}>
        <h2>Important Info</h2>

        <div className={buydeodstyles.infoGrid}>
          <div>✔ Use official links</div>
          <div>✔ Verify contract</div>
          <div>✔ Prices vary</div>
          <div>✔ Do your research</div>
        </div>
      </section>

      {/* SECTION 5 */}
      {/* <section className={buydeodstyles.banner}>
        <h2>DEOD Rewards Live 🎉</h2>
        <p>Earn rewards while trading DEOD</p>
        <a href="#" className={buydeodstyles.primary}>View Rewards</a>
      </section> */}

      {/* STICKY CTA */}
      {/* <div className={buydeodstyles.sticky}>
        <a href="#">Trade Now</a>
      </div> */}

    </div>
  );
}