import React, {useState, useRef, useContext } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDrag} from '@use-gesture/react'
import ObjectData from '../uitlegschemaAfstand.json';
import AppContext from './AppContext';


function Cylinder({ distance, diameter, depth, object, objects, order, distances, setObjectConflicts}) {
    const appContext = useContext(AppContext);
    

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
      var conflictLog = "\n These are the conflicts for the selected object " + Object.values(object.assetId);

      // for the clicked object get position and object id
      var currentObjectX = ref.current.position.x;
      var currentObjectId = object.objectId;

      for (let index = 0; index < order.length; index++) {
        console.log("currentObjectId :" + currentObjectId)
        if (currentObjectId === order[index].objectId){
          var i = index;

          //comparing the objects to the left and right (if exists) in each iteration
          for (let x = 1; x <= order.length ; x++) {
            // select neighbour object to the left and compare distances for conflicts
            if(i-x >= 0){
              //TODO: get current position when you have drag and drop
              var distanceBetweenObjects = distances[index] - distances[i-x];
              //var distanceBetweenObjects = currentObjectX - distances[i-x];
              var uitlegschemaDistance, neighbourObjectAssetId;
              
              //get the minimum distance for corresponding object types from Uitlegschema 
              ObjectData.afstand.map((o) => { 
                if(o.Asset == Object.values(object.assetId) ){
                  neighbourObjectAssetId = Object.values(objects[order[i-x].objectId - 1].assetId)
                  console.log("neighbourObjectAssetId: " +  neighbourObjectAssetId)

                  uitlegschemaDistance = o[neighbourObjectAssetId.toString()]
                  console.log("uitlegschemaDistance: " + uitlegschemaDistance )
                }})
        
              console.log("Distance between selected object " + (index+1)  + " and object " + (i-x+1) + " is: " + distanceBetweenObjects);
              // compare the distances and log if conflict occurs
              if(parseFloat(distanceBetweenObjects) < parseFloat(uitlegschemaDistance)){
                console.log("Selected Object " + (index+1)  + " has a conflict with Object " + (i-x+1) )
               conflictLog = conflictLog.concat("\n Selected Object " + (index+1) + " (" + Object.values(object.assetId) + ") has a conflict with Object " + (i-x+1) + " (" + neighbourObjectAssetId + ")");
              
              }
              
            }

             // select neighbour object to the right and compare distances for conflicts
            if(i+x < order.length){
              //TODO: get current position when you have drag and drop
              var distanceBetweenObjects = distances[i+x] - distances[index];
              //var distanceBetweenObjects = distances[i+x] - currentObjectX;
              var uitlegschemaDistance, neighbourObjectAssetId;

              //get the minimum distance for corresponding object types from Uitlegschema 
              ObjectData.afstand.map((o) => { 
                if(o.Asset == Object.values(object.assetId) ){
                  neighbourObjectAssetId = Object.values(objects[order[i+x].objectId - 1].assetId)
                  console.log("neighbourObjectAssetId: " +  neighbourObjectAssetId)
                  
                  uitlegschemaDistance = o[neighbourObjectAssetId.toString()]
                  console.log("uitlegschemaDistance: " + uitlegschemaDistance )
                }})

              console.log("Distance between selected object " + (index+1)  + " and object " + (i+x+1) + " is: " + distanceBetweenObjects);
              // compare the distances and log if conflict occurs
              if(parseFloat(distanceBetweenObjects) < parseFloat(uitlegschemaDistance)){
                console.log("Selected Object " + (index+1)  + " has a conflict with Object " + (i+x+1) )
                conflictLog = conflictLog.concat("\n Selected Object " + (index+1) + " (" + Object.values(object.assetId) + ") has a conflict with Object " + (i+x+1) + " (" + neighbourObjectAssetId + ")");
              }
            }
            
          }
         
          

        }
        
      }

      //for logging the conflicts in UI in App.js
      setObjectConflicts(conflictLog);
      
    }

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh //{...props}
      position={position}
      {...bind()}
        ref={ref}
        //scale={clicked ? 1.5 : 1} 
        //onClick={(event) => click(!clicked)}
        //show object Name on single click and conflicts on Double click
        onClick={handleClick}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <cylinderGeometry args={hovered ? [diameter,diameter,depth,50] : [diameter/2,diameter/2,depth,50]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} wireframe ={hovered ? true : false}/>
      </mesh>
    )
  }

function UploadObjects ({object, distance, objects, order, distances, setObjectConflicts }){
    return(
    // <Cylinder position= {[distance, 0, 0]} diameter = {object.diameter} depth = {object.depth} />
    //TODO: reduce the number of input parameters
    <Cylinder distance= {distance} diameter = {Object.values(object.diameter)} depth = {Object.values(object.depth)} object = {object} objects = {objects} order ={order} distances={distances} setObjectConflicts = {setObjectConflicts}/>      
  )
}

export default UploadObjects