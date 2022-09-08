# Three.js 란?
웹에서 3d를 구현할 수 있는 자바스크립트 라이브러리입니다.

> Three.js 를 사용한 페이지
https://github.com/home 깃허브
https://eyes.nasa.gov/apps/mars2020/#/home 나사
https://www.midwam.com/en midwam

_웹에서 3d를 구현했으면 모두 Three.js를 사용한 것_

https://threejs.org/ 에서 더많은 three.js를 사용한 페이지들을 볼 수 있습니다.

# Settings
1. 리액트 프로젝트 생성 create-react-app
`npx create-react-app 3d-app`

2. 라이브러리 설치
`npm install three` Three.js
`npm install @react-three/fiber` React에서 Three.js를 편리하게 사용하기 위한 Lib
`npm install use-cannon` 물리엔진 Lib

# Scene 만들기

## 1. 기본 Three.js로 scene 만들기
```js
import * as THREE from "three";
```
### 3요소 생성
three.js에서 3d 오브젝트를 표시하려면 3가지 요소가 필요합니다.
- scene
- camera
- renderer
```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
```
camera의 생성자에 들어가는 4가지 속성은 다음과 같습니다.
- FOV(시야각) : 해당 시점의 화면이 보여지는 정도. 각도로 값을 설정합니다.
- aspect ratio(종횡비) : 대부분 요소의 높이와 너비에 맞추어 표시하고 그렇지 않으면 와이드 스크린에 옛날 영화를 트는 것처럼 이미지가 틀어집니다.
- near : 이 값보다 가까이 있는 오브젝트는 렌더링 되지 않음
- far : 이 값보다 멀리 있는 오브젝트는 렌더링 되지 않음

### renderer 추가
```js
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.innerHTML = "";
document.body.appendChild(renderer.domElement);
```

다음으로 렌더링 할 곳의 크기를 설정해주고 HTML 문서에 추가해줘야 합니다. 일단 높이와 너비를 각각 윈도우의 크기로 설정하였습니다.`document.body.innerHTML = ""`는 `renderer`만 화면에 표시하기 위해서입니다. `renderer`는 `<canvas>` 엘리먼트로 HTML 문서에 추가됩니다.

### Cube 생성
```js
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: "blue"
});

camera.position.z = 5;
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```
Three.js 에서 3d 오브젝트는 `mesh`라 부릅니다. `mesh`는 2가지 요소로 구성됩니다.
- geometry : 기하학적 형태, 뼈대를 담당하는 부분
- material : 질감, 색, 반사율 등 물체의 표면

2가지 속성으로 `cube`라는 `mesh`를 만들고 scene에 추가했습니다. 그리고 기본 설정상 `scene.add()`로 물체를 추가하면 `(0,0,0)`의 위치를 갖습니다. 이렇게 되면 `camera`와 `cube`가 동일한 위치에 겹쳐서 제대로 보이지 않을 것입니다. 이를 방지하기 위해서 `camera`의 위치를 약간 변경하였습니다.

### scene rendering
아직 화면에는 아무것도 나오지 않을 것입니다. 아무것도 렌더링하지 않았기 때문입니다. 화면에 `cube`를 렌더링하고 회전시키기 위한 코드를 추가합니다.
```js
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
```
1초에 60번 렌더링(60fps) 할 것이고 그럴 때마다 x 방향으로 0.01, y 방향으로 0.01만큼 회전할 것입니다.

### 창 크기 변경 이슈
이미 멋지게 `cube`가 렌더링되고 회전하고 있겠지만 창 크기를 변경했을 때 비율이 뭉게지는게 보입니다. 왜냐하면 `renderer`와 `camera`의 설정이 처음 창을 켰을 때의 윈도우 사이즈로 고정되어 있기 때문입니다. `addEventListener`를 통해 창이 `resize`될 때마다 `renderer`와 `camera`의 설정을 바꿔줍시다.
```js
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
```

### 전체코드
```js
import * as THREE from "three";
import "./App.css";

function App() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.innerHTML = "";
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: "blue"
  });

  camera.position.z = 5;
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return null;
}

export default App;

```

## 2. react-three/fiber로 shene 만들기
사실 `@react-three/fiber`를 활용하면 훨씬 쉽게 간단한 `scene`을 만들 수 있습니다.

### Import
```js
import { Canvas, useFrame } from "@react-three/fiber";
```

