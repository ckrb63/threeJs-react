import logo from "./logo.svg";
import * as THREE from "three";
import {
  Canvas,
  useFrame,
  extend,
  useThree,
  useLoader
} from "@react-three/fiber";
import { Suspense, useRef } from "react";
import "./App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });

const Orbit = () => {
  const { camera, gl } = useThree();
  return <orbitControls args={[camera, gl.domElement]} />;
};

const BackGround = (props) => {
  const texture = useLoader(THREE.TextureLoader, "/assets/back.jpg");

  const { gl } = useThree();

  const formatted = new THREE.WebGLCubeRenderTarget(
    texture.image.height
  ).fromEquirectangularTexture(gl, texture);

  return <primitive attach="background" object={formatted.texture} />;
};

const Box = (props) => {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, "/assets/wood.jpg");
  useFrame((state) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  const handlePointerDown = (e) => {
    console.log(e);
    e.object.active = true;
  };

  const handlePointerEnter = (e) => {
    e.object.scale.x = 1.5;
    e.object.scale.y = 1.5;
    e.object.scale.z = 1.5;
  };

  const handlePointerLeave = (e) => {
    if (!e.object.active) {
      e.object.scale.x = 1;
      e.object.scale.y = 1;
      e.object.scale.z = 1;
    }
    console.log(e.object);
  };

  return (
    <mesh
      ref={ref}
      {...props}
      castShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}>
      <boxBufferGeometry />
      <meshPhysicalMaterial map={texture} />
    </mesh>
  );
};

const Floor = (props) => {
  return (
    <mesh {...props} receiveShadow>
      <boxBufferGeometry args={[20, 1, 10]} />
      <meshPhysicalMaterial />
    </mesh>
  );
};

const Sun = (props) => {
  return (
    <mesh {...props}>
      <pointLight castShadow />
      <sphereBufferGeometry args={[0.3]} />
      <meshPhongMaterial emissive="yellow" />
    </mesh>
  );
};

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        style={{ background: "black" }}
        camera={{ position: [3, 3, 3] }}>
        <Suspense fallback={null}>
          <Box position={[0, 1, 0]} />
        </Suspense>
        <Suspense fallback={null}>
          <BackGround />
        </Suspense>
        <Sun position={[0, 3, 0]} />
        <ambientLight intensity={0.2} />
        <axesHelper args={[5]} />
        <Orbit />
        <Floor position={[0, -0.5, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
