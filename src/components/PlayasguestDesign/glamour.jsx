"use client";
import styles from "./PlayasguestDesign.module.css";
const glamour = () => {
  const dummyData = [
    {
      title: "Burj Khalifa",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0011_VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0011MultiplayerV2/index.html",
      img: "Burj khalifa",
    },
    {
      title: "Cupid Hub",
      vr: "https://spiritualzone.s3.ap-south-1.amazonaws.com/0014_New/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/Cupid_Hub_Web_New_Final+V2/index.html",
      android: "https://induszone.s3.ap-south-1.amazonaws.com/Cupid_Hub_V2.apk",
      img: "cupid hub",
    },
    {
      title: "Marriage Hall",
      vr: "https://induszone.s3.ap-south-1.amazonaws.com/MarriageHall_V3/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/MarriageHall_V3/index.html",
      img: "Marriage hall",
    },
    {
      title: "Celebrity Palace",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0008_VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0008_Multiplayer_V2/index.html",
      img: "Celebrity palace",
    },

    {
      title: "Dwood Shop",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0600VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0600MultiplayerV2/index.html",
      img: "Dwood shop",
    },
    {
      title: "Gold Souk",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0019VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0019MultiplayerV2/index.html",
      img: "Gold souk",
    },
    {
      title: "Restaurant",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0092VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0092MultiplayerV2/index.html",
      img: "Restaurant",
    },

    {
      title: "Villa",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0069VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0069MultiplayerBuildV2/index.html",
      img: "Villa",
    },
    {
      title: "Muse of Erotica",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0018VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0018MultiplayerV2/index.html",
      img: "Nude stadium",
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
                          <button
                            className={`btn ${styles.join_btn}`}
                            onClick={() => window.open(value?.join, "_blank")}
                          >
                            {" "}
                            Join
                          </button>
                        </div>
                        <div className="col-4">
                          <button
                            className={`btn ${styles.android_btn}`}
                            onClick={async () => {
                              if (value?.android) {
                                window.open(value?.android, "_blank");
                              } else {
                                alert("Comming soon");
                              }
                            }}
                          >
                            <img
                              src="/assets/pngwing.com.png"
                              className="img-fluid"
                              alt="not"
                            />
                          </button>
                        </div>

                        <div className="col-4 text-end">
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
                          src={`/assets/Glamour images/${value?.img}.png`}
                          style={{ height: "260px" }}
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

export default glamour;