### Canvas 생성
```js
return (
<div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ background: "black" }}>
        <Box />
      </Canvas>
</div>
);
```
`Canvas`를 만들면 scene, camera, renderer를 따로 만들필요가 없습니다. `Canvas`의 스타일은 다른 HTML 태그들 처럼 style속성으로 지정할 수 있습니다. 
`Canvas`안에 렌더링될 `Box`는 따로 컴포넌트로 빼서 만들었습니다.

### Box 생성
```js
const Box = () => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref}>
      <boxBufferGeometry />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
};
```
`Canvas`안에는 `mesh`를 직접 사용할 수 있습니다. `mesh`는 안에 geometry, material 속성을 가져야 합니다. `boxBufferGeometry`, `meshBasicMaterial`는 각각 presetting된 기본 상자 geometry, 기본 material 입니다.
`mesh`에 `useRef`를 연결합니다. 매 프레임마다 동작하는 `useFrame` 훅에서 `ref`를 조작해 `mesh`를 회전시킵니다.

### 전체 코드
```js
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const Box = () => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref}>
      <boxBufferGeometry />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
};

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ background: "black" }}>
        <Box />
      </Canvas>
    </div>
  );
}

export default App;
```
기본 three.js만 사용해서 scene을 만들 때보다 코드가 훨씬 짧고 간단해진 것을 볼 수 있습니다. 이후 내용들은 전부 `@react-three/fiber`를 활용한 코드입니다.

# Axes Helper, Orbit Controller

