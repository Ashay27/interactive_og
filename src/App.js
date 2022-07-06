
import './App.css';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
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
import AppContext from './Components/AppContext';
import ChangeOrder from './Components/ChangeOrder';
import background from './haaksbergwegBackground.png'
import { Vector3 } from 'three';

const LOCAL_STORAGE_KEY = 'localData.objects'
const LOCAL_ID_KEY = 'localData.id'
const LOCAL_ORDER_KEY = 'localData.order'

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

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);
      gl.setPixelRatio(window.devicePixelRatio);
      gl.setSize(window.innerWidth, window.innerHeight,true);

      controls.minDistance = 3;
      controls.maxDistance = 5;
      controls.enableRotate = true;
      
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

function PipeModal(props) {
  const [showPipeModal, setShowPipeModal] = useState(false);
  const handleClose = () => setShowPipeModal(false);
  const handleShow = () => setShowPipeModal(true);
  const [sketchPickerColor, setSketchPickerColor] = useState("#BD9F9F");
  const [objects, setObjects] = useState([]);

  const appContext = useContext(AppContext);
  
  const optionNameRef = useRef();
  const distanceRef = useRef();
  const depthRef = useRef();
  const diameterRef = useRef();

  // useEffect(() => {
  //   const storedObjects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  //   if (storedObjects) {
  //     setObjects(storedObjects);
  //     console.log(storedObjects);
      
  //     //window.storedObjectsUpload  = [...storedObjects]; 
  //     //console.log(storedObjects[0].diameter);
  //   }
  // }, [])

  useEffect(() => {
    const storedObjects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedObjects) {
      setObjects(storedObjects);
      appContext.setStoredObjectsUpload(storedObjects);

      console.log(storedObjects);
      
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(objects))
  }, [objects])

  

  const handleUpload = () => {
    const optionName = optionNameRef.current.value;
    const distance = distanceRef.current.value;
    const depth = depthRef.current.value;
    const diameter = diameterRef.current.value;
    const color = sketchPickerColor;

    //TODO: Validate if input of distance, depth and diameter is not string (only float and number is valid) and is greater than 0
    if (optionName === 'Choose the type of pipe') return window.alert("Please choose the type of object")
    else if (distance === '') return
    else if (depth === '') return
    else if (diameter === '') return  
    
    // const object =[{'diameter': diameter, 'depth': depth}];
    // console.log(object);
    // console.log({distance});
    console.log({optionName});

    appContext.storedObjectId += 1;
    appContext.setStoredObjectsId(appContext.storedObjectId)
    console.log(appContext.storedObjectId);

    

    setObjects(prevObjects => {
      return [...prevObjects,{diameter: {diameter}, depth:{depth}, distance: {distance}, assetId: {optionName}, objectId: (appContext.storedObjectId), color: {color} }]
    })
    

    appContext.setStoredObjectsOrder(prevOrder => {
           return [...prevOrder, {objectId: appContext.storedObjectId}]
     })
    //console.log(Object.values(appContext.storedObjectsOrder))

    optionNameRef.current.value = null;
    distanceRef.current.value = null;
    depthRef.current.value = null;
    diameterRef.current.value = null;

    setShowPipeModal(false);
    //showStoredObjectsUpload = true;
    window.location.reload(true);
  }

return (
  <>
  <Button className="nextButton" onClick={handleShow}>
    Add Object
  </Button>

  <Modal {...props}  
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    show={showPipeModal} 
    onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Pipe details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Type</Form.Label>
          <Form.Select ref={optionNameRef}>
            <option >Choose the type of pipe</option>
            {ObjectData.afstand.map((object) => (
              <option value={object.Asset} >{object.Beschrijving} ({object.Categorie})</option>
            ))}
          </Form.Select>
          {/* <Form.Label>Name</Form.Label>
          <Form.Control
            type="textarea"
            autoFocus
          /> */}
          <Form.Label>Diameter</Form.Label>
          <Form.Control
            ref = {diameterRef}
            type="decimal"
            autoFocus
          />
          <Form.Label>Depth</Form.Label>
          <Form.Control
            ref = {depthRef}
            type="decimal"
            //placeholder="name@example.com"
            autoFocus
          />
          <Form.Label>Distance</Form.Label>
          <Form.Control
            ref = {distanceRef}
            type="decimal"
            //value = "1"
            autoFocus
            //disabled 
          />

          <Form.Label>Color</Form.Label>
          <SketchPicker
            onChange={(color) => {
              setSketchPickerColor(color.hex);
            }}
            color={sketchPickerColor}
          />
                     
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
  const gltf = useLoader(GLTFLoader, "./Lega Blocks - Haaksbergweg - Principe straat_noK&L.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={1} />
    </>
  );
};

