import React, {useEffect, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button, Form} from 'react-bootstrap';
import ObjectData from '../uitlegschemaAfstand.json';
import UploadObjects from "./UploadObjects";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' ;
import { generateUUID } from "three/src/math/MathUtils";

const LOCAL_STORAGE_KEY = 'localData.objects'

function PipeModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [objects, setObjects] = useState([]);
    
    const optionNameRef = useRef();
    const distanceRef = useRef();
    const depthRef = useRef();
    const diameterRef = useRef();

    useEffect(() => {
      const storedObjects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      if (storedObjects) {
        setObjects(storedObjects);
        console.log(storedObjects)
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

      if (optionName === '') return
      else if (distance === '') return
      else if (depth === '') return
      else if (diameter === '') return
      
      const object =[{"diameter": diameter, "depth": depth}];
      console.log({object});
      console.log({distance});

      setObjects(prevObjects => {
        return [...prevObjects,{object: {object}, distance: {distance} }]
      })

    //  <Canvas>
        
    //     <CameraController />
         
    //     <ambientLight color={0xFFFFFF} />
    //   <UploadObjects object = {object} distance= {distance} />
     
    //   </Canvas>
      
      optionNameRef.current.value = null;
      distanceRef.current.value = null;
      depthRef.current.value = null;
      diameterRef.current.value = null;

      setShow(false)
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
      show={show} 
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
              {ObjectData.afstand.map((object,i) => (
                <option value="i" >{object.Beschrijving} ({object.Categorie})</option>
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

export default PipeModal