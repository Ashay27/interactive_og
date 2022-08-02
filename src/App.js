
import './App.css';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' ;
import "/node_modules/materialize-css/dist/js/materialize.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SketchPicker } from "react-color";

import {Button, Form, Modal} from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
//import PipeModal from './Components/PipeModal';
import OrderModal from './Components/OrderModal';
import AddObjectsFromCSVModal from './Components/AddObjectsFromCSVModal';
import Papa from "papaparse";
import UploadObjects from './Components/UploadObjects';
import ObjectData from './uitlegschemaAfstand.json';
import UploadObjectFromLocalStorage from './Components/UploadObjectFromLocalStorage';
import GetAllObjects from './Components/GetAllObjects'
import AppContext from './Components/AppContext';
import ChangeOrder from './Components/ChangeOrder';
import background from './haaksbergwegBackground.png'
import { Vector3 } from 'three';

const LOCAL_STORAGE_KEY = 'localData.objects'
const LOCAL_ID_KEY = 'localData.id'
const LOCAL_ORDER_KEY = 'localData.order'
const LOCAL_LINE_KEY = 'localData.lineIntersect'

// localStorage.clear();

// const storedObjects1 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
// storedObjects1.splice(24,1);
// localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedObjects1));

// const storedOrder1 = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
// storedOrder1.splice(24,1);
// localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(storedOrder1));

// // const storedId1 = JSON.parse(localStorage.getItem(LOCAL_ID_KEY));
// // storedId1 = 24;
// localStorage.setItem(LOCAL_ID_KEY, JSON.stringify('24'));

console.log(JSON.parse(localStorage.getItem(LOCAL_ID_KEY)))
var arrObj = [];

const Aspect = () => {
  const { size, viewport } = useThree();
  return size.width / viewport.width;
}

const CameraController = ({rotate}) => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);
          
      console.log("rotate: " + rotate)
      controls.enableRotate = rotate;


      function saveCameraPosition() {
        localStorage.setItem('camera.hasPosition', 'true');

        localStorage.setItem('camera.zoom', camera.zoom.toString());
        localStorage.setItem('camera.position.x', camera.position.x.toString());
        localStorage.setItem('camera.position.y', camera.position.y.toString());
        localStorage.setItem('camera.position.z', camera.position.z.toString());
      
        localStorage.setItem('camera.rotation.x', camera.rotation.x.toString());
        localStorage.setItem('camera.rotation.y', camera.rotation.y.toString());
        localStorage.setItem('camera.rotation.z', camera.rotation.z.toString());
      
        localStorage.setItem('controls.target.x', controls.target.x.toString());
        localStorage.setItem('controls.target.y', controls.target.y.toString());
        localStorage.setItem('controls.target.z', controls.target.z.toString());
      }
      
      function loadCameraLocation() {
        if (localStorage.getItem('camera.hasPosition') !== 'true') return;

        camera.position.x = parseFloat(localStorage.getItem('camera.position.x'));
        camera.position.y = parseFloat(localStorage.getItem('camera.position.y'));
        camera.position.z = parseFloat(localStorage.getItem('camera.position.z'));
        camera.zoom = parseFloat(localStorage.getItem('camera.zoom'));
      
        camera.rotation.x = parseFloat(localStorage.getItem('camera.rotation.x'));
        camera.rotation.y = parseFloat(localStorage.getItem('camera.rotation.y'));
        camera.rotation.z = parseFloat(localStorage.getItem('camera.rotation.z'));
      
        controls.target.x = parseFloat(localStorage.getItem('controls.target.x'));
        controls.target.y = parseFloat(localStorage.getItem('controls.target.y'));
        controls.target.z = parseFloat(localStorage.getItem('controls.target.z'));
      }
      
      loadCameraLocation();
      window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'r') {
          e.preventDefault();
          saveCameraPosition();
          console.log("Updated camera zoom: " + camera.zoom)
        }
      });
      console.log("camera.zoom: " + camera.zoom)

      //if(!rotate){controls.reset()}
      
      return () => {
        controls.dispose();
      };
    },
    [camera, gl, rotate]
  );
  return null;
};

