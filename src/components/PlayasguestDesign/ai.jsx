"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PlayasguestDesign.module.css";
import { useRouter } from "next/navigation";
import { LAND_REDIRECT_SUCCESS } from "@/redux/states/loginState";

const ai = () => {
    const { loginReducer } = useSelector((res) => res);
    const dispatch = useDispatch();

    const router = useRouter()
    const dummyData = [
        {
            title: "Ai: Image Generator",
            location: "/marketdashboard/ai-image",
            img: "Ai image generator",
        },
        {
            title: "Ai: 3D Model Generator",
            location: '/marketdashboard/text-3d',
            img: "text to 3d model",
        },
    ];

    const handleRedirect = async (location) => {
        console.log('location : ', location)
        if (loginReducer?.isLogin) {
            router.push(location)
        } else {
            const redirectLink = location;
            dispatch({ type: LAND_REDIRECT_SUCCESS, payload: redirectLink });
            router.push("/login");
        }
    }
    return (
        <section className={` ${styles.new_land_container}`}>
            <div className="container py-3">
                <div className="row mt-5  justify-content-center align-items-center">
                    {dummyData?.map((value) => {
                        return (
                            <>
                                <div className="col-12 col-md-4">
                                    <div className={` ${styles.land_card}`}>
                                <p>{value?.title}</p>
                                  
                                        <div className={` ${styles.cart_land_img}`}>
                                            <img
                                                src={`/assets/playasguest/${value?.img}.png`}
                                                style={{ height: '260px' }}
                                                className="img-fluid"
                                                alt=""
                                            />
                                        </div>
                                        <div className="row my-2 justify-content-center align-items-center">
                                            <div className="col-6 ">
                                                <button
                                                    className={`btn ${styles.join_btn}`}
                                                    onClick={() => handleRedirect(value.location)}
                                                >
                                                    {" "}
                                                    <i className="bi bi-magic me-2" />
                                                    Generate

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default ai