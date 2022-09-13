import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { useRef } from 'react';
import { useThree, extend } from '@react-three/fiber';
import { useState } from 'react';
import { useEffect } from 'react';
extend({ DragControls });

const Dragable = props => {
  const groupRef = useRef();
  const [children, setChildren] = useState([]);
  const {gl, camera} = useThree();  

  useEffect(() => {
    setChildren(groupRef.current.children);
  }, [])

  return (
    <group ref={groupRef}>
      <dragControls args={[children, camera, gl.domElement]} />
      {props.children}
    </group>
  )

}
export default Dragable;