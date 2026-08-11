"use client";
import styles from "./PlayasguestDesign.module.css";
const culture = () => {
  const dummyData = [
    {
      title: "Maha Kumbh",
      // vr: "https://induszone.s3.ap-south-1.amazonaws.com/DecentrawoodChaRaja_VR/index.html",
      // join: "https://induszone.s3.ap-south-1.amazonaws.com/Dahi_Handi_New/index.html",
      img: "MahaKumbh",
      apk: "https://spiritualzone.s3.ap-south-1.amazonaws.com/MahaKhumbh.apk",
    },
    {
      title: "Decentrawood Cha Raja",
      vr: "https://induszone.s3.ap-south-1.amazonaws.com/DecentrawoodChaRaja_VR/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Decentrawood-Cha-Raja-MP/New/index.html",
      img: "decentrawoodcharaja",
      apk: "https://induszone.s3.ap-south-1.amazonaws.com/Decentrawood-Cha-Raja-MP/New/Decentrawood-Cha-Raja.apk",
    },

    {
      title: "Ram temple",
      vr: "https://unitywebvrbucket.s3.ap-south-1.amazonaws.com/RamMandirVR/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/4003_Multiplayer_New_N/index.html",
      img: "Ram temple",
      apk: "https://induszone.s3.ap-south-1.amazonaws.com/Ram_Mandir_V6.apk",
    },

    {
      title: "Khatushyam Baba",
      vr: "https://induszone.s3.ap-south-1.amazonaws.com/4014_VR/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/4014_Multiplayer_V3/index.html",
      img: "Khatushyam baba",
      apk:'https://induszone.s3.ap-south-1.amazonaws.com/Khatu_Shyam_V1.apk'
    },
    {
      title: "Jagannath Temple",
      vr: "",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/4063_Multiplayer/index.html",
      img: "Puri temple",
    },
    {
      title: "Tirupati Temple",
      vr: "",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4197_Multiplayer/index.html",
      img: "Tirupati temple",
    },
    {
      title: "Prem Mandir",
      vr: "https://induszone.s3.ap-south-1.amazonaws.com/4040_VR/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Prem_Mandir_Web_V2_New/index.html",
      img: "Prem temple",
      apk:'https://induszone.s3.ap-south-1.amazonaws.com/Prem_Mandir_Android_V2_New.apk'
    },
    {
      title: "Mahakaleshwar",
      vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4009_VR/index.html",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4009_Multiplayer_T/index.html",
      img: "Mahakaleshwar",
    },
    {
      title: "Saibaba temple",
      vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4018_VR/index.html",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4018_Multiplayer/index.html",
      img: "Sai baba temple",
    },
    {
      title: "Church",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0671VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0671MultiplayerV2/index.html",
      img: "church",
    },

    {
      title: "Masjid",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0020VR_V3/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0020MultiplayerV4/index.html",
      img: "MAsjid",
    },

    {
      title: "Golden temple",
      vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4025_VR/index.html",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4025_Multiplayer/index.html",
      img: "Golden temple",
    },

    {
      title: "kamtanath",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/4001_VR/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/4001_Multiplayer/index.html",
      img: "Kamtanath",
    },
    {
      title: "Palitana Jain temple",
      vr: "https://induszone.s3.ap-south-1.amazonaws.com/Palitana_MP/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Palitana_Temple/index.html",
      img: "Patiltana jain temple",
    },
    {
      title: "Ballaleshwar",
      vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4625_VR/index.html",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4625_Multiplayer/index.html",
      img: "Ballaleshwar",
    },
    {
      title: "Varadvinayak",
      vr: "",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4624_Multiplayer/index.html",
      img: "Varandvinayak",
    },
    {
      title: "Vighnahar ",
      vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4623_VR/index.html",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4623_Multiplayer/index.html",
      img: "Vighnahar",
    },
    {
      title: "Mahaganapati",
      vr: "",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4622_Multiplayer/index.html",
      img: "Mahaganpati",
    },
    {
      title: "Moreshwar",
      vr: "",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4606_Multiplayer/index.html",
      img: "Moreshwar",
    },

    {
      title: "Siddhivinayak",
      vr: "",
      join: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4607_Multiplayer/index.html",
      img: "Siddhivinayak",
    },
    {
      title: "Dahi Handi",
      // vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4003_VR/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Dahi_Handi_New/index.html",
      img: "Dahi Handi",
      // apk: "https://induszone.s3.ap-south-1.amazonaws.com/Ram_Mandir_V6.apk",
    },
    {
      title: "Red Fort",
      // vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/4003_VR/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/Red_Fort/index.html",
      img: "Red Fort",
      // apk: "https://induszone.s3.ap-south-1.amazonaws.com/Ram_Mandir_V6.apk",
    },
   
  ];

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
                      <div className="row my-2">
                        <div className="col-4 ">
                         {
                          value?.join ? 
                          <button
                          className={`btn ${styles.join_btn}`}
                          onClick={() => window.open(value?.join, "_blank")}
                        >
                          {" "}
                          Join
                        </button> :  <button
                            className={`btn ${styles.join_btn}`}
                            // onClick={() => window.open(value?.join, "_blank")}
                          >
                            {" "}
                            Soon
                          </button>
                         }
                        </div>
                        <div className="col-4 ">
                          <button
                            className={`btn ${styles.android_btn}`}
                            onClick={() =>
                              value?.apk
                                ? window.open(value?.apk)
                                : alert("Apk link is not available")
                            }
                          >
                            <img
                              src="/assets/pngwing.com.png"
                              className="img-fluid"
                              style={{width:'100%'}}
                              alt="not"
                            />
                          </button>
                        </div>
                        <div className="col-4">
                          <button
                            className={`btn ${styles.vr_btn}`}
                            onClick={() => window.open(value?.vr, "_blank")}
                          >
                            <img
                              src="/assets/vrbtn.png"
                              className="img-fluid"
                              alt="not"
                            />
                          </button>
                        </div>
                      </div>
                      <div className={` ${styles.cart_land_img}`}>
                        <img
                          src={`/assets/culture images/${value?.img}.png`}
                          style={{height:'260px'}}
                          className="img-fluid"
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

export default culture;
