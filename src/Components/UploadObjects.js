import React, {useState, useRef, useContext } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDrag} from '@use-gesture/react'
import ObjectData from '../uitlegschemaAfstand.json';


function Cylinder({ distance, diameter, depth, object, objects, order, distances, setObjectConflicts, objectConflicts, setObjectConflictsLog}) {
    var objectColor;

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [position, setPosition] = useState([distance,-(parseFloat(depth) + parseFloat(diameter)/2 ),0]);

    console.log("depth: " + depth)
    console.log("depth: " + (parseFloat(depth) + parseFloat(diameter)/2))
    
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;


    // Rotate the mesh 
    useFrame((state, delta) => (ref.current.rotation.x = 90))

    console.log(object.objectId)

    const bind = useDrag(({ offset: [x] }) => {   
        const [,y, z] = position;
        setPosition([(distance + (x/aspect)) , y , z]); // / props.aspect
        console.log('position-> x: ' + (distance + (x/aspect)) + ' y: ' + y + ' z: ' + z);
    }, { pointerEvents: true });

    const handleClick = event => {
      click(!clicked);
      setObjectConflicts([])

      if(!clicked){
      var conflictLog = "\n These are the conflicts for the selected object " + Object.values(object.assetId);
      var conflictExist = false;

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
              //NOTE: currently to identify conflicts, distance measured from center to center of the objects is used.
              var distanceBetweenObjects = distances[index] - distances[i-x];
              //var distanceBetweenObjects = currentObjectX - distances[i-x];
              var uitlegschemaDistance, neighbourObjectAssetId;
              
              //get the minimum distance for corresponding object types from Uitlegschema 
              ObjectData.afstand.map((o) => { 
                if(o.Asset == Object.values(object.assetId) ){
                  neighbourObjectAssetId = Object.values(objects[order[i-x].objectId - 1].assetId)
                  var neighbourObjectAssetName = neighbourObjectAssetId.toString().split("_",2)[0];
                  console.log("neighbourObjectAssetName: " +  neighbourObjectAssetName)

                  var neighbourObjectAssetCat = neighbourObjectAssetId.toString().split("_",2)[1];
                  console.log("neighbourObjectAssetCat: " +  neighbourObjectAssetCat)
                  if(o.Asset.includes("Boom")|| o.Asset.includes("Gebouwen")){
                    if(neighbourObjectAssetCat === "t"){
                      uitlegschemaDistance = o[neighbourObjectAssetName.toString()]
                      uitlegschemaDistance = (uitlegschemaDistance.toString().split("&",2)[0])
                      console.log(uitlegschemaDistance)
                      if(uitlegschemaDistance.includes("|") && parseFloat(diameter)<=0.2){
                        uitlegschemaDistance = (uitlegschemaDistance.toString().split("|",2)[0])
                        console.log ("using G_t <= 200mm")
                      }else if((uitlegschemaDistance.includes("|") && parseFloat(diameter)>0.2)){
                        uitlegschemaDistance = (uitlegschemaDistance.toString().split("|",2)[1])
                        console.log ("using G_t > 200mm")
                      }
                      uitlegschemaDistance = parseFloat(uitlegschemaDistance)
                    }else if(neighbourObjectAssetCat === "d"){
                      uitlegschemaDistance = o[neighbourObjectAssetName.toString()]
                      uitlegschemaDistance = parseFloat(uitlegschemaDistance.toString().split("&",2)[1])
                    }else{
                      uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()])
                    }
                }else{
                  uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()])
                }                
                  console.log("uitlegschemaDistance: " + uitlegschemaDistance )
                }})
        
              console.log("Distance between selected object " + (index+1)  + " and object " + (i-x+1) + " is: " + distanceBetweenObjects);
              // compare the distances and log if conflict occurs
              if(parseFloat(distanceBetweenObjects) < parseFloat(uitlegschemaDistance)){
                console.log("Selected Object " + (index+1)  + " has a conflict with Object " + (i-x+1) )
                conflictLog = conflictLog.concat("\n Selected Object " + (index+1) + " (" + Object.values(object.assetId) + ") has a conflict with Object " + (i-x+1) + " (" + neighbourObjectAssetId + ")");
                conflictExist = true;
                setObjectConflicts(prevConflict => {
                  return [...prevConflict, order[i-x].objectId]
                })
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
                  neighbourObjectAssetId = neighbourObjectAssetId.toString().split("_",1)[0];
                  console.log("neighbourObjectAssetId: " +  neighbourObjectAssetId)
                  
                  uitlegschemaDistance = o[neighbourObjectAssetId.toString()]
                  console.log("uitlegschemaDistance: " + uitlegschemaDistance )
                }})

              console.log("Distance between selected object " + (index+1)  + " and object " + (i+x+1) + " is: " + distanceBetweenObjects);
              // compare the distances and log if conflict occurs
              if(parseFloat(distanceBetweenObjects) < parseFloat(uitlegschemaDistance)){
                console.log("Selected Object " + (index+1)  + " has a conflict with Object " + (i+x+1) )
                conflictLog = conflictLog.concat("\n Selected Object " + (index+1) + " (" + Object.values(object.assetId) + ") has a conflict with Object " + (i+x+1) + " (" + neighbourObjectAssetId + ")");
                conflictExist = true;
                setObjectConflicts(prevConflict => {
                  return [...prevConflict, order[i+x].objectId]
                })
              }
            }           
          }
        }      
      }  

      if(!conflictExist){
        conflictLog = conflictLog.concat("\n No conflicts detected for the selected object");
      }

      //for logging the conflicts in UI in App.js
      setObjectConflictsLog(conflictLog);
      }
    }

    console.log( objectConflicts)
    // Add condition to choose the choosen color of the object or the conflict color or color when selected and update in meshStandardMaterial with a variable

    if(!clicked){
      if(objectConflicts.includes(object.objectId)){
        objectColor = "#fc2808";
      } else {
          objectColor = Object.values(object.color)[0];
      } 
    } else if(clicked){
        objectColor = "#faf202";
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
        <cylinderGeometry args={[diameter/2,diameter/2,1,50]} />
        {/* <cylinderGeometry args={hovered ? [diameter,diameter,1,50] : [diameter/2,diameter/2,1,50]} /> */}
        <meshStandardMaterial color= {objectColor} wireframe ={hovered ? true : false}/>
      </mesh>
    )
  }

function UploadObjects ({object, distance, objects, order, distances, setObjectConflicts, objectConflicts, setObjectConflictsLog }){
    return(
    // <Cylinder position= {[distance, 0, 0]} diameter = {object.diameter} depth = {object.depth} />
    //TODO: reduce the number of input parameters
    <Cylinder distance= {distance} diameter = {Object.values(object.diameter)} depth = {Object.values(object.depth)} object = {object} objects = {objects} order ={order} distances={distances} setObjectConflicts = {setObjectConflicts} objectConflicts = {objectConflicts} setObjectConflictsLog= {setObjectConflictsLog}/>      
  )
}

export default UploadObjects