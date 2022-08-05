import React, {useState, useRef, useContext, useMemo, useEffect } from "react";
import { useFrame, useThree } from '@react-three/fiber'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDrag} from '@use-gesture/react'
import ObjectData from '../uitlegschemaAfstand.json';
import AppContext from './AppContext';
import { useSpring , a} from '@react-spring/three'
import { Html} from "@react-three/drei/web"
import "../App.css"
import {Button, Form, Modal} from 'react-bootstrap';

const LOCAL_STORAGE_KEY = 'localData.objects'
const LOCAL_ORDER_KEY = 'localData.order'
const [FRONT,TOP, ROTATE, PERSPECTIVE] = ['FRONT', 'TOP', 'ROTATE', 'PERSPECTIVE']
const HART = ["CAI/T", "Data", "E (LS)", "E (MS)_t", "E (MS)_d", "E (HS)", "Boom 1", "Boom 2", "Boom 3"]
const RAND = ["DWA_t", "DWA_d", "DWA+RWA (gemengd)_t", "DWA+RWA (gemengd)_d", "HWA/ RWA", "PL", "Warmte_HT", "Warmte_MT", "Warmte LT", "W_t", "W_d", "G_t", "G_d", "O.A.T.", "Gebouwen", "DWA_t_Exception", "DWA_d_Exception", "HWA/ RWA_Exception" ]
const VERTICAL = ["Boom 1", "Boom 2", "Boom 3", "Gebouwen"]
var height, crown, trunkDia;

