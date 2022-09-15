
import './App.css';
import React, {Suspense, useContext, useEffect, useMemo, useRef, useState , useReducer} from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' ;
import "/node_modules/materialize-css/dist/js/materialize.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";
import { SketchPicker } from "react-color";
import RangeSlider from 'react-bootstrap-range-slider';

import {Button, Form, Modal, OverlayTrigger, Tooltip, Col, Row, ToggleButton, Table, Stack, Spinner, Toast, ToastContainer} from 'react-bootstrap';
import InfoModalContent from './Components/InfoModalContent'
import Dropdown from 'react-bootstrap/Dropdown'
import {ButtonGroup, ButtonToolbar} from 'react-bootstrap'
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
const [DEFAULT,ROTATE,FRONT,TOP, PERSPECTIVE] = ['DEFAULT', 'ROTATE', 'FRONT', 'TOP', 'PERSPECTIVE']
const NOVALUE = ["Boom 1", "Boom 2", "Boom 3", "Gebouwen"]

const initialState = { 
  view: PERSPECTIVE,
  positionX: localStorage.getItem('camera.hasPosition') != 'true' ? 30 : parseFloat(localStorage.getItem('camera.position.x')),
  positionY: localStorage.getItem('camera.hasPosition') != 'true' ? 20 : parseFloat(localStorage.getItem('camera.position.y')),
  positionZ: localStorage.getItem('camera.hasPosition') != 'true' ? 200 : parseFloat(localStorage.getItem('camera.position.z')),
  rotate: false
}

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

function Loader() {
  const { progress } = useProgress()
  return <Html center>
        {/* {progress} % loaded */}
      <Spinner animation="border" role="status" variant="success">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </Html>
}

const CameraController = () => {
  const {viewState} = useContext(AppContext);
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);
          
      console.log("View: " + viewState.view)
      controls.enableRotate = (viewState.rotate);

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
      
      window.addEventListener('keydown', (e) => {
          if (e.altKey && e.key === 'r') {
            e.preventDefault();
            saveCameraPosition();
            console.log("Rotate view saved")
          }
      });
      console.log("camera.zoom: " + camera.zoom)

      //if(!rotate){controls.reset()}
      

    camera.position.set(viewState.positionX,viewState.positionY,viewState.positionZ);
    if(viewState.view == ROTATE && localStorage.getItem('camera.hasPosition') == 'true') {
      console.log("Getting camera rotation")
      camera.rotation.x = parseFloat(localStorage.getItem('camera.rotation.x'));
      camera.rotation.y = parseFloat(localStorage.getItem('camera.rotation.y'));
      camera.rotation.z = parseFloat(localStorage.getItem('camera.rotation.z'));
    }
    controls.update();

      return () => {
        controls.dispose();
      };
    },
    [camera, gl, viewState]
  );
  return null;
};