function App() {
 
  //State to store the values
  const [values, setValues] = useState([]);
  const [show, setShow] = useState(false);
  

  const [showStoredObjectsUpload, setShowStoredObjectsUpload] = useState(false);
  const [storedObjectsUpload, setStoredObjectsUpload] = useState([]);
  const [storedObjectId, setStoredObjectsId] = useState(0);
  const [storedObjectsOrder, setStoredObjectsOrder] = useState([]);
  const [objectConflicts, setObjectConflicts] = useState([]);
  const [objectConflictsLog, setObjectConflictsLog] = useState('');

  const showSettings = {
    showStoredObjectsUpload: showStoredObjectsUpload,
    storedObjectsUpload: storedObjectsUpload,
    storedObjectId: storedObjectId,
    storedObjectsOrder: storedObjectsOrder,
    LOCAL_ORDER_KEY: LOCAL_ORDER_KEY,
    objectConflicts: objectConflicts,
    objectConflictsLog: objectConflictsLog,
    setShowStoredObjectsUpload,
    setStoredObjectsUpload,
    setStoredObjectsId,
    setStoredObjectsOrder,
    setObjectConflicts,
    setObjectConflictsLog
  };

  const objectNumberRef = useRef();
  const orderNumberRef = useRef();

  useEffect(() => {
    setStoredObjectsId(JSON.parse(localStorage.getItem(LOCAL_ID_KEY)));
    const orderObjects = JSON.parse(localStorage.getItem(LOCAL_ORDER_KEY));
    if(orderObjects && orderObjects.length>0){
      setStoredObjectsOrder(orderObjects);
      console.log((orderObjects))
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem(LOCAL_ID_KEY, JSON.stringify(storedObjectId))
    localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(storedObjectsOrder))
  }, [storedObjectId,storedObjectsOrder])

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

  const handleChangeOrder = event => {
    if (storedObjectsUpload === "" && storedObjectsUpload.length <= 1) return (
      window.alert("INVALID. More than 1 objects required!"))

    if(objectNumberRef.current.value === '' || objectNumberRef.current.value <= 0 ) return (
      window.alert("INVALID object number. Fill the correct objects number! \nIt should not be empty and greater than 0"))
    else if (orderNumberRef.current.value === '' || orderNumberRef.current.value <= 0) return (
      window.alert("INVALID order number. Fill the correct order number! \nIt should not be empty and greater than 0"))

  //  if(storedObjectsOrder.length<2) return window.alert("INVALID. More than 1 objects required!")
    var order = storedObjectsOrder.slice();
    var tempObj = order.splice(objectNumberRef.current.value-1,1);
    order.splice(orderNumberRef.current.value-1,0,tempObj[0]);
    setStoredObjectsOrder(order);

    objectNumberRef.current.value = null;
    orderNumberRef.current.value = null;
  }

  const handleDelete = () => {
    // Only deleting from order, since uploading objects only if they exist in order
    if (storedObjectsUpload === "" ) return (
      window.alert("INVALID. At least 1 object should be added!"))

    if(objectNumberRef.current.value === '' || objectNumberRef.current.value <= 0 ) return (
      window.alert("INVALID object number. Fill the correct objects number! \nIt should not be empty and greater than 0"))
    else if ( objectNumberRef.current.value > storedObjectsOrder.length) return (
        window.alert("INVALID object number. \nThis should be less than or equal to the current number of objects in the profile.")
      )
    else if (!(orderNumberRef.current.value === ''))  return (
      window.alert("INVALID input at 'Change Order to'. \nIt should be empty"))
    
    var order = storedObjectsOrder.slice();
    order.splice(objectNumberRef.current.value-1,1);
    console.log({order});
    setStoredObjectsOrder(order);

    window.location.reload(true);

    objectNumberRef.current.value = null;
    orderNumberRef.current.value = null;
  }

  const handleClearData = () => {
    if (window.confirm("This will clear all the data loaded for the profile. Press OK to confirm.") == true) {
      localStorage.clear();
      window.location.reload(true);
    } else { 
      return
    }
  }

  function NewlineText(props) {
    const text = props.text;
    const newText = text.split('\n').map(str => <p>{str}</p>);
    
    return newText;
  }
  
  return (
    <AppContext.Provider value={showSettings}>
    
    <div className= "Interaction-flexbox-container" >


    < div className= "flexbox-interaction conflicts-log">
        <p> Click on an object to see the related conflicts </p>
        <NewlineText text={objectConflictsLog} />
    </div>
      
      < div className= "flexbox-interaction buttons">
        {/* <DropdownButton as={ButtonGroup} title="Add" id="bg-nested-dropdown">
          <Dropdown.Item eventKey="2"><PipeModal/></Dropdown.Item>
          <Dropdown.Item eventKey="3"><OrderModal/></Dropdown.Item>
        </DropdownButton> */}
        

        <div>
          <Form>
          <Form.Label>Object Number</Form.Label>
          <Form.Control
            ref = {objectNumberRef}
            type="number"
            
          />
          <Form.Label>Change Order to</Form.Label>
          <Form.Control
            ref = {orderNumberRef}
            type="number"
            
          />
          <Button onClick={handleChangeOrder}>
              Change order 
          </Button>
          <br/><br/>
          <Button onClick={handleDelete}>
              Delete object
          </Button>

          <br/><br/>
          <Button onClick={handleClearData}>
              Clear all
          </Button>
          

          </Form>
          <br/>
            
          <PipeModal/>
          <br/><br/>
           
          

          <Button onClick={handleClick}>
              Upload a file
          </Button>
          
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
      
      <div className='flexbox-interaction background'>
      <img src = {background}  z-index = '-1'/>
      </div>
      
      <div className='flexbox-interaction canvas'>
      {/* <Canvas camera={ {position: [2,2,10], fov: 70}} > */}
      <Canvas orthographic camera={ {position: [0,0,10], zoom: 25 }}>
        <group>
        <CameraController />
         
        <ambientLight color={0xFFFFFF} />
        <directionalLight position={[5, 5, 5]} color={0xFFFFFF} />
        
        {/* <Model /> */}
        {/* <AddObjectsFromCSVModal show = {show} objects = {values} /> */}
         
        {/* <UploadObjects /> */}

        {/* TODO: reduce the number of input parameters show? */}
        <UploadObjectFromLocalStorage show = 'true' objects = {storedObjectsUpload} order = {storedObjectsOrder} setObjectConflicts = {setObjectConflicts} objectConflicts = {objectConflicts} setObjectConflictsLog = {setObjectConflictsLog}/>
        </group>
      </Canvas>
      {/* <Order objects = {storedObjectsUpload} /> */}
      </div>

      
      
    </div>
    </AppContext.Provider>
  )
}

export default App;
