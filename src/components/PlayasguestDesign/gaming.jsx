"use client";
import axios from "axios";
import styles from "./PlayasguestDesign.module.css";
const gaming = () => {
  const dummyData = [
    {
            title: "Mystical Maze",
            // vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0006VR_V2/index.html",
            join: "https://induszone.s3.ap-south-1.amazonaws.com/Mystical-Maze_WebGL-V4/index.html",
            img: "Mystical maze",
            android: 'https://induszone.s3.ap-south-1.amazonaws.com/Mystical-Maze-V4.apk'
        },
    {
      title: "Match Mania",
      // vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0006VR_V2/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Match-Mania-WebGL-V2/index.html",
      img: "Match mania",
      android:'https://induszone.s3.ap-south-1.amazonaws.com/Match_Mania_V1.apk'
    },
    {
      title: "D-Nexus",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/DeathGame/index.html",
      android: 'https://induszone.s3.ap-south-1.amazonaws.com/Nexus.apk',
      win:'https://induszone.s3.ap-south-1.amazonaws.com/Nexus_Windows_V1.zip',
      img: "D-Nexus",
    },
    {
      title: "Lord Of Space",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/LordOfTheSpace_Web_V3/index.html",
      img: "Lord of space-1",
      win: 'https://induszone.s3.ap-south-1.amazonaws.com/LordOfTheSpace_Windows_V2.zip',
      android: 'https://induszone.s3.ap-south-1.amazonaws.com/LordOfTheSpace_V2.apk'

    },
    {
      title: "Bhairava The Saviour",
      //   vr: "",
      win: 'https://induszone.s3.ap-south-1.amazonaws.com/BhairavaTheSaviour_Windows.zip',
      join: "https://induszone.s3.ap-south-1.amazonaws.com/BhairavaTheSaviour_Web/index.html",
      img: "Bhairava the saviour",
    },
    {
      title: "Roulette Game ",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Roullete-Game-Web-V2/index.html",
      img: "Roulette",
      android: "https://induszone.s3.ap-south-1.amazonaws.com/CasinoV4.apk",
    },
    {
      title: "Teen Patti",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/TeenPatti_V3/index.html",
      img: "Teen patti",
      android: "https://induszone.s3.ap-south-1.amazonaws.com/TeenPatti_V3.apk",

    },
    {
      title: "Word Chain",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/WordChain/index.html",
      img: "word chain",
    },
    {
      title: "Racing Horizon",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/RacingHorizon_Web/index.html",
      win: "https://induszone.s3.ap-south-1.amazonaws.com/RacingHorizon_Windows.zip",
      img: "racing horizon",
    },
    {
      title: "Olympics",
      // vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0006VR_V2/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Olympic/index.html",
      img: "Olympic",
    },
    {
      title: "X-O Clash",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/XO_Clash/index.html",
      img: "X-O Clash",
      android:'https://induszone.s3.ap-south-1.amazonaws.com/X-O+Clash.apk'
    },

    {
      title: "Cricket Stadium",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0006VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0006MultiplayerV2/index.html",
      img: "Cricket stadium",
    },
    {
      title: "Ludo Titans",
      // vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0006VR_V2/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Ludo_Web_V2/index.html",
      img: "Ludo Titans",
      android: 'https://induszone.s3.ap-south-1.amazonaws.com/LudoTitans_V2.apk'
    },
    {
      title: "Flap Quest",
      //   vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/FlapQuest/index.html",
      img: "Flap Quest",
    },


    {
      title: "Dragon Tiger ",
      //   vr: "",
      //   join: "",
      img: "Dragon Vs Tiger",
    },
    {
      title: "Poker Game",
      //   vr: "",
      //   join: "",
      img: "poker",
    },

    {
      title: "Number Prediction",
      //   vr: "",
      //   join: "",
      img: "game1",
    },
  ];
  const downloadStat = async () => {
    const payload= {
       "gameType": "MatchMania",
       "download": true
   }
     const resp = await axios.post(`/analytics/download`,payload)
     console.log(resp)
   }
  return (
    <>
      <section className={` ${styles.new_land_container}`}>
        <div className="container py-3">
          <div className="row mt-5">
            {dummyData?.map((value) => {
              return (
                <>
                  <div className="col-12 col-md-4">
                    <div className={` ${styles.land_card}`}>
                      <div className="row my-2 justify-content-between">
                        {value?.join ? (
                          <div className="col-4 ">
                            <button
                              className={`btn ${styles.join_btn}`}
                              onClick={() => window.open(value?.join, "_blank")}
                            >
                              {" "}
                              Play Now
                            </button>
                          </div>
                        ) : (
                          <div className="col-4 ">
                            <button className={`btn ${styles.join_btn}`}>
                              {" "}
                              Coming soon
                            </button>
                          </div>
                        )}
                        {value?.win ? (
                          <div className="col-4 text-end">
                            <button
                              className={`btn ${styles.android_btn}`}
                              onClick={() =>
                                window.open(value?.win, "_blank")
                              }
                            >
                              <img
                                src="/assets/windows.png"
                                className="img-fluid"
                                alt="not"
                              />
                            </button>
                          </div>
                        ) : (
                          null
                        )}
                        {value?.android ? (
                          <div className="col-4 text-end">
                            <button
                              className={`btn ${styles.android_btn}`}
                              onClick={ async () =>{
                                debugger
                                if (value?.title=="Match Mania") {
                                 await  downloadStat()
                                  window.open(value?.android, "_blank")
                                } else{
                                  window.open(value?.android, "_blank")
                                }
                              }
                              }
                            >
                              <img
                                src="/assets/pngwing.com.png"
                                className="img-fluid"
                                alt="not"
                              />
                            </button>
                          </div>
                        ) : (
                          <div className="col-4 text-end">
                            <button className={`btn ${styles.android_btn}`}>
                              {" "}
                              Soon
                            </button>
                          </div>
                        )}
                      </div>
                      <div className={` ${styles.cart_land_img}`}>
                        <img
                          src={`/assets/Game images/${value?.img}.png`}
                          className="img-fluid"
                          style={{ height: '260px' }}
                          alt=""
                        />
                      </div>
                      <p>{value?.title}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default gaming;