function PipeModal(props) {
  const ASSET_TYPE_TEXT = 'Choose the type of asset you want to add'

  const [diaOverride, setDiaOverride] = useState(false);
  const [showPipeModal, setShowPipeModal] = useState(false);
  
  const handleClose = () => {setShowPipeModal(false);
    setAssetName(ASSET_TYPE_TEXT)
 }
  const handleShow = () => setShowPipeModal(true);

  const [ assetName, setAssetName ] = useState(ASSET_TYPE_TEXT);
  const [ diameterValue, setDiameterValue ] = useState(0);
  const [ finalDiameterValue, setFinalDiameterValue ] = useState(null);
  const [ userDiameterValue, setUserDiameterValue ] = useState(null);
  const [ minDiameterValue, setMinDiameterValue ] = useState(0);
  const [ maxDiameterValue, setMaxDiameterValue ] = useState(0);
  var chooseAssetDisabled = false;
  
  var ulsDiaMin = 0;
  var ulsDiaMax = 0;

  useMemo(()=> {
    if(assetName != ASSET_TYPE_TEXT && !(NOVALUE.includes(assetName))){
    ulsDiaMin = (ObjectData.afstand.find((object) => object.Asset == (assetName).toString()).Diameter).toString().includes("-") ? parseFloat((ObjectData.afstand.find((object) => object.Asset == assetName).Diameter).split("-",2)[0]) : parseFloat((ObjectData.afstand.find((object) => object.Asset == assetName).Diameter))
    ulsDiaMax = (ObjectData.afstand.find((object) => object.Asset == (assetName).toString()).Diameter).toString().includes("-") ? parseFloat((ObjectData.afstand.find((object) => object.Asset == assetName).Diameter).split("-",2)[1]) : parseFloat((ObjectData.afstand.find((object) => object.Asset == assetName).Diameter))
    setUserDiameterValue(null);
    setDiameterValue(ulsDiaMin)
    setMinDiameterValue(ulsDiaMin)
    setMaxDiameterValue(ulsDiaMax)
    setDiaOverride(false)
    }else{
      setMinDiameterValue("")
    }
  }, [assetName])

  const handleOverride = () => {
    setDiaOverride(!diaOverride)
  }

  const appContext = useContext(AppContext);
  
  const optionNameRef = useRef();
  const distanceRef = useRef();
  const depthRef = useRef();

  const handleUpload = () => {
    const optionName = optionNameRef.current.value;
    const distance = distanceRef.current.value;
    const depth = depthRef.current.value;
    const diameter = diaOverride ? userDiameterValue : diameterValue;

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

    optionNameRef.current.value = ASSET_TYPE_TEXT;
    distanceRef.current.value = null;
    depthRef.current.value = null;

    chooseAssetDisabled = false;
    handleClose();
  }

  const addAssetTooltip = props => (
    <Tooltip {...props}>Add an asset to the profile</Tooltip>
  );

return (
  <>
  <OverlayTrigger placement="top" overlay={addAssetTooltip}>
  <Button className = "B btn-sm" onClick={handleShow}>
    Add
  </Button>
  </OverlayTrigger>

  <Modal {...props}  
    size="lg"
    scrollable
    centered
    backdrop="static"
    show={showPipeModal} 
    onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title className="text-primary h4" >Asset details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
          <Form.Group className="mb-2">
          <Form.Label className="mt-3 text-primary h6">Type</Form.Label>
          {(assetName != ASSET_TYPE_TEXT ) ? chooseAssetDisabled=true: chooseAssetDisabled=false}
          <Form.Select ref={optionNameRef} onChange={(e) => setAssetName(e.target.value)} disabled={chooseAssetDisabled}>
            <option>{ASSET_TYPE_TEXT}</option>
            {ObjectData.afstand.map((object) => (
              <option value={object.Asset} >{object.Beschrijving} ({object.Categorie})</option>
            ))}
          </Form.Select>

         {useMemo(() => (showPipeModal && (assetName != ASSET_TYPE_TEXT) ?
          <>
          <Form.Label className="mt-3 text-primary h6">Diameter of this asset (in meters)</Form.Label>
          {(minDiameterValue != maxDiameterValue && !NOVALUE.includes(assetName) ) ?
            <Form.Group as={Row}>         
              <Col xs="9">
               <RangeSlider
                 disabled = {diaOverride}
                 value={diameterValue}
                 onChange={(e) => setDiameterValue(e.target.value)}
                 onAfterChange={(e) => setFinalDiameterValue(e.target.value)}
                 min = {minDiameterValue}
                 max = {maxDiameterValue}
                 step = {0.001}
                 tooltipPlacement='top'
                 variant = 'primary'
               /> 
              </Col> 
              <Col xs="3">
               <Form.Control 
               disabled
               value={ diameterValue}
               />
              </Col>
              <Col xs="5">
              <ToggleButton
                  className="mb-2 btn-sm"
                  id="toggle-check"
                  type="checkbox"
                  variant="outline-primary"
                  checked={diaOverride}
                  onClick={handleOverride}
                >
                    Override Diameter Range
                </ToggleButton>
                </Col>
                <Col xs="4">
               <Form.Control 
               disabled = {!diaOverride}
               value={(userDiameterValue != null || userDiameterValue != '') ? userDiameterValue: null }
               onChange={(e) => setUserDiameterValue(e.target.value)} 
               placeholder="Overrided diameter value"
               type="decimal"
               autoFocus
               />
              </Col>
           </Form.Group>
           : 
           <Form.Control
             onChange={(e) => {setUserDiameterValue(e.target.value) 
              setDiaOverride(true) }}
             defaultValue = {minDiameterValue}
             type="decimal"
             autoFocus
           />
         }

         <Stack gap={1}>
            <Form.Label className="mt-3 text-primary h6">Depth (in meters)</Form.Label>
            <Form.Label className="text-secondary">Length from the horizontal line to the top edge of this asset</Form.Label>
         </Stack>
          <Form.Control
            ref = {depthRef}
            type="decimal"
            placeholder={(ObjectData.afstand.find((object) => object.Asset == assetName).Depth).toString()}
          />
          <Form.Text muted>
            Use point for decimal places. For example 2.50
            Please do not use comma or alphabets in the field. 
          </Form.Text>
          <Stack gap={1}>
            <Form.Label className="mt-3 text-primary h6">Distance (in meters)</Form.Label>
            <Form.Label className="text-secondary">Length from the left vertical line to the center of this asset</Form.Label>
          </Stack>
          <Form.Control
            ref = {distanceRef}
            type="decimal" 
          />
          <Form.Text muted>
            Use point for decimal places. For example 2.50
            Please do not use comma or alphabets in the field. 
          </Form.Text>
          </>
          : null ), [assetName, diameterValue, minDiameterValue, maxDiameterValue, userDiameterValue, diaOverride, showPipeModal])} 
                     
          </Form.Group>
       </Form>
      </Modal.Body>
    <Modal.Footer>
    <Stack direction="horizontal" gap={2}>
      <Button className="B btn-sm" variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button className="B btn-sm" variant="primary" onClick={handleUpload}>
        Upload Asset
      </Button>
      </Stack>
    </Modal.Footer>
  </Modal>
</>
)
}

