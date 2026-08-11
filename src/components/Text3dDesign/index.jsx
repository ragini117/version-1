import React, { useState } from "react";
import styles from "./text3dDesign.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loader from "../../components/loaderDesign/index";
import CinemaImage1 from "../../../public/assets/1.png";
import CinemaImage2 from "../../../public/assets/4.png";
import CinemaImage3 from "../../../public/assets/9.png";
import Image from "next/image";
import ModelViewer from "../../components/ModelViewer/index";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib"; // Import GLTFLoader from three-stdlib

const Page = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewfile, setPreviewFile] = useState('')
  const modelUrl = "/assets/model (5).glb";
  const downloadGLB = (modelUrl) => {
    const link = document.createElement('a');
    link.href = modelUrl;
    link.download = 'model.glb'; // Set default download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const imageGenerator = async () => {
    setLoading(true);
    const payload = {
      prompt: description,
      negative: "No clutter",
    };
    const AIApi = "https://text3d.decentrawood.com";

    try {
      const res = await axios.post(AIApi, payload);
      if (res.status === 200) {
        downloadGLB(res.data.model_urls?.glb);
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        const message400 = error?.response?.data?.message;
        toast.error(message400, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error?.response?.status === 401) {
        const message401 = error?.response?.data?.message;
        toast.error(message401, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (error?.response?.status === 500) {
        const message500 = error?.response?.data?.message;
        toast.error(message500, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    setLoading(false);
  };

  const previewModel = async (event) => {
    try {
      const file = event.target.files[0]; // Get the first selected file
      if (file) {
        // Update state with the selected file and its URL
        setPreviewFile(file);
        setImageUrl(URL.createObjectURL(file));
      } else {
        // Clear state if no file is selected
        setPreviewFile(null);
        setImageUrl(null);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="main-profile-bg pt-5" style={{ minHeight: "100vh" }}>
        {loading && <Loader loading={loading} />}
        <div className="container">

          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-md-4">
                  <div className={styles.headerdes}>
                    <div className="mb-3">
                      <label className={`form-label ${styles.desText} text-center `}>
                        <h4>Text to 3D-Model Generator</h4>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter your prompt"
                        className={`form-control ${styles.textArea}`}
                        style={{
                          background: 'black',
                          color: '#ffffff',

                        }}
                        rows="6"
                        cols="50"
                      ></textarea>
                    </div>
                    <div className="text-center">
                      <button
                        className={`btn w-100 ${styles.generate_btn}`}
                        onClick={imageGenerator}
                      >
                        Generate
                      </button>
                    </div>
                    <div>
                      <div className="text-white my-4 mx-2">
                        <h4>Instructions :</h4>
                        <ol>
                          <li className="my-2"><strong>Enter Prompt :</strong> Type your descriptive text into the input field.</li>
                          <li className="my-2"><strong>Generate Model :</strong> Click the "Generate" button to create the 3D model based on your text input . The 3D Model will be downloaded on your device .(e.g. model.glb)</li>
                          <li className="my-2"><strong>Preview Model :</strong> Click the "Preview Model" button and select the downloaded .glb file .</li>
                        </ol>
                      </div>

                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-8">
                  <div className={styles.headerimg}>
                    {

                      <ModelViewer modelUrl={imageUrl} previewModel={previewModel} />

                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-12 my-5">
              <div className="row">
                <div
                  id="carouselExampleAutoplaying"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <Image
                        src={CinemaImage1}
                        className="d-block w-100"
                        alt="Cinema"
                      />
                    </div>
                    <div className="carousel-item">
                      <Image
                        src={CinemaImage2}
                        className="d-block w-100"
                        alt="Cinema"
                      />
                    </div>
                    <div className="carousel-item">
                      <Image
                        src={CinemaImage3}
                        className="d-block w-100"
                        alt="Cinema"
                      />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