## Axes Helper
![](https://velog.velcdn.com/images/cksrb63/post/fde91853-6bae-448b-b6fe-91ff3adda1c9/image.png)
Axex Helper는 three.js에서 x, y, z축을 나타내 주는 도구입니다. `canvas`안에 `axesHelper`를 추가해주면 됩니다.
```js
<Canvas style={{ background: "black" }} camera={{ position: [3, 3, 3] }}>
        <Box />
        <axesHelper args={[5]} />
</Canvas>
```
`camera={{ position: [3, 3, 3] }}` 기존 카메라 위치가 [0,0,5]여서 x, y축 밖에 안보이기 때문에 카메라의 위치를 바꿔주었습니다
`axesHelper`의 `args`는 사이즈를 나타냅니다.

## Orbit Controls
Orbit Controls는 카메라(화면)의 각도를 돌리거나 확대하거나 이동할 수 있는 컨트롤러 입니다.
- 회전 : 좌클릭 후 드래그
- 확대/축소 : 스크롤
- 이동 : 우크릭 후 드래그

### import, extend
```js
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });
```
Orbit Controls를 jsx 형태로 사용하려면 three.js에서 import 한 뒤 react-three/fiber로 extend해서 사용해야 합니다.

### Orbit jsx 생성
```js
const Orbit = () => {
  const { camera, gl } = useThree();
  return <orbitControls args={[camera, gl.domElement]} />;
};
```
orbitControls 생성자는 camera객체와 이벤트 리스너에 사용되는 HTML 엘리먼트가 필요합니다. 우리는 react-three/fiber에서 제공하는 `useThree()`를 객체 구조 분해해서 사용하면 됩니다.

### Canvas에 넣기
```js
<Canvas style={{ background: "black" }} camera={{ position: [3, 3, 3] }}>
  <Box />
  <axesHelper args={[5]} />
  <Orbit />
</Canvas>
```

# Light, Shadow
지금은 빛이 없는 상태지만 큐뷰가 잘 보입니다. 그 이유는 `meshBasicMaterial`은 빛의 영향을 받지 않는 material이기 때문에 그 자체의 색을 내고 있던 것입니다. 빛의 영향을 받는 material을 적용시켜 보겠습니다.
```js
<mesh ref={ref} {...props}>
  <boxBufferGeometry />
  <meshPhysicalMaterial color="blue" />
</mesh>
```
`meshBasicMaterial`대신 `meshPhysicalMaterial`을 사용하니 더이상 큐브가 보이지 않습니다. 이제 빛을 추가해봅시다.

## Light

### ambientLight
`ambientLight`는 모든 `mesh`가 모든 각도에서 동일한 양을 받게하는 빛입니다. 당연히 그림자도 생기지 않습니다. 
```js
<ambientLight intensity={0.2} />
```
`canvas`안에 추가해 줍시다. intensity로 빛의 세기를 정할 수 있습니다.
![](https://velog.velcdn.com/images/cksrb63/post/b0523d60-44e6-4b7a-b211-70b91d82ce0a/image.png)


### pointLight
`pointLight`는 한 점에서 나오는 빛입니다. 거리에 따라 빛의 양이 줄어들고 각도에 따라 빛을 받지 못할 수 있는 흔히 우리가 아는 빛입니다. 다만 빛 자체는 관측되지 않고 빛을 받는 `mesh`들에게 영향을 줄 뿐입니다.

```js
<pointLight />
```
`canvas`안에 추가해 줍시다.
![](https://velog.velcdn.com/images/cksrb63/post/50e65465-8825-40c0-95cb-e61c09616c39/image.png)
default 위치 [0,0,0]을 바라보는 큐브의 면만 밝아진 것이 보입니다.

### 빛을 내는 구체
지금까지는 빛 자체는 관측할 수 없었습니다. 하지만 실제 세상에서는 태양과 같이 빛을 분출하는 오브젝트가 있습니다. 우리는 `meshPhongMaterial`안에 `pointLight`를 넣음으로써 태양 비슷한 mesh를 만들 수 있습니다. 
`meshPhongMaterial`은 빛을 반사시켜 표면이 빛나는 material입니다.
```js
const Sun = (props) => {
  return (
    <mesh {...props}>
      <pointLight castShadow />
      <sphereBufferGeometry args={[0.3]} />
      <meshPhongMaterial emissive="yellow" />
    </mesh>
  );
};
```
그동안은 계속 `boxBufferGeometry`를 사용했는데 구를 만들기 위해서 `sphereBufferGeometry`를 사용했습니다. `args`는 반지름의 길이 입니다.
`meshPhongMaterial`에서 `emissive`로 빛이 반사되는 색을 정할 수 있습니다.
```js
<Sun position={[0, 3, 0]} />
```
![](https://velog.velcdn.com/images/cksrb63/post/1ffbc298-2260-4471-afbc-4aecbb5b7055/image.png)



## Shadow
분명 방향와 거리가 유효한 빛을 만들었는데 그림자가 생기지 않습니다. 그림자를 만들려면 추가적인 설정이 필요합니다.

### Canvas 속성 추가
Canvas에 `shadows`속성을 추가하면 그림자를 그릴 수 있는 Canvas가 됩니다.
```js
<Canvas
	shadows
    style={{ background: "black" }}
    camera={{ position: [3, 3, 3] }}
>
```

### 그림자를 그리는 자, 그려지는 자
![](https://velog.velcdn.com/images/cksrb63/post/298fdc10-f5cf-4c3f-9e62-0f261ebe2a10/image.png)
그림자를 만드는 오브젝트, 받아서 그리는 오브젝트를 설정해줘야 합니다. 예를 들어 아까 만든 `Sun`은 그림자를 그리는 오브젝트이고 바닥인 `Floor`는 그림자가 그려지는 오브젝트 입니다.
각각 `castShadow` 와 `receiveShadow`를 추가해줍니다. 
```js
const Sun = (props) => {
  return (
    <mesh {...props}>
      <pointLight castShadow />
		...
```
```js
const Floor = (props) => {
  return (
    <mesh {...props} receiveShadow>
      ...
```
`Box`는 어떨까요? `Box`는 그림자를 `Floor`에 그리기도 하지만 `Sun`이 만드는 그림자를 자신에게 그리기도 합니다. `castShadow` 와 `receiveShadow` 둘다 추가해줍니다. 
```js
const Box = (props) => {
  ...
  return (
    <mesh ref={ref} {...props} castShadow receiveShadow>
      ...
```
![](https://velog.velcdn.com/images/cksrb63/post/53ee8495-eb32-4a8b-8d12-dd4055250138/image.png)

# Material
## meshMaterial 기본 속성
meshMaterial에서 몇가지 자주 사용하는 속성들을 훑어보려고 합니다.

### opacity, transparent
`opacity`는 불투명도입니다. 1이면 완전한 불투명이고 0이면 완전한 투명입니다. 하지만 `opacity`만으로는 mesh가 실제로 투명해지지 않습니다. `transparent` 속성이 `true`일 때만 `opacity`속성이 작동합니다. material 속성을 잘 확인하기 위해서 큐브의 위치를 변경하였습니다.
```js
<meshPhysicalMaterial
    color="blue"
    opacity={0.3}
    transparent
/>
```
![](https://velog.velcdn.com/images/cksrb63/post/535a4c45-2ce8-4ff0-8411-f13cefcdfec8/image.png)

### wireframe
mesh의 프레임만 나오게 하는 속성입니다. 프레임의 색은 `color`속성으로 적용됩니다.
```js
<meshPhysicalMaterial
    color="blue"
    opacity={0.3}
    transparent
    wireframe
/>
```
![](https://velog.velcdn.com/images/cksrb63/post/2a1f452e-f2e3-4c69-99cc-7acf647b78fa/image.png)

### metalness, roughness
`metalness`는 금속 재질을 만들어 주고 1이면 완전한 금속입니다. `roughness`는 표면의 거칠기를 뜻하고 0이면 빛을 그대로 반사합니다. `metalness`의 default 는 0, `roughness`는 1입니다.
```js
<meshPhysicalMaterial
    color="blue"
    metalness={1}
	roughness={0}
/>
```
![](https://velog.velcdn.com/images/cksrb63/post/9d3c077c-d578-4224-9ea2-6cc0cd5339de/image.png)
`roughness`가 0이기 때문에 표면에서 한점으로 빛을 그대로 반사하는 것이 보입니다.

더 많은 속성들은 https://threejs.org/docs/index.html?q=mater#api/en/materials/Material 에서 추가로 확인하실 수 있습니다.

## Texture
텍스쳐를 적용시키는 법도 간단합니다. 먼저 텍스쳐 사진을 준비해서 작업폴더에 넣어줍니다.
![](https://velog.velcdn.com/images/cksrb63/post/e7ceb310-3e2a-470d-99fd-3166b4e26d68/image.png)
```js
const Box = (props) => {
  ...
  const texture = useLoader(THREE.TextureLoader, "/assets/wood.jpg");
  ...
  return (
    <mesh ref={ref} {...props} castShadow>
      <boxBufferGeometry />
      <meshPhysicalMaterial map={texture} />
    </mesh>
  );
};
```
`@react-three/fiber`의 훅 `useLoader`로 이미지를 활용해 텍스쳐를 만듭니다. meshMaterial의 `map` 속성으로 텍스쳐를 적용시킵니다. 

하지만 이 상태면 texture가 로딩되기 전에 화면이 렌더링되기 때문에 오류가 발생합니다. `<Suspense>`안에 `Box`를 넣어 texture 로딩이 완료되면 보여주기로 합시다. `Suspense`는 리액트에서 제공하는 기능입니다.
```js
<Canvas
  shadows
  style={{ background: "black" }}
  camera={{ position: [3, 3, 3] }}>
  <Suspense fallback={null}>
    <Box position={[0, 1, 0]} />
  </Suspense>
  ...
```
![](https://velog.velcdn.com/images/cksrb63/post/b6784c79-0624-46bd-90ca-5430cd265688/image.png)

### Texture - background
이번에는 배경에 텍스쳐를 넣어보겠습니다. 다만 3d 배경을 사용하려면 360도 이미지(파나로마)가 필요합니다.
> https://cdn.pixabay.com/photo/2018/07/11/16/34/landscape-3531355_960_720.jpg 사용한 이미지

```js
const BackGround = (props) => {
  const texture = useLoader(THREE.TextureLoader, "/assets/back.jpg");

  const { gl } = useThree();

  const formatted = new THREE.WebGLCubeRenderTarget(
    texture.image.height
  ).fromEquirectangularTexture(gl, texture);

  return <primitive attach="background" object={formatted.texture} />;
};
```
텍스쳐를 만드는건 기존과 같습니다. 우리는 이미지를 화면에 표시하기 전, 후에 처리를 하는 `WebGlRenderTarget`을 사용할 것입니다. `WebGLCubeRenderTarget`는 큐브 카메라로 촬영한 360도 이미지 용 `WebGlRenderTarget`입니다. 그 중에서 `fromEquirectangularTexture` 메소드는 파나로마 이미지를 360도 큐브맵(3d 배경)으로 컨버팅해줍니다.

```js
<Suspense fallback={null}>
    <BackGround />
</Suspense>
```
`BackGround`도 텍스쳐 로딩이 필요하기 때문에 `Suspense` 사이에 껴서 `Canvas`에 넣어줍니다.

![](https://j.gifs.com/A6gOKp.gif)