function Cylinder({objectId}) {
  var objectColor;
  var cylinderDepth = 20;
  const appContext = useContext(AppContext);
  var distance = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).distance)[0]
  var depth = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).depth)[0]
  var diameter = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).diameter)[0]
  var assetId = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).assetId)[0]
  objectColor = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).color)[0];
  console.log("distance: " + distance)
  console.log("depth: " + depth)
  console.log("diameter: " + diameter)
  console.log("color: " + objectColor)

  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const isMounted = useRef(false)

  var rotation = 0; 
  // Rotate the mesh 
  if(!(VERTICAL.includes(assetId))){
    rotation = Math.PI/2;
  }else cylinderDepth = diameter;

  switch (assetId) {
    case "Boom 1":
      height = 16;
      crown = diameter/2;
      trunkDia = 0.6;
      break;
    
    case "Boom 2":
      height = 13;
      crown = diameter/2;
      trunkDia = 0.3;
      break;
    
    case "Boom 3":
      height = 8;
      crown = diameter/2;
      trunkDia = 0.1;
      break;

    default:
      height = 0;
      crown = 0;
      trunkDia = 0;
      break;
  }

  useFrame((state, delta) => ref.current.rotation.x = rotation)
  
  const [position, setPosition] = useSpring(() => ({ position: [appContext.storedLineIntersect[1] + parseFloat(distance), (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ), -cylinderDepth/2] }))

  console.log('position-> x: ' + (appContext.storedLineIntersect[1] + parseFloat(distance) ) + ' y: ' + (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2))  + ' z: ' + -cylinderDepth/2)
  console.log("depth: " + (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ))
  console.log("depth: " + (parseFloat(depth) + parseFloat(diameter)/2))
  
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

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

  const bind = useDrag(({ movement: [x], active, cancel, enabled }) => {   
    if(appContext.viewState.view == ROTATE){ 
      enabled = false;
      cancel()
      return
    }
    
      setPosition.start({position: [(appContext.storedLineIntersect[1] + parseFloat(distance) + (x/aspect)) ,(appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ), -cylinderDepth/2 ]}); // / props.aspect
      console.log('position-> x: ' + (appContext.storedLineIntersect[1] + parseFloat(distance) + (x/aspect)) + ' y: ' + (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2))  + ' z: ' + -cylinderDepth/2);
      
      //when drag end
      if(!active) {
        console.log("Drag ended")
        var newValue = parseFloat(distance) + parseFloat(x/aspect);
        //On drag end, the whole asset should be within the two vertical lines else it comes back to the original position.
        if(newValue< (parseFloat(diameter)/2) || newValue>= (appContext.storedLineIntersect[2] - appContext.storedLineIntersect[1] - (parseFloat(diameter)/2))){
          console.log("Boundary exceeded")
          setPosition.start({position: [(appContext.storedLineIntersect[1] + parseFloat(distance) ) ,(appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ), -cylinderDepth/2 ]});
          window.alert("Boundary exceeded. Keep the assets within the vertical lines.")
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
  

  useMemo(() => setPosition.start({position: [(appContext.storedLineIntersect[1] + parseFloat(distance)) , (appContext.storedLineIntersect[0] - parseFloat(depth) - (parseFloat(diameter)/2) ) , -cylinderDepth/2]}), [appContext.storedLineIntersect, parseFloat(distance), parseFloat(depth), parseFloat(diameter) ]);

  const handleClick = event => {
    click(!clicked);
    console.log("Asset clicked: " + assetId)
  }

  useEffect(() => {
    appContext.setObjectConflicts([])
    var conflictLog = "\n These are the conflicts for the selected object " + assetId;
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
          
          // select neighbour object to the left and compare distances for conflicts
          if(i-x >= 0){
            var currentObjectDistance = parseFloat(Object.values(findCurrentObject.distance)[0]);
            if(RAND.includes(Object.values(findCurrentObject.assetId)[0])){
              console.log("Get CURRENT OBJECT distance to edge")
              currentObjectDistance -= parseFloat((Object.values(findCurrentObject.diameter)[0])/2);
            }else console.log("Get CURRENT OBJECT distance to center")

            var findNeighbourObject = appContext.storedObjectsUpload.find(object => object.objectId == order[i-x])
            
            //NOTE: currently to identify conflicts, distance measured from center to center of the objects is used.
            
            var neighbourObjectDistance = parseFloat(Object.values(findNeighbourObject.distance)[0]);
            if(RAND.includes(Object.values(findNeighbourObject.assetId)[0])){
              console.log("Get NEIGHBOUR OBJECT distance to edge")
              neighbourObjectDistance += parseFloat((Object.values(findNeighbourObject.diameter)[0])/2)
            }else console.log("Get NEIGHBOUR OBJECT distance to center")

            var distanceBetweenObjects = currentObjectDistance - neighbourObjectDistance //distances[index] - distances[i-x];
            console.log("currentObjectDistance: " + currentObjectDistance + " neighbourObjectDistance: " + neighbourObjectDistance + " distanceBetweenObjects: " + distanceBetweenObjects)
            
            var uitlegschemaDistance, neighbourObjectAssetId;
            
            //TODO: Fix this for E (LS)
            //get the minimum distance for corresponding object types from Uitlegschema 
            ObjectData.afstand.map((o) => { 
              if(o.Asset == Object.values(findCurrentObject.assetId)[0] ){
                neighbourObjectAssetId = Object.values(findNeighbourObject.assetId)[0]
                var neighbourObjectAssetName = neighbourObjectAssetId.toString().split("_",2)[0];
                console.log("neighbourObjectAssetName: " +  neighbourObjectAssetName)
                console.log("o.Asset: " + o.Asset)

                var neighbourObjectAssetCat = neighbourObjectAssetId.toString().split("_",2)[1];
                console.log("neighbourObjectAssetCat: " +  neighbourObjectAssetCat)
                
                if(o.Asset.includes("Boom")|| o.Asset.includes("Gebouwen")){ //current asset
                  if(neighbourObjectAssetCat === "t"){
                    uitlegschemaDistance = o[neighbourObjectAssetName.toString()]
                    uitlegschemaDistance = (uitlegschemaDistance.toString().split("&",2)[0])
                    console.log(uitlegschemaDistance)
                    if(uitlegschemaDistance.includes("|") && (Object.values(findNeighbourObject.diameter)[0])<=0.2){
                      console.log(Object.values(findNeighbourObject.diameter)[0])
                      uitlegschemaDistance = (uitlegschemaDistance.toString().split("|",2)[0])
                      console.log ("using G_t <= 200mm")
                    }else if((uitlegschemaDistance.includes("|") && (Object.values(findNeighbourObject.diameter)[0])>0.2)){
                      console.log(Object.values(findNeighbourObject.diameter)[0])
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
              }else if(o.Asset.includes("G_t") && neighbourObjectAssetId == "Gebouwen"){
                console.log("Gebouwen next to G_t")
                if(parseFloat(diameter)<=0.2){
                  console.log("using G_t <= 200mm")
                  uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()].split("/",2)[0])
                }else{
                  console.log("using G_t > 200mm")
                  uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()].split("/",2)[1])
                }
              }
              // else if(o.Asset.includes("E (LS)") && neighbourObjectAssetId == "E (LS)"){
              //   //TODO ?
              //   uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()])
              // }  
              else{
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
            var currentObjectDistance = parseFloat(Object.values(findCurrentObject.distance)[0]);
            if(RAND.includes(Object.values(findCurrentObject.assetId)[0])){
              console.log("Get CURRENT OBJECT distance to edge")
              currentObjectDistance += parseFloat((Object.values(findCurrentObject.diameter)[0])/2);
            }else console.log("Get CURRENT OBJECT distance to center")

            var findNeighbourObject = appContext.storedObjectsUpload.find(object => object.objectId == order[i+x])
            
            var neighbourObjectDistance = parseFloat(Object.values(findNeighbourObject.distance)[0]);
            if(RAND.includes(Object.values(findNeighbourObject.assetId)[0])){
              console.log("Get NEIGHBOUR OBJECT distance to edge")
              neighbourObjectDistance -= parseFloat((Object.values(findNeighbourObject.diameter)[0])/2)
            }else console.log("Get NEIGHBOUR OBJECT distance to center")

            var distanceBetweenObjects = neighbourObjectDistance - currentObjectDistance;
            console.log("currentObjectDistance: " + currentObjectDistance + " neighbourObjectDistance: " + neighbourObjectDistance + " distanceBetweenObjects: " + distanceBetweenObjects)

            var uitlegschemaDistance, neighbourObjectAssetId;

            //TODO: Fix this for E (LS)
            //get the minimum distance for corresponding object types from Uitlegschema 
            ObjectData.afstand.map((o) => { 
              if(o.Asset == Object.values(findCurrentObject.assetId)[0] ){
                neighbourObjectAssetId = Object.values(findNeighbourObject.assetId)[0]
                var neighbourObjectAssetName = neighbourObjectAssetId.toString().split("_",2)[0];
                console.log("neighbourObjectAssetName: " +  neighbourObjectAssetName)
                console.log("o.Asset: " + o.Asset)

                var neighbourObjectAssetCat = neighbourObjectAssetId.toString().split("_",2)[1];
                console.log("neighbourObjectAssetCat: " +  neighbourObjectAssetCat)
                
                if(o.Asset.includes("Boom")|| o.Asset.includes("Gebouwen")){ //current asset
                  if(neighbourObjectAssetCat === "t"){
                    uitlegschemaDistance = o[neighbourObjectAssetName.toString()]
                    uitlegschemaDistance = (uitlegschemaDistance.toString().split("&",2)[0])
                    console.log(uitlegschemaDistance)
                    if(uitlegschemaDistance.includes("|") && (Object.values(findNeighbourObject.diameter)[0])<=0.2){
                      console.log(Object.values(findNeighbourObject.diameter)[0])
                      uitlegschemaDistance = (uitlegschemaDistance.toString().split("|",2)[0])
                      console.log ("using G_t <= 200mm")
                    }else if((uitlegschemaDistance.includes("|") && (Object.values(findNeighbourObject.diameter)[0])>0.2)){
                      console.log(Object.values(findNeighbourObject.diameter)[0])
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
              }else if(o.Asset.includes("G_t") && neighbourObjectAssetId == "Gebouwen"){
                console.log("Gebouwen next to G_t")
                if(parseFloat(diameter)<=0.2){
                  console.log("using G_t <= 200mm")
                  uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()].split("/",2)[0])
                }else{
                  console.log("using G_t > 200mm")
                  uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()].split("/",2)[1])
                }
              }
              // else if(o.Asset.includes("E (LS)") && neighbourObjectAssetId == "E (LS)"){
              //   //TODO ?
              //   uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()])
              // }  
              else{
                uitlegschemaDistance = parseFloat(o[neighbourObjectAssetName.toString()])
              }                  
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


    if(isMounted.current){
      appContext.setSelectedObjectId(objectId)
      console.log("Selected Object: " + objectId)
    } else {isMounted.current = true;
      appContext.setObjectConflicts([]);
      appContext.setObjectConflictsLog('');
    }

    console.log("appContext.updatedState: " + appContext.updatedState)
    
    if((clicked && appContext.selectedObjectId == objectId) || appContext.updatedState == 'ADDED' ){
      appContext.setSelectedObjectId(0);
      console.log("No selected object")
      appContext.setObjectConflicts([]);
      appContext.setObjectConflictsLog('');
      if(appContext.updatedState == 'ADDED') appContext.setUpdatedState('NONE')
    }
  
  }, [clicked])

 
  //Add condition to choose the choosen color of the object or the conflict color or color when selected and update in meshStandardMaterial with a variable

  if(appContext.selectedObjectId != objectId){
    if(appContext.objectConflicts.includes(objectId)){
      objectColor = "#fc2808";
    } else {
        objectColor = Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).color)[0];
    } 
  } else if(appContext.selectedObjectId == objectId ){
      objectColor = "#faf202";
    }

  
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const handleClose = () => { setShowUpdateModal(false);
      appContext.setSelectedObjectId(0);
      console.log("No selected object")
      appContext.setObjectConflicts([]);
      appContext.setObjectConflictsLog(''); 
    }
    const handleShow = () => {setShowUpdateModal(true);
      appContext.setSelectedObjectId(0);
      console.log("No selected object")
      appContext.setObjectConflicts([]);
      appContext.setObjectConflictsLog('');
    }
  
    function AssetUpdateModal(props) {
    
    const depthRef = useRef();
    const diameterRef = useRef();
  
  
      const handleUpdate = () => {

        if (depthRef.current.value === '') return
        else if (diameterRef.current.value === '') return  

        var updatedObject = appContext.storedObjectsUpload.slice();
        
        var foundIndex = updatedObject.findIndex(object => object.objectId == objectId)
        updatedObject[foundIndex].diameter.diameter = diameterRef.current.value; 
        updatedObject[foundIndex].depth.depth = depthRef.current.value;
        
        console.log("Updated object diameter: " + Object.values(updatedObject.find(object => object.objectId == objectId).diameter)[0])  
        console.log("Updated object depth: " + Object.values(updatedObject.find(object => object.objectId == objectId).depth)[0])
        
        appContext.setStoredObjectsUpload(updatedObject);
        console.log(appContext.storedObjectsUpload)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appContext.storedObjectsUpload))

        //TODO IDEA: Order is not recalculated should I? 

        depthRef.current.value = null;
        diameterRef.current.value = null;
        
        handleClose();
      }

      const handleDelete = () => {
        var order = appContext.storedObjectsOrder.slice();
        order = order.filter(o => !(o == objectId))
        
        appContext.setStoredObjectsOrder(order);
        localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(order))
        
        console.log(Object.values(appContext.storedObjectsOrder))
        
        handleClose();
      }
  
      return(
     
        <>
          <Modal {...props} size="lg"
          aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showUpdateModal} 
        onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update asset details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Type</Form.Label>
            <Form.Control
              disabled
              defaultValue={assetId}
            />
              <Form.Label>Diameter of this asset (in meters)</Form.Label>
               <Form.Control
                ref = {diameterRef}
                type="decimal"
                defaultValue = {Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).diameter)[0]}
                autoFocus
            />  
            <Form.Text className="text-muted">
              Uitlegschema recommendation: {(ObjectData.afstand.find((object) => object.Asset == assetId).Diameter).toString()}
            </Form.Text>
            
            <br/>
  
            <Form.Label>Depth (in meters) [length from the horizontal line to the top edge of this asset]</Form.Label>
            <Form.Control
              ref = {depthRef}
              type="decimal"
              defaultValue = {Object.values(appContext.storedObjectsUpload.find(object => object.objectId == objectId).depth)[0]}
            />
            <Form.Text className="text-muted">
              Uitlegschema recommendation: {(ObjectData.afstand.find((object) => object.Asset == assetId).Depth).toString()}
            </Form.Text>
  
            </Form.Group>
            </Form>  
          </Modal.Body>
  
          <Modal.Footer>
            <>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update asset
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete asset
          </Button>
          </>
        </Modal.Footer>
          </Modal>  
        </>
    )
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
      onDoubleClick={handleShow}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      {assetId.includes("Boom") ? 
      <mesh position ={[0, parseFloat(height)/2 + parseFloat(diameter)/2, 0]}>
      <cylinderGeometry args={[parseFloat(trunkDia/2),parseFloat(trunkDia/2),parseFloat(height),50]} /> 
      <meshStandardMaterial color= {(appContext.selectedObjectId == objectId || appContext.objectConflicts.includes(objectId)) ? objectColor : '#754007'} wireframe ={hovered ? true : false}/>
        <mesh position ={[0, parseFloat(height/2 + crown - 0.1 ), 0]}>
        <sphereGeometry args={[parseFloat(crown)]} /> 
        <meshStandardMaterial color= {objectColor} wireframe ={hovered ? true : false}/>
        </mesh>
      </mesh>
      :
      null
      }
      <cylinderGeometry args={[diameter/2,diameter/2,cylinderDepth,50]} />
      <meshStandardMaterial color= {objectColor} wireframe ={hovered ? true : false}/>
      {hovered && (
        <Html>
          <div className="tooltiptext">
          <p style={{color:objectColor}} >
          {assetId}
          </p>
          </div>
        </Html>
      )}
      {
        <Html>
          <AssetUpdateModal/>
        </Html>
      }
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