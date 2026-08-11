import React from "react";
import styles from "./profileDesign.module.css";

const Newsletter = () => {
  return (
    <>
      <div className={` ${styles.des_img}`}>
        <img src="/assets/sms.png" alt="" />

        <h4>News Letter</h4>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
          sunt a, e
        </p>

        <button className={`btn ${styles.subcribe_btn}`}> Subscribe</button>
      </div>
    </>
  );
};

export default Newsletter;
