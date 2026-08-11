'use client';
import { useRouter } from "next/navigation";
import styles from "./PlayasguestDesign.module.css";
const page = () => {
  const router = useRouter()
  const dummyData = [
       {
      title: "Culture",
      vr: "https://induszone.s3.ap-south-1.amazonaws.com/4003_VR/index.html",
      join: "https://induszone.s3.ap-south-1.amazonaws.com/4003_Multiplayer_New/index.html",
      img: "culture2",
    },

    {
      title: "Glamour",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0011_VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0011MultiplayerV2/index.html",
      img: "Glamour image",
    },
    {
      title: "Gaming",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0008_VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0008_Multiplayer_V2/index.html",
      img: "Game image",
    },
    {
      title: "Ai",
      vr: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0008_VR_V2/index.html",
      join: "https://maps-decentrawood.s3.ap-south-1.amazonaws.com/0008_Multiplayer_V2/index.html",
      img: "Ai image",
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
                  <div className="col-12 col-md-3"  onClick={()=>
                router.push(`/playasguest/${value.title}`)
              }>
                    <div className={` ${styles.land_card}`}>
                      {/* <div className="row my-2">
                        <div className="col-6 ">
                          <button
                            className={`btn ${styles.join_btn}`}
                            onClick={() => window.open(value?.join, "_blank")}
                          >
                            {" "}
                            Join
                          </button>
                        </div>
                        <div className="col-6 text-end">
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
                      </div> */}
                      <div className={` ${styles.cart_land_img}`}>
                        <img
                          src={`/assets/playasguest/${value?.img}.png`}
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
export default page;
