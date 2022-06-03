import React, {useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDrag} from '@use-gesture/react'




function Cylinder({ distance, diameter, depth, object, objects}) {
    // const [obj, setObject] = useState([distance,diameter,depth]);
    // const [dist, setDistance] = useState([distance]);
    // const [dia, setDiameter] = useState([diameter]);
    // const [dep, setDepth] = useState([depth]);

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [position, setPosition] = useState([distance,0,0]);
    
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;


    // Rotate the mesh 
    useFrame((state, delta) => (ref.current.rotation.x = 90))

    console.log(object.objectId)

    const bind = useDrag(({ offset: [x, y] }) => {   
        const [,, z] = position;
        setPosition([(distance + (x/aspect)) , -y/aspect , z]); // / props.aspect
        console.log('position-> x: ' + (distance + (x/aspect)) + ' y: ' + (-y/aspect) + ' z: ' + z);
    }, { pointerEvents: true });

    const handleClick = event => {
      //import objects
      //add function to show conflicts
      // for the clicked object get position
              // ref.current.position.x
              //object.objectId
      // select neighbour object and compare distances for conflicts
        //use order to find neighbour objects   =>  order[i].objectId === object.objectId
      //start from to right and then check on left
      // or check left and right alternatively?
    }

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh //{...props}
      position={position}
      {...bind()}
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

function UploadObjects ({object, distance, objects, order, distances }){
    return(
    // <Cylinder position= {[distance, 0, 0]} diameter = {object.diameter} depth = {object.depth} />
    <Cylinder distance= {distance} diameter = {Object.values(object.diameter)} depth = {Object.values(object.depth)} object = {object} objects = {objects} />      
  )
}

export default UploadObjects