function PipeModal(props) {
  const [showPipeModal, setShowPipeModal] = useState(false);
  const handleClose = () => setShowPipeModal(false);
  const handleShow = () => setShowPipeModal(true);
  // For choice of color
  //const [sketchPickerColor, setSketchPickerColor] = useState("#BD9F9F");

  const ASSET_TYPE_TEXT = 'Choose the type of asset you want to add'
  const appContext = useContext(AppContext);
  
  const optionNameRef = useRef();
  const distanceRef = useRef();
  const depthRef = useRef();
  const diameterRef = useRef();

  const handleUpload = () => {
    const optionName = optionNameRef.current.value;
    const distance = distanceRef.current.value;
    const depth = depthRef.current.value;
    const diameter = diameterRef.current.value;
    // For choice of color
    //const color = sketchPickerColor;

    //TODO: Validate if input of distance, depth and diameter is string (only float and number is valid) and is greater than 0
    if (optionName === ASSET_TYPE_TEXT) return window.alert("Please choose the type of asset")
    else if (distance === '') return
    else if (depth === '') return
    else if (diameter === '') return  

    var color = ObjectData.afstand.find(o => o.Asset == optionName).Color;
    console.log("color: " + color)
    
    // const object =[{'diameter': diameter, 'depth': depth}];
    // console.log(object);
    // console.log({distance});
    console.log({optionName});

    appContext.storedObjectId += 1;
    appContext.setStoredObjectsId(appContext.storedObjectId)
    console.log(appContext.storedObjectId);

    appContext.setStoredObjectsUpload(prevObjects => {
      return [...prevObjects,{diameter: {diameter}, depth:{depth}, distance: {distance}, assetId: {optionName}, objectId: (appContext.storedObjectId), color: {color} }]
    })
    
    appContext.setUpdatedObjectId(appContext.storedObjectId)
    appContext.setUpdatedState('ADDED')

    console.log(Object.values(appContext.storedObjectsOrder))

    optionNameRef.current.value = null;
    distanceRef.current.value = null;
    depthRef.current.value = null;
    diameterRef.current.value = null;

    setShowPipeModal(false);
  }

return (
  <>
  <Button className = "B" onClick={handleShow}>
    Add Object
  </Button>

  <Modal {...props}  
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    show={showPipeModal} 
    onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Asset details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Type</Form.Label>
          <Form.Select ref={optionNameRef}>
            <option>{ASSET_TYPE_TEXT}</option>
            {ObjectData.afstand.map((object) => (
              <option value={object.Asset} >{object.Beschrijving} ({object.Categorie})</option>
            ))}
          </Form.Select>
          {/* <Form.Label>Name</Form.Label>
          <Form.Control
            type="textarea"
            autoFocus
          /> */}
          <Form.Label>Diameter of this asset (in meters)</Form.Label>
          <Form.Control
            ref = {diameterRef}
            type="decimal"
            autoFocus
          />
          <Form.Label>Depth (in meters) [length from the horizontal line to the top edge of this asset]</Form.Label>
          <Form.Control
            ref = {depthRef}
            type="decimal"
            //placeholder="name@example.com"
            autoFocus
          />
          <Form.Label>Distance (in meters) [length from the left vertical line to the center of this asset]</Form.Label>
          <Form.Control
            ref = {distanceRef}
            type="decimal"
            //value = "1"
            autoFocus
            //disabled 
          />

          {/* For choice of color
          <Form.Label>Color of this asset [yellow (#faf202) is reserved for selected object and red (#fc2808) is reserved for conflicts]</Form.Label>
          <SketchPicker
            onChange={(color) => {
              setSketchPickerColor(color.hex);
            }}
            color={sketchPickerColor}
          /> */}
                     
          </Form.Group>
       </Form>
      </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleUpload}>
        Upload the object
      </Button>
    </Modal.Footer>
  </Modal>
</>
)
}

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./Lega Blocks - Haaksbergweg - Principe straat_no K&L_moved to origin_reducedPolycount4.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={1} />
    </>
  );
};

