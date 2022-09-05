import logo from "./logo.svg";
import * as THREE from "three";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { useRef } from "react";
import "./App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });

const Orbit = () => {
  const { camera, gl } = useThree();
  return <orbitControls args={[camera, gl.domElement]} />;
};

const Box = (props) => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref} {...props}>
      <boxBufferGeometry />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
};

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ background: "black" }} camera={{ position: [3, 3, 3] }}>
        <Box position={[1, 1, 0]} />
        <axesHelper args={[5]} />
        <Orbit />
      </Canvas>
    </div>
  );
}

export default App;
