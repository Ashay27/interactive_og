import React, {useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDrag} from '@use-gesture/react'




function Cylinder({ distance, diameter, depth}) {
    const [obj, setObject] = useState([distance,diameter,depth]);
    const [dist, setDistance] = useState([distance]);
    const [dia, setDiameter] = useState([diameter]);
    const [dep, setDepth] = useState([depth]);
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [position, setPosition] = useState([distance,0,0]);
    
    // const { size, viewport } = useThree();
    // const aspect = size.width / viewport.width;


    // Rotate the mesh 
    useFrame((state, delta) => (ref.current.rotation.x = 90))

    

    const bind = useDrag(({ offset: [x, y] }) => {
        const [,, z] = position;
        setPosition([(distance + x) , -y , z]); // / props.aspect
    }, { pointerEvents: true });

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh //{...props}
      position={position} {...bind()}
        ref={ref}
        //scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <cylinderGeometry args={hovered ? [diameter,diameter,depth,50] : [diameter/2,diameter/2,depth,50]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} wireframe ={hovered ? true : false}/>
      </mesh>
    )
  }

function UploadObjects ({object, distance }){
    return(
    // <Cylinder position= {[distance, 0, 0]} diameter = {object.diameter} depth = {object.depth} />
    <Cylinder distance= {distance} diameter = {Object.values(object.diameter)} depth = {Object.values(object.depth)}  />      
  )
}

export default UploadObjects