const Model = () => {
const {filePath} = useContext(AppContext)
const gltf = useLoader(GLTFLoader, filePath);
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
      let moveVertical = window.prompt("Parallely move the first vertical line to?", appContext.storedLineIntersect[1])
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
    let moveVertical = window.prompt("Parallely move the second vertical line to?", appContext.storedLineIntersect[2])
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
  const [showGrid, setShowGrid] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [exportModel, setExportModel] = useState(false);

  const [viewState, dispatch] = useReducer(viewReducer, initialState)
  

  const [showStoredObjectsUpload, setShowStoredObjectsUpload] = useState(false);
  const [storedObjectsUpload, setStoredObjectsUpload] = useState([]);
  const [storedObjectId, setStoredObjectsId] = useState(0);
  const [storedObjectsOrder, setStoredObjectsOrder] = useState([]);
  const [objectConflicts, setObjectConflicts] = useState([]);
  const [objectConflictsLog, setObjectConflictsLog] = useState('');
  const [storedLineIntersect, setStoredLineIntersect] = useState([0,0,25]);
  const [updatedObjectId, setUpdatedObjectId] = useState();
  const [updatedState, setUpdatedState] = useState('NONE');
  const [selectedObjectId, setSelectedObjectId] = useState(0);
  const [filePath, setFilePath] = useState("./Haaksbergweg - bg.gltf");

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
    updatedState: updatedState,
    viewState:viewState,
    selectedObjectId:selectedObjectId,
    filePath: filePath,
    setShowStoredObjectsUpload,
    setStoredObjectsUpload,
    setStoredObjectsId,
    setStoredObjectsOrder,
    setObjectConflicts,
    setObjectConflictsLog,
    setStoredLineIntersect,
    setUpdatedObjectId,
    setUpdatedState,
    dispatch,
    setSelectedObjectId,
    setFilePath
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

  function viewReducer(state, action) {
    switch (action.type) {
      case FRONT:
        return {...state,
        view: FRONT, 
        positionX: 0,
        positionY: 0,
        positionZ: 200,
        rotate: false
      }
      case TOP:
        return {...state,
          view: TOP,
          positionX: 0,
          positionY: 200,
          positionZ: 0,
          rotate: false
      }
      case ROTATE:
        return {...state,
          view: ROTATE,
          positionX: localStorage.getItem('camera.hasPosition') != 'true' ? 30 : parseFloat(localStorage.getItem('camera.position.x')),
          positionY: localStorage.getItem('camera.hasPosition') != 'true' ? 20 : parseFloat(localStorage.getItem('camera.position.y')),
          positionZ: localStorage.getItem('camera.hasPosition') != 'true' ? 200 : parseFloat(localStorage.getItem('camera.position.z')),
          rotate: true
      }
      case PERSPECTIVE:
        return {...state,
          view: PERSPECTIVE,
          positionX: localStorage.getItem('camera.hasPosition') != 'true' ? 30 : parseFloat(localStorage.getItem('camera.position.x')),
          positionY: localStorage.getItem('camera.hasPosition') != 'true' ? 20 : parseFloat(localStorage.getItem('camera.position.y')),
          positionZ: localStorage.getItem('camera.hasPosition') != 'true' ? 200 : parseFloat(localStorage.getItem('camera.position.z')),
          rotate: false
      }
      default:
        return { view: DEFAULT,
          positionX: 30,
          positionY: 20,
          positionZ: 200,
          rotate: true
      }
    }
}



function TransferDataModal(props) {
  
  const [showTransferDataModal, setShowTransferDataModal] = useState(false);
  const [downloadData, setDownloadData] = useState(false);
  const textAreaRef = useRef();
  
  const handleCloseTransferDataModal = () => {
    setShowTransferDataModal(false);
    setDownloadData(false)
    
  }
  const handleShowTransferDataModal = () => {
  setShowTransferDataModal(true);
}

const handleDownloadData = () => {
  setDownloadData(true)
  console.log(getLocalStorage())
}


function getLocalStorage() {
  var a = {};
  for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      var v = localStorage.getItem(k);
      a[k] = v;
  }
  var s = JSON.stringify(a);
  return s;
}

function writeLocalStorage(data) {
  var o = JSON.parse(data);
  for (var property in o) {
      if (o.hasOwnProperty(property)) {
          localStorage.setItem(property, o[property]);
      }
  }
}

const handleUploadData = () => {
  setDownloadData(false)
  writeLocalStorage(textAreaRef.current.value)
  handleCloseTransferDataModal()
  window.location.reload()
}

const transferDataToolip = props => (
  <Tooltip {...props}>Download/Upload profile data</Tooltip>
);

const downloadDataToolip = props => (
  <Tooltip {...props}>Download profile data for use in another browser</Tooltip>
);

const uploadDataToolip = props => (
  <Tooltip {...props}>Upload data from another profile</Tooltip>
);

return(
  <>
 <OverlayTrigger placement="top" overlay={transferDataToolip}>
    <Button onClick={handleShowTransferDataModal} className = "B btn-sm">
      Transfer data
    </Button>
 </OverlayTrigger>
  
    <Modal {...props} size="lg"
    backdrop="static"
  centered
  show={showTransferDataModal} 
  onHide={handleCloseTransferDataModal}>
    <Modal.Header closeButton>
      <Modal.Title className="text-primary h4">Download data from this profile, or Upload asset data to this profile</Modal.Title>
  </Modal.Header>
    <Modal.Body>
    <Form>
    <Form.Group className="mb-1" >
      <Form.Control className="h-100 w-100" as="textarea" rows={7}  ref = {textAreaRef} readOnly = {downloadData}>
        {downloadData ? textAreaRef.current.value= getLocalStorage() : null} 
      </Form.Control>
      </Form.Group>
      </Form>
    </Modal.Body>

    <Modal.Footer>
      <>
      <Stack direction="horizontal" gap={2}>
        <OverlayTrigger placement="left" overlay={downloadDataToolip}>
          <Button onClick={handleDownloadData} className = "B btn-sm">
            Download
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="left" overlay={uploadDataToolip}>
          <Button onClick={handleUploadData} className = "B btn-sm">
            Upload
          </Button>
        </OverlayTrigger>
          <Button variant="secondary" onClick={handleCloseTransferDataModal} className="B btn-sm">
            Close
          </Button>
      </Stack>
    </>
  </Modal.Footer>
    </Modal>
  </>
)
}