function ControlLines() {
  const appContext = useContext(AppContext);
  var valueH;
  var valueV;
  var valueV2;

  useEffect(() => {
    var storedIntersect = JSON.parse(localStorage.getItem(LOCAL_LINE_KEY));
    console.log("storedIntersect: " + storedIntersect);
    if(storedIntersect) {
      appContext.setStoredLineIntersect(storedIntersect);
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem(LOCAL_LINE_KEY, JSON.stringify(appContext.storedLineIntersect))
  }, [appContext.storedLineIntersect])
    
  const ref = useRef()
  const ref2 = useRef()
  const ref3 = useRef()

  const points = []
  points.push(new THREE.Vector3(-5, appContext.storedLineIntersect[0], 0)) 
  points.push(new THREE.Vector3(40, appContext.storedLineIntersect[0], 0))

  //console.log("pointsH: " + appContext.storedLineIntersect[0])

  const [newPoints, setNewPoints] = useState(points)
  const lineGeometry = new THREE.BufferGeometry();

  const points2 = []
  points2.push(new THREE.Vector3(appContext.storedLineIntersect[1], -5, 0))
  points2.push(new THREE.Vector3(appContext.storedLineIntersect[1], 40, 0))

  const [newPoints2, setNewPoints2] = useState(points2)
  const lineGeometry2 = new THREE.BufferGeometry();

  const points3 = []
  points3.push(new THREE.Vector3(appContext.storedLineIntersect[2], -5, 0))
  points3.push(new THREE.Vector3(appContext.storedLineIntersect[2], 40, 0))

  const [newPoints3, setNewPoints3] = useState(points3)
  const lineGeometry3 = new THREE.BufferGeometry();

  //for dragging the line (Not used because it leads to very precise values) 
  //Better to get input from user based on the GLTF they upload they can tell the intersection of the lines
  // and that is used as the starting point from mesurement of depth and distance 

  // const bind = useDrag(({ offset: [x,y] }) => {
  //     const updatePoints = [];
  
  //     newPoints.pop();
  //     newPoints.pop();

  //     updatePoints.push(new THREE.Vector3((points[0].x +(x/aspect)), (points[0].y)+(-y/aspect), points[0].z))
  //     updatePoints.push(new THREE.Vector3((points[1].x +(x/aspect)), (points[1].y)+(-y/aspect), points[1].z))
  //     setNewPoints(updatePoints);

  // }, { pointerEvents: true });
  

  const handleClickH = () => {
      let moveHorizontal = window.prompt("Parallely move the horizontal line to?", appContext.storedLineIntersect[0])
      valueH = appContext.storedLineIntersect[0];
      if(moveHorizontal != null && !isNaN(moveHorizontal) && moveHorizontal != "") {
        valueH = parseFloat(moveHorizontal) 
      }
      const updatePoints = [];
  
      newPoints.pop();
      newPoints.pop();

      updatePoints.push(new THREE.Vector3(-5, valueH, 0))
      updatePoints.push(new THREE.Vector3(40, valueH, 0))
      setNewPoints(updatePoints)
  }

  lineGeometry.setFromPoints(newPoints);
  console.log("x,y: " + newPoints[0].x + "," + newPoints[0].y)
  console.log("x,y: " + newPoints[1].x + "," + newPoints[1].y)

  //for dragging the line (Not used because it leads to very precise values) 
  //Better to get input from user based on the GLTF they upload they can tell the intersection of the lines
  // and that is used as the starting point from mesurement of depth and distance 

  // const bind2 = useDrag(({ offset: [x,y] }) => {
  //     const updatePoints = [];
  
  //     newPoints2.pop();
  //     newPoints2.pop();

  //     updatePoints.push(new THREE.Vector3((points2[0].x +(x/aspect)), (points2[0].y)+(-y/aspect), points2[0].z))
  //     updatePoints.push(new THREE.Vector3((points2[1].x +(x/aspect)), (points2[1].y)+(-y/aspect), points2[1].z))
  //     setNewPoints2(updatePoints);

  // }, { pointerEvents: true });

  const handleClickV = () => {
      let moveVertical = window.prompt("Parallely move the vertical line to?", appContext.storedLineIntersect[1])
      //var value = 0;
      console.log("moveVertical: " + moveVertical)
      valueV = appContext.storedLineIntersect[1];
      if(moveVertical != null && !isNaN(moveVertical) && moveVertical != "") {
        valueV = parseFloat(moveVertical) 
      }
      const updatePoints = [];
  
      newPoints2.pop();
      newPoints2.pop();

      updatePoints.push(new THREE.Vector3(valueV, -5, 0))
      updatePoints.push(new THREE.Vector3(valueV, 40, 0))
      setNewPoints2(updatePoints)   
  }
  
  
  lineGeometry2.setFromPoints(newPoints2);
  console.log("x,y: " + newPoints2[0].x + "," + newPoints2[0].y)
  console.log("x,y: " + newPoints2[1].x + "," + newPoints2[1].y)

  const handleClickV2 = () => {
    let moveVertical = window.prompt("Parallely move the vertical line to?", appContext.storedLineIntersect[2])
    //var value = 0;
    console.log("moveVertical: " + moveVertical)
    valueV2 = appContext.storedLineIntersect[2];
    if(moveVertical != null && !isNaN(moveVertical) && moveVertical != "") {
      valueV2 = parseFloat(moveVertical) 
    }
    const updatePoints = [];

    newPoints3.pop();
    newPoints3.pop();

    updatePoints.push(new THREE.Vector3(valueV2, -5, 0))
    updatePoints.push(new THREE.Vector3(valueV2, 40, 0))
    setNewPoints3(updatePoints)   
  }


  lineGeometry3.setFromPoints(newPoints3);
  console.log("x,y: " + newPoints3[0].x + "," + newPoints3[0].y)
  console.log("x,y: " + newPoints3[1].x + "," + newPoints3[1].y)

  var lineIntersect = new Array([valueH,valueV,valueV2]);
  
  if(appContext.storedLineIntersect){
    lineIntersect = appContext.storedLineIntersect.slice();
  }

  lineIntersect.splice(0,1,newPoints[0].y);
  lineIntersect.splice(1,1,newPoints2[0].x);
  lineIntersect.splice(2,1,newPoints3[0].x);
  console.log("Line Intersect Points - H: " + newPoints[0].y +", V " + newPoints2[0].x + ", V2 " + newPoints3[0].x )
  useMemo(() => appContext.setStoredLineIntersect(lineIntersect), [newPoints[0].y , newPoints2[0].x, newPoints3[0].x]);

  console.log("Line Geometry Horizontal: " +  Object.values(newPoints[0]) + " and " + Object.values(newPoints[1]))
  console.log("Line Geometry Vertical: " + Object.values(newPoints2[0]) + " and " + Object.values(newPoints2[1]) )
  console.log("Line Geometry Vertical2: " + Object.values(newPoints3[0]) + " and " + Object.values(newPoints3[1]) )

return (
  <>
  <group>
      <mesh onDoubleClick={handleClickH}>
          <line ref={ref} geometry={lineGeometry}>
              <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={10} linecap={'round'} linejoin={'round'} />
          </line>
      </mesh>
      
      <mesh onDoubleClick={handleClickV}
      //   {...bind2()}
      >
          <line ref={ref2} geometry={lineGeometry2}>
              <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={10} linecap={'round'} linejoin={'round'} />
          </line>
      </mesh>

      <mesh onDoubleClick={handleClickV2}>
          <line ref={ref3} geometry={lineGeometry3}>
              <lineBasicMaterial attach="material" color={'#1bdcf5'} linewidth={10} linecap={'round'} linejoin={'round'} />
          </line>
      </mesh>
  </group>
  </>
)
}

function App() {
 
  //State to store the values
  const [values, setValues] = useState([]);
  const [show, setShow] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  

  const [showStoredObjectsUpload, setShowStoredObjectsUpload] = useState(false);
  const [storedObjectsUpload, setStoredObjectsUpload] = useState([]);
  const [storedObjectId, setStoredObjectsId] = useState(0);
  const [storedObjectsOrder, setStoredObjectsOrder] = useState([]);
  const [objectConflicts, setObjectConflicts] = useState([]);
  const [objectConflictsLog, setObjectConflictsLog] = useState('');
  const [storedLineIntersect, setStoredLineIntersect] = useState([0,0,25]);
  const [updatedObjectId, setUpdatedObjectId] = useState();
  const [updatedState, setUpdatedState] = useState('NONE');

  const showSettings = {
    showStoredObjectsUpload: showStoredObjectsUpload,
    storedObjectsUpload: storedObjectsUpload,
    storedObjectId: storedObjectId,
    storedObjectsOrder: storedObjectsOrder,
    LOCAL_ORDER_KEY: LOCAL_ORDER_KEY,
    objectConflicts: objectConflicts,
    objectConflictsLog: objectConflictsLog,
    storedLineIntersect: storedLineIntersect,
    updatedObjectId: updatedObjectId,
    rotate:rotate,
    updatedState: updatedState,
    setShowStoredObjectsUpload,
    setStoredObjectsUpload,
    setStoredObjectsId,
    setStoredObjectsOrder,
    setObjectConflicts,
    setObjectConflictsLog,
    setStoredLineIntersect,
    setUpdatedObjectId,
    setUpdatedState,
    setRotate
  };

  const objectNumberRef = useRef();
  const orderNumberRef = useRef();

  useEffect(() => {
    const storedObjects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedObjects) {
      setStoredObjectsUpload(storedObjects);
      console.log(storedObjects);
    }
    const lineIntersect = JSON.parse(localStorage.getItem(LOCAL_LINE_KEY));
    if(lineIntersect && lineIntersect.length>0){
      setStoredLineIntersect(lineIntersect);
    }
    setStoredObjectsId(JSON.parse(localStorage.getItem(LOCAL_ID_KEY)));
    const orderObjects = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
    if(orderObjects && orderObjects.length>0){
      setStoredObjectsOrder(orderObjects);
      console.log((orderObjects))
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedObjectsUpload))
    localStorage.setItem(LOCAL_LINE_KEY, JSON.stringify(storedLineIntersect))
    localStorage.setItem(LOCAL_ID_KEY, JSON.stringify(storedObjectId))
    localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(storedObjectsOrder))
  }, [storedObjectsUpload,storedLineIntersect,storedObjectId,storedObjectsOrder])

  //console.log('Here ' + Object.values(storedObjectsOrder))


  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setValues(results.data);
      }
    });

    setShow(true)
    console.log({show})

  };

  function unparseData() {
    Papa.unparse(values);
  }

  const hiddenFileInput = useRef();

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  // const handleChangeOrder = () => {
  //   if (storedObjectsUpload === "" && storedObjectsUpload.length <= 1) return (
  //     window.alert("INVALID. More than 1 objects required!"))

  //   if(objectNumberRef.current.value === '' || objectNumberRef.current.value <= 0 ) return (
  //     window.alert("INVALID object number. Fill the correct objects number! \nIt should not be empty and greater than 0"))
  //   else if (orderNumberRef.current.value === '' || orderNumberRef.current.value <= 0) return (
  //     window.alert("INVALID order number. Fill the correct order number! \nIt should not be empty and greater than 0"))

  // //  if(storedObjectsOrder.length<2) return window.alert("INVALID. More than 1 objects required!")
  //   var order = storedObjectsOrder.slice();
  //   var tempObj = order.splice(objectNumberRef.current.value-1,1);
  //   order.splice(orderNumberRef.current.value-1,0,tempObj[0]);
  //   setStoredObjectsOrder(order);

  //   objectNumberRef.current.value = null;
  //   orderNumberRef.current.value = null;

  //   window.location.reload(true);
  // }

  const handleDelete = () => {
    // Only deleting from order, since uploading objects only if they exist in order
    if (storedObjectsUpload === "" ) return (
      window.alert("INVALID. At least 1 object should be added!"))

    if(objectNumberRef.current.value === '' || objectNumberRef.current.value <= 0 ) return (
      window.alert("INVALID object number. Fill the correct objects number! \nIt should not be empty and greater than 0"))
    else if ( objectNumberRef.current.value > storedObjectsOrder.length) return (
        window.alert("INVALID object number. \nThis should be less than or equal to the current number of objects in the profile.")
      )
   
    var order = storedObjectsOrder.slice();
    setUpdatedObjectId(order[objectNumberRef.current.value-1])
    setUpdatedState('DELETED')

    objectNumberRef.current.value = null;
    
  }

  const handleClearData = () => {
    if (window.confirm("This will clear all the data loaded for the profile. Press OK to confirm.") == true) {
      localStorage.clear();
      window.location.reload(true);
    } else { 
      return
    }
  }
  const handleRotate = () => {
    setRotate(!rotate)
  }

  const handleGrid = () => {
    setShowGrid(!showGrid)
  }

  function getZoom(){
    if (localStorage.getItem('camera.hasPosition') !== 'true') {
      return 25;
    }
    return parseFloat(localStorage.getItem('camera.zoom'));
  }

  function NewlineText(props) {
    const text = props.text;
    const newText = text.split('\n').map(str => <p>{str}</p>);
    
    return newText;
  }

  var legendObjects = storedObjectsOrder.slice();
  var currentObjects = storedObjectsUpload.slice();
  console.log("legend Objects: " + legendObjects)
  if(legendObjects.length>0){
    currentObjects = currentObjects.filter(o => legendObjects.includes(o.objectId)) //.filter(o => o.objectId == element )
    console.log("currentObjects: " + Object.values(currentObjects[0]))
  }

  let uniqueColors = [...new Set(currentObjects.map(o => Object.values(o.color)[0]))];
  console.log(uniqueColors);
  
  return (
    <AppContext.Provider value={showSettings}>
    
    <div className= "Interaction-flexbox-container" >


    < div className= "flexbox-interaction conflicts-log">
        <p> Click on an object to see the related conflicts </p>
        <NewlineText text={objectConflictsLog} />
    </div>

    <div class='my-legend'>
      <div class='legend-title'>Legend</div>
      <div class='legend-scale'>
        <ul class='legend-labels'>
        {(legendObjects.length>0)?(uniqueColors.map((object) => (
          <li><span style={{background:object}}></span>
          {Object.values(currentObjects.find(o => Object.values(o.color) == object).assetId)[0]}</li>
            ))): null}
          <li><span style={{background:"#faf202"}}></span>Selected</li>
          <li><span style={{background:"#fc2808"}}></span>Conflict</li>
        </ul>
      </div>
      </div>
      
      < div className= "flexbox-interaction buttons">
        {/* <DropdownButton as={ButtonGroup} title="Add" id="bg-nested-dropdown">
          <Dropdown.Item eventKey="2"><PipeModal/></Dropdown.Item>
          <Dropdown.Item eventKey="3"><OrderModal/></Dropdown.Item>
        </DropdownButton> */}
                  
        <Button className = "B" onClick={handleRotate}>
                  Rotate
        </Button>
        <Button  className = "B" onClick= {handleGrid}>
                  Grid
        </Button>
        
        

        <div>
        <PipeModal/>
        <br/><br/>

          <Form>
              <Form.Label>Object Number [current number from the profile]</Form.Label>
              <Form.Control
                ref = {objectNumberRef}
                type="number" 
              />
              <Button className = "B" onClick={handleDelete}>
                  Delete object
              </Button>
              <br/>
              <Form.Text classname = "text-muted">The object in current position will be deleted</Form.Text>
          </Form>
          <br/>
          <Button className = "B" onClick={handleClearData}>
              Clear all
          </Button>

          {/* <Button onClick={handleClick}>
              Upload a file
          </Button> */}
          
          <input
            type = "file"
            id="file-input"
            ref={hiddenFileInput}
            onChange={changeHandler}
            accept=".csv"
            style={{display: 'none'}}
          />
        </div>
      
        {/* arrObj = <AddObjectsFromCSVModal show = {show} objects = {values} />; */}
        {/* <AddObjectsFromCSVModal show = {show} objects = {values} /> */}
      
      </div>
      
      {/* <div className='flexbox-interaction background'>
      <img src = {background}  z-index = '-1'/>
      </div> */}
      
      <div className='flexbox-interaction canvas'>
      {/* <Canvas camera={ {position: [2,2,10], fov: 70}} > */}
      <Canvas orthographic camera={ {position: [0,0,200], zoom: getZoom() , top:200, bottom:-200, left:200, right:200, near:0, far:2000 }}>
      <AppContext.Provider value={showSettings}>
        <group>
        <CameraController rotate={rotate}/>
         
        <ambientLight intensity={0.25} color={0xFFFFFF} />
        <pointLight intensity={0.75} position={[500, 500, 1000]} />
        {/* <directionalLight position={[100, 100, 100]} color={0xFFFFFF} /> */}

        <mesh rotation={[Math.PI/2,0,0]} position ={[30, 30, 0]} visible ={showGrid} >
        <gridHelper args={[100,200,"#f0f0ed","#f0f0ed"]} />
        </mesh>
        <Model />
        <ControlLines />
        {/* <AddObjectsFromCSVModal show = {show} objects = {values} /> */}
         
        {/* <UploadObjects /> */}

        {/* TODO: reduce the number of input parameters show? */}
        {/* <UploadObjectFromLocalStorage show = 'true' objects = {storedObjectsUpload} order = {storedObjectsOrder} setObjectConflicts = {setObjectConflicts} objectConflicts = {objectConflicts} setObjectConflictsLog = {setObjectConflictsLog}/> */}
        <GetAllObjects storedObjectsOrder = {storedObjectsOrder} updatedObjectId = {updatedObjectId} updatedState ={updatedState} />
        </group>
      </AppContext.Provider> 
      </Canvas>
      {/* <Order objects = {storedObjectsUpload} /> */}
      </div>
      
    </div>
    </AppContext.Provider>
  )
}

export default App;
