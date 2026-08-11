import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber';
import { DragControls, Environment, Grid, MapControls, OrbitControls, PointerLockControls, Sky, useGLTF } from '@react-three/drei';
import styles from "../Text3dDesign/text3dDesign.module.css";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const index = ({ modelUrl , previewModel }) => {
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };
  return (
    <div style={{ position: 'relative', height: '80vh' }}>
    <Canvas style={{ height: '80vh' }}
    shadows
    >
      
      <ambientLight intensity={4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      {modelUrl ?
       <Model url={modelUrl} />
        :
        null
      }

<Sky sunPosition={[100, 20, 100]} />
      <Grid
          args={[10, 10]} // Size of the grid [size, divisions]
          position={[0, -1, 0]} // Position of the grid
          infiniteGrid={true} // Optional: Set to true for an infinite grid
          cellColor="black"  // Color of the grid cells
          sectionColor="grey"  // Color of the section lines
          fadeDistance={100}  // Distance for the grid to fade
          fadeStrength={10}  // Strength of the fade effect
          lineWidth={1}  // Width of the grid lines
           />
      <OrbitControls />
      {/* <MapControls/> */}
      {/* <DragControls/> */}
      {/* <PointerLockControls/> */}
    </Canvas>
    {!modelUrl && 
    <>
    <input type="file" name="" id="" accept=".glb" style={{ display: 'none' }} onChange={previewModel} ref={fileInputRef}/>
    <button
    className={`${styles.generate_btn}`}
          style={{
            position: 'absolute',
            top: '35vh',
            left: '45vh',
            padding: '10px 20px',
            fontSize: '16px',
            zIndex: 1, // Ensures the button is above the canvas
          }}
          onClick={handleButtonClick}
        >
           Preview Model
        </button>
    </>}
    </div>
  );
};

export default index;