function InfoModal() {
  
  const handleCloseInfoModal = () => {
      setShowInfoModal(false);
  }

return(
  <> 
    <Modal 
    size="xl"
    backdrop="static"
    centered
    scrollable
    show={showInfoModal} 
    onHide={handleCloseInfoModal}>
    <Modal.Header closeButton>
      <Modal.Title className="text-primary h4">Instructions</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <InfoModalContent/>
    </Modal.Body>

    <Modal.Footer>
      <>
    <Button variant="secondary" onClick={handleCloseInfoModal} className="B btn-sm">
      Close
    </Button>
    </>
  </Modal.Footer>
    </Modal>
  </>
)

}


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

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const modelHandler= (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    console.log('fileObj is', fileObj);

    event.target.value = null;

    console.log(event.target.files);

    console.log(fileObj);
    console.log(fileObj.name);
    if(fileObj.size > 50000000) { 
      console.log("Cancel Upload")
      return window.alert("File size too big")};
    setFilePath(fileObj.name)
  }

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

  const handleExport = () => {
    setExportModel(true)
  }
  const handleGrid = () => {
    setShowGrid(!showGrid)
  }
  const handleInfoButton = () => {
    setShowInfoModal(true)
  }

  function SavedAssetModal(props) {
  
    const [showSavedAssetModal, setShowSavedAssetModal] = useState(false);
    
    const handleCloseAssetModal = () => {setShowSavedAssetModal(false);
      setRestore(false)
      setRestoreObjectId(0)
    }
    const handleShowAssetModal = () => {
    handleSave();
    setShowSavedAssetModal(true);}
    const [saveObjects, setSaveObjects] = useState([]);
    const [restore, setRestore] = useState(false);
    const [restoreObjectId, setRestoreObjectId] = useState(0);


  const handleSave = () => {
    var currentObjects2 = storedObjectsUpload.slice();
    
    var currentOrder = storedObjectsOrder.slice();
    var tempSaveObjects = currentObjects2.filter(o => currentOrder.includes(o.objectId))
        
    tempSaveObjects.sort((a, b) => {
          return a.distance.distance - b.distance.distance;
        });

    console.log(tempSaveObjects)
    var deletedObject = currentObjects2.filter(o => !currentOrder.includes(o.objectId))
    var tempDeletedObj = deletedObject.slice()
    
    console.log(tempDeletedObj)

    tempSaveObjects = [...tempSaveObjects, ...tempDeletedObj]
    console.log(tempSaveObjects)
  
    setSaveObjects(tempSaveObjects)
  }

  const handleRestore = (i, event) => {
    event.stopPropagation();
    setRestore(true)
    console.log(restore)
    
    setRestoreObjectId(saveObjects[i].objectId);
    console.log(saveObjects[i].objectId)
    
  }

  useEffect(() => {
    if(restore != false && restoreObjectId != 0){
    setUpdatedObjectId(restoreObjectId)
    setUpdatedState('ADDED')
    setRestoreObjectId(0);
    }
  }, [restore])

  const saveTooltip = props => (
    <Tooltip {...props}>Check details of all the assets</Tooltip>
  );

  return(
    <>
    <OverlayTrigger placement="top" overlay={saveTooltip}>
      <Button className = "B btn-sm" onClick={handleShowAssetModal}>
        Asset Details
      </Button>
      </OverlayTrigger>
     
    
      <Modal {...props} 
      size="xl"
      backdrop="static"
      centered
      scrollable
      show={showSavedAssetModal} 
      onHide={handleCloseAssetModal}>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary h4">All asset details</Modal.Title>
    </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Order</th>
            <th>Asset Id</th>
            <th>Asset Name</th>
            <th>Diameter</th>
            <th>Depth</th>
            <th>Distance</th>
            <th>Restore</th>
          </tr>
        </thead>
        <tbody>
         
        {saveObjects.map((obj,i) => (
          <tr data-index={i}>           
            <td>{i+1}</td>
            <td>{(storedObjectsOrder.findIndex(objectId => objectId == obj.objectId)) >= 0 
                  ? (storedObjectsOrder.findIndex(objectId => objectId == obj.objectId) + 1) 
                  : (storedObjectsOrder.findIndex(objectId => objectId == obj.objectId))}
            </td>
            <td>{obj.objectId}</td>
            <td>{obj.assetId.optionName}</td>
            <td>{obj.diameter.diameter}</td>
            <td>{obj.depth.depth}</td>
            <td>{obj.distance.distance}</td>
            <td>{(storedObjectsOrder.findIndex(objectId => objectId == obj.objectId)) < 0 ? (<ToggleButton
                  //ref={assetIdRef}
                  className="mb-2 btn-sm"
                  id="toggle-check"
                  type="checkbox"
                  variant="outline-primary"
                  checked= {restore}
                  onClick={(event) => handleRestore(i,event)}
                >
                  Restore Asset
                </ToggleButton> )
                : ( <ToggleButton
                disabled
                className="mb-2 btn-sm"
                id="toggle-check"
                type="checkbox"
                variant="outline-primary"
              >
                   Restore Asset
                </ToggleButton>
                )}
                </td>
            </tr>
        ))}
         
        </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <>
      <Button variant="secondary" onClick={handleCloseAssetModal} className="B btn-sm">
        Close
      </Button>
      </>
    </Modal.Footer>
      </Modal>
    </>
)

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

  const InfoTooltip = props => (
    <Tooltip {...props}>Check instructions to use the tool</Tooltip>
  );
  const exportModalTooltip = props => (
    <Tooltip {...props}>Export 3D modal (.gltf) of the profile</Tooltip>
  );

  const uploadModalTooltip = props => (
    <Tooltip {...props}>Add 3D modal to the profile</Tooltip>
  );
  const clearAllTooltip = props => (
    <Tooltip {...props}>This will clear all assets from the profile</Tooltip>
  );

  const gridTooltip = props => (
    <Tooltip {...props}>Enable/Disable grid to measure (Each grid is 0.5 m)</Tooltip>
  );

  const rotateViewTooltip = props => (
    <Tooltip {...props}>Turn on view rotation (Press Alt+R to save rotation settings)</Tooltip>
  );

  const frontViewTooltip = props => (
    <Tooltip {...props}>Turn on front view</Tooltip>
  );

  const topViewTooltip = props => (
    <Tooltip {...props}>Turn on top view</Tooltip>
  );

  const persViewTooltip = props => (
    <Tooltip {...props}>Turn on perspective (3D) view</Tooltip>
  );

  const exporter = new GLTFExporter();

  const ExportGLTF = () => {
  const { scene } = useThree();
      if(exportModel){      
        exporter.parse(scene , function ( gltf ) {
          const output = JSON.stringify( gltf, null, 2 );
          console.log( output );
          saveString( output, 'Street_Profile.gltf' );
          //downloadJSON( gltf ); //check and create a button  
          setExportModel(false)
        },function ( error ) {
          console.log( 'An error happened during parsing', error );
        }, );
      }
}

  const link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link ); // Firefox workaround, see #6594

			function save( blob, filename ) {

				link.href = URL.createObjectURL( blob );
				link.download = filename;
				link.click();

				// URL.revokeObjectURL( url ); breaks Firefox...

			}

			function saveString( text, filename ) {
				save( new Blob( [ text ], { type: 'text/plain' } ), filename );
			}
  
  return (
    <AppContext.Provider value={showSettings}>
    
    <div className= "Interaction-flexbox-container" >


    < div className= "flexbox-interaction conflicts-log">
      <ToastContainer position='top-end'>
        <Toast className="d-inline-block m-1" bg={objectConflicts.length == 0 ? "success":"danger"} show={selectedObjectId===0?false:true}>
          <Toast.Header closeButton = {false}>
            <strong className="me-auto">Conflicts log</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            <strong><NewlineText text={objectConflictsLog} /> </strong>
          </Toast.Body>
        </Toast>
       </ToastContainer> 

    </div>

    < div className= "flexbox-interaction info-button">
      <OverlayTrigger placement="left" overlay={InfoTooltip}>          
        <Button className = "B lg" onClick={handleInfoButton}>
          <i className="bi bi-info-circle"></i>
        </Button>
      </OverlayTrigger>
    </div>
    
      
      < div className= "flexbox-interaction buttons">
        {/* <DropdownButton as={ButtonGroup} title="Add" id="bg-nested-dropdown">
          <Dropdown.Item eventKey="2"><PipeModal/></Dropdown.Item>
          <Dropdown.Item eventKey="3"><OrderModal/></Dropdown.Item>
        </DropdownButton> */}

      <ButtonToolbar className="mb-3">
      <Button variant="outline-dark" className = "B btn-sm" disabled>Views:</Button>

        <OverlayTrigger placement="top" overlay={rotateViewTooltip}>          
        <Button className = "B btn-sm" onClick={() => dispatch({ type: ROTATE })}>
                  Rotation
        </Button>
        </OverlayTrigger>

        <ButtonGroup className="mb-2">  
          <OverlayTrigger placement="top" overlay={frontViewTooltip}>          
          <Button className = "B btn-sm" onClick={() => dispatch({ type: FRONT })}>
                    Front
          </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={topViewTooltip}>          
          <Button className = "B btn-sm" onClick={() => dispatch({ type: TOP })}>
                    Top
          </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={persViewTooltip}>          
          <Button className = "B btn-sm" onClick={() => dispatch({ type: PERSPECTIVE })}>
                    Perspective
          </Button>
          </OverlayTrigger>
        </ButtonGroup>

        </ButtonToolbar>

        <ButtonToolbar className="mb-3">
        <Button variant="outline-dark" className = "B btn-sm" disabled>Show:</Button>

        <OverlayTrigger placement="top" overlay={gridTooltip}>
          <Button  className = "B btn-sm" onClick= {handleGrid}>
                    Grid
          </Button>
        </OverlayTrigger>
        
        <SavedAssetModal/>
        </ButtonToolbar>
        

        <div>
        <InfoModal />

        <ButtonToolbar className="mb-3">
        <Button variant="outline-dark" className = "B btn-sm" disabled>Asset:</Button>

        <PipeModal/>

        <OverlayTrigger placement="top" overlay={clearAllTooltip}>
            <Button variant="danger" className = "B btn-sm" onClick={handleClearData}>
                Clear all
            </Button>
        </OverlayTrigger>
        </ButtonToolbar>
        
        {/* <br/><br/>

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
          </Form> */}

        <ButtonToolbar className="mb-3">
          <Button variant="outline-dark" className = "B btn-sm" disabled>3D Model:</Button>

          <OverlayTrigger placement="top" overlay={uploadModalTooltip}>
            <Button onClick={handleClick} className = "B btn-sm">
                Upload background
            </Button>
          </OverlayTrigger>
          
          <br/>
          <ButtonGroup className="mb-2">
          <TransferDataModal/>
            <br/>
            <OverlayTrigger placement="top" overlay={exportModalTooltip}>
            <Button onClick={handleExport} className = "B btn-sm">
                Export 3D profile
            </Button>
            </OverlayTrigger>
          </ButtonGroup>  
          <br/>
        </ButtonToolbar>
          
          
          <input
            type = "file"
            id="file-input"
            ref={hiddenFileInput}
            onChange={modelHandler}
            accept=".gltf, .glb, .obj"
            style={{display: 'none'}}
          />
        </div>
      
        {/* arrObj = <AddObjectsFromCSVModal show = {show} objects = {values} />; */}
        {/* <AddObjectsFromCSVModal show = {show} objects = {values} /> */}
      
      </div>
      
      {/* <div className='flexbox-interaction background'>
      <img src = {background}  z-index = '-1'/>
      </div> */}
    <div className='flexbox-interaction grid'>
      <div className='flexbox-interaction canvas'>
      {/* <Canvas camera={ {position: [2,2,10], fov: 70}} > */}
      <Canvas orthographic camera={ {position: [0,0,200], zoom: getZoom() , top:200, bottom:-200, left:200, right:200, near:0, far:2000 }}>
        <ExportGLTF />
      <AppContext.Provider value={showSettings}>
        <group>
        <Suspense fallback={null}>
          <CameraController />
          
          <ambientLight intensity={0.25} color={0xFFFFFF} />
          <pointLight intensity={0.75} position={[500, 500, 1000]} />
          {/* <directionalLight position={[100, 100, 100]} color={0xFFFFFF} /> */}

          <mesh rotation={[Math.PI/2,0,0]} position ={[30, 30, 0]} visible ={showGrid} >
          <gridHelper args={[100,200,"#f0f0ed","#f0f0ed"]} />
          </mesh>
        </Suspense>  
          
        <Suspense fallback={<Loader/>}>
          <mesh position={[-15,-10,0]}>
            <Model />
            
            <ControlLines />
            {/* <AddObjectsFromCSVModal show = {show} objects = {values} /> */}
            
            {/* <UploadObjects /> */}

            {/* TODO: reduce the number of input parameters show? */}
            {/* <UploadObjectFromLocalStorage show = 'true' objects = {storedObjectsUpload} order = {storedObjectsOrder} setObjectConflicts = {setObjectConflicts} objectConflicts = {objectConflicts} setObjectConflictsLog = {setObjectConflictsLog}/> */}
            
            <GetAllObjects storedObjectsOrder = {storedObjectsOrder} updatedObjectId = {updatedObjectId} updatedState ={updatedState} />
            
          </mesh>
        </Suspense>
        </group>
      </AppContext.Provider> 
      </Canvas>
      {/* <Order objects = {storedObjectsUpload} /> */}
      </div>
      
        <div className='my-legend'>
          <div className='legend-title'>Legend</div>
          <div className='legend-scale'>
            <ul className='legend-labels'>
            {(legendObjects.length>0)?(uniqueColors.map((object) => (
              <li><span style={{background:object}}></span>
              {Object.values(currentObjects.find(o => Object.values(o.color) == object).assetId)[0]}</li>
                ))): null}
              <li><span style={{background:"#faf202"}}></span>Selected</li>
              <li><span style={{background:"#fc2808"}}></span>Conflict</li>
            </ul>
          </div>
        </div>
    </div>
      
    </div>
    </AppContext.Provider>
  )
}

export default App;
