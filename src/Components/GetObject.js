import React, {useState, useRef, useContext, useMemo } from "react";
import { useFrame, useThree } from '@react-three/fiber'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDrag} from '@use-gesture/react'
import ObjectData from '../uitlegschemaAfstand.json';
import AppContext from './AppContext';
import { useSpring , a} from '@react-spring/three'

const LOCAL_STORAGE_KEY = 'localData.objects'
const LOCAL_ORDER_KEY = 'localData.order'

function Cylinder({objectId}) {
  var objectColor;
  var cylinderDepth = 20;
  const appContext = useContext(AppContext);
  var distance = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).distance)[0]
  var depth = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).depth)[0]
  var diameter = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).diameter)[0]
  objectColor = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).color)[0];
  console.log("distance: " + distance)
  console.log("depth: " + depth)
  console.log("diameter: " + diameter)
  console.log("color: " + objectColor)

  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  
  const [position, setPosition] = useSpring(() => ({ position: [appContext.storedLineIntersect[1] + parseFloat(distance), (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ), -cylinderDepth/2] }))

  console.log("depth: " + (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ))
  console.log("depth: " + (parseFloat(depth) + parseFloat(diameter)/2))
  
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;


  // Rotate the mesh 
  useFrame((state, delta) => (ref.current.rotation.x = Math.PI/2))

  console.log(objectId)

  // const bind = useGesture(
  //   {
  //     onDrag: ({ offset: [x] }) => {
  //       const [,y, z] = position;
  //       setPosition([(appContext.storedLineIntersect[1] + parseFloat(distance) + (x/aspect)) , y , z]); // / props.aspect
  //       console.log('position-> x: ' + (appContext.storedLineIntersect[1] + parseFloat(distance) + (x/aspect)) + ' y: ' + y + ' z: ' + z);
  //     },  

  //     onDragEnd: ({ offset: [x] }) => {
  //         //when drag end
  //         var newValue = parseFloat(distance) + parseFloat(x/aspect);
  //         var updatedObject = appContext.storedObjectsUpload.slice();
  //         //updatedObject.entries(updatedObject.find(object => object.objectId == objectId));
  //         //Object.assign(updatedObject.find(object => object.objectId == objectId).distance, {newValue})
  //         var foundIndex = updatedObject.findIndex(object => object.objectId == objectId)
  //         updatedObject[foundIndex].distance.distance = newValue; //check different ways -> distance[0]  or distance.distance[0]
  //         console.log("Object distance: " + Object.values(updatedObject.find(object => object.objectId == objectId).distance)[0])
  //         appContext.setStoredObjectsUpload(updatedObject);
  //         console.log(appContext.storedObjectsUpload)
  //         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appContext.storedObjectsUpload))
          
  //         var order = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY))
  //         var updatedOrder = appContext.storedObjectsUpload.slice();
  //         //order = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY))
  //         updatedOrder.sort((a, b) => {
  //           return a.distance.distance - b.distance.distance;
  //         });
          
  //         order = updatedOrder.flatMap(o => o.objectId)
  //         console.log("Order: " + order)
  //         appContext.setStoredObjectsOrder(order);
  //         localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(order))
  //     }
  //   },
  //   { drag:
  //     {
  //       filterTaps: true
  //     } 
  //   }
  // )

  const bind = useDrag(({ movement: [x], active }) => {   
      setPosition({position: [(appContext.storedLineIntersect[1] + parseFloat(distance) + (x/aspect)) ,(appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ), -cylinderDepth/2 ]}); // / props.aspect
      console.log('position-> x: ' + (appContext.storedLineIntersect[1] + parseFloat(distance) + (x/aspect)) + ' y: ' + (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2))  + ' z: ' + -cylinderDepth/2);
      
      //when drag end
      if(!active) {
        console.log("Drag ended")
        var newValue = parseFloat(distance) + parseFloat(x/aspect);
        //On drag end, the whole asset should be within the two vertical lines else it comes back to the original position.
        if(newValue< (parseFloat(diameter)/2) || newValue>= (appContext.storedLineIntersect[2] - appContext.storedLineIntersect[1] - (parseFloat(diameter)/2))){
          console.log("Boundary exceeded")
          setPosition({position: [(appContext.storedLineIntersect[1] + parseFloat(distance) ) ,(appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ), -cylinderDepth/2 ]});
          return;
        }
        var updatedObject = appContext.storedObjectsUpload.slice();
        
        var foundIndex = updatedObject.findIndex(object => object.objectId == objectId)
        updatedObject[foundIndex].distance.distance = newValue; 
        console.log("Object distance: " + Object.values(updatedObject.find(object => object.objectId == objectId).distance)[0])
        console.log("Updated object distance: " + updatedObject[foundIndex].distance.distance)
        appContext.setStoredObjectsUpload(updatedObject);
        console.log(appContext.storedObjectsUpload)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appContext.storedObjectsUpload))
        
        var order = appContext.storedObjectsOrder.slice();
        console.log("Order: " + order)
        var updatedOrder = appContext.storedObjectsUpload.slice();
        updatedOrder = updatedOrder.filter(o => order.includes(o.objectId))
        
        updatedOrder.sort((a, b) => {
          return a.distance.distance - b.distance.distance;
        });
        
        order = updatedOrder.flatMap(o => o.objectId)
        console.log("Order: " + order)
        appContext.setStoredObjectsOrder(order);
        localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(order))
      }
  }, 
  { axis: 'x',
    delay:true
  }
  );

  

  useMemo(() => setPosition({position: [(appContext.storedLineIntersect[1] + parseFloat(distance)) , (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ) , -cylinderDepth/2]}), [appContext.storedLineIntersect, parseFloat(distance)] );

  const handleClick = event => {
    click(!clicked);
    appContext.setObjectConflicts([])

    if(!clicked){
    var conflictLog = "\n These are the conflicts for the selected object " + Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).assetId)[0];
    var conflictExist = false;
    var order = appContext.storedObjectsOrder.slice();
    console.log("Order: " + order)

    // for the clicked object get object id
    var currentObjectId = objectId;

    for (let index = 0; index < order.length; index++) {
      console.log("currentObjectId :" + currentObjectId)
      if (currentObjectId === order[index]){
        var i = index;

        //comparing the objects to the left and right (if exists) in each iteration
        for (let x = 1; x <= order.length ; x++) {
          var findCurrentObject = appContext.storedObjectsUpload.find(object => object.objectId == order[index]);
          var currentObjectDistance = Object.values(findCurrentObject.distance)[0];
          // select neighbour object to the left and compare distances for conflicts
          if(i-x >= 0){
            var findNeighbourObject = appContext.storedObjectsUpload.find(object => object.objectId == order[i-x])
            
            //NOTE: currently to identify conflicts, distance measured from center to center of the objects is used.
            
            var neighbourObjectDistance = Object.values(findNeighbourObject.distance)[0];
            var distanceBetweenObjects = currentObjectDistance - neighbourObjectDistance //distances[index] - distances[i-x];
            console.log("currentObjectDistance: " + currentObjectDistance + " neighbourObjectDistance: " + neighbourObjectDistance + " distanceBetweenObjects: " + distanceBetweenObjects)
            
            var uitlegschemaDistance, neighbourObjectAssetId;
            
            //get the minimum distance for corresponding object types from Uitlegschema 
            ObjectData.afstand.map((o) => { 
              if(o.Asset == Object.values(findCurrentObject.assetId)[0] ){
                neighbourObjectAssetId = Object.values(findNeighbourObject.assetId)[0]
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
              conflictLog = conflictLog.concat("\n Selected Object " + (index+1) + " (" + Object.values(findCurrentObject.assetId)[0] + ") has a conflict with Object " + (i-x+1) + " (" + neighbourObjectAssetId + ")");
              conflictExist = true;
              appContext.setObjectConflicts(prevConflict => {
                return [...prevConflict, order[i-x]]
              })
            }
            
          }

           // select neighbour object to the right and compare distances for conflicts
          if(i+x < order.length){
            var findNeighbourObject = appContext.storedObjectsUpload.find(object => object.objectId == order[i+x])
            
            var neighbourObjectDistance = Object.values(findNeighbourObject.distance)[0];
            var distanceBetweenObjects = neighbourObjectDistance - currentObjectDistance;
            
            var uitlegschemaDistance, neighbourObjectAssetId;

            //get the minimum distance for corresponding object types from Uitlegschema 
            ObjectData.afstand.map((o) => { 
              if(o.Asset == Object.values(findCurrentObject.assetId)[0] ){
                neighbourObjectAssetId = Object.values(findNeighbourObject.assetId)[0]
                neighbourObjectAssetId = neighbourObjectAssetId.toString().split("_",1)[0];
                console.log("neighbourObjectAssetId: " +  neighbourObjectAssetId)
                
                uitlegschemaDistance = o[neighbourObjectAssetId.toString()]
                console.log("uitlegschemaDistance: " + uitlegschemaDistance )
              }})

            console.log("Distance between selected object " + (index+1)  + " and object " + (i+x+1) + " is: " + distanceBetweenObjects);
            // compare the distances and log if conflict occurs
            if(parseFloat(distanceBetweenObjects) < parseFloat(uitlegschemaDistance)){
              console.log("Selected Object " + (index+1)  + " has a conflict with Object " + (i+x+1) )
              conflictLog = conflictLog.concat("\n Selected Object " + (index+1) + " (" + Object.values(findCurrentObject.assetId)[0] + ") has a conflict with Object " + (i+x+1) + " (" + neighbourObjectAssetId + ")");
              conflictExist = true;
              appContext.setObjectConflicts(prevConflict => {
                return [...prevConflict, order[i+x]]
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
    appContext.setObjectConflictsLog(conflictLog);
    }
  }
  

  console.log( appContext.objectConflicts)
  //Add condition to choose the choosen color of the object or the conflict color or color when selected and update in meshStandardMaterial with a variable

  if(!clicked){
    if(appContext.objectConflicts.includes(objectId)){
      objectColor = "#fc2808";
    } else {
        objectColor = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).color)[0];
    } 
  } else if(clicked){
      objectColor = "#faf202";
    }

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
    <a.mesh 
    {...bind()}
    {...position}
      ref={ref}
      //scale={clicked ? 1.5 : 1} 
      //onClick={(event) => click(!clicked)}
      //show object Name on single click and conflicts on Double click
      onClick={handleClick}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <cylinderGeometry args={[diameter/2,diameter/2,cylinderDepth,50]} />
      <meshStandardMaterial color= {objectColor} wireframe ={hovered ? true : false}/>
    </a.mesh>
    </>
  )
}

function GetObject ({objectId}){
  return(
  <Cylinder objectId = {objectId}/>      
)
}

export default GetObject;