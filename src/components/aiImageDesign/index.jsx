import React, { useState } from "react";
import styles from "./aiImageDesign.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loader from "../../components/loaderDesign/index";
import CinemaImage1 from "../../../public/assets/1.png";
import CinemaImage2 from "../../../public/assets/4.png";
import CinemaImage3 from "../../../public/assets/9.png";
import DefaultAi from "../../../public/assets/defaultAi.jpeg";
import Image from "next/image";
const page = () => {
  const [image_url, setImage_url] = useState("");
  const [des, setDes] = useState("");
  const [loading, setLoading] = useState(false);
  const imageGenerator = async () => {
    setLoading(true);
    const payload = {
      text: des,
    };
    // const AIApi = "http://52.201.249.23:8000/image";
    const AIApi = "https://imagetest.decentrawood.com/image";

    try {
      const res = await axios.post(AIApi, payload);
      if (res.status === 200) {
        setImage_url(res?.data?.image_url);
        // console.log("res(((((", res);
      }
    } catch (error) {
      if (error.response.status === 400) {
        const message_400 = error?.response?.data?.message;
        toast.error(message_400, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error.response.status === 401) {
        const message_401 = error?.response?.data?.message;
        toast.error(message_401, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error.response.status === 500) {
        const message_500 = error?.response?.data?.message;
        toast.error(message_500, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    // setDes("");
    setLoading(false);
  };
  const downloadGLB = (modelUrl) => {
    const link = document.createElement('a');
    link.href = modelUrl;
    link.download ='imgfile.png'; // Set default download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownload = async (modelUrl) => {
    const url = modelUrl; // Replace with your image URL
    try {
      const response = await fetch(url, {
        mode: 'no-cors', // You may need to remove this if CORS is enabled on the server
      });
      
      const blob = await response.blob();
      const link = document.createElement('a');
      const objectUrl = window.URL.createObjectURL(blob);
      link.href = objectUrl;
      link.setAttribute('download', 'image.jpg'); // Set the downloaded file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl); // Free up memory
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };
  return (
    <>
      <div className="main-profile-bg pt-5" style={{ minHeight: "100vh" }}>
        {loading && <Loader loading={loading} />}
        <div className="container">
          <div className={styles.ai_title}>
            <h3>AI Image Generator</h3>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row ">
                <div className="col-12 col-md-4">
                  <div className={styles.headerdes}>
                    <div className="mb-3 text-left">
                      <label className={`form-label ${styles.desText}`}>
                        Tokenize Your Ideas: Start Crafting NFTs
                      </label>
                      <textarea
                        value={des}
                        onChange={(e) => setDes(e.target.value)}
                        className="form-control"
                        rows="6"
                        cols="50"
                      ></textarea>
                    </div>

                    <div className="text-center">
                      <button
                        className={`btn w-75 ${styles.generate_btn}`}
                        onClick={() => {
                          imageGenerator();
                        }}
                      >
                        Generate
                      </button>
                      <button
                        className={`btn w-75 my-2 ${styles.generate_btn}`}
                        style={{backgroundColor:'black !important'}}
                        onClick={() => {
                          handleDownload(image_url);
                        }}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-8">
                  <div className={styles.headerimg}>
                    {!image_url == "" ? (
                      <>
                        <img
                          src={image_url}
                          // className="d-block w-100"
                          alt="AI-image"
                        />
                      </>
                    ) : (
                      <Image
                        src={DefaultAi}
                        className="d-block w-100"
                        alt="image"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
       
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default page;
