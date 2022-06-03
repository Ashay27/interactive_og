import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button, Form} from 'react-bootstrap';

function OrderModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <>
    <Button className="nextButton" onClick={handleShow}>
      Set Order
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
            <Form.Select >
              <option>Choose the type of pipe</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="textarea"
              autoFocus
            />
            <Form.Label>Diameter</Form.Label>
            <Form.Control
              type="decimal"
              autoFocus
            />
            <Form.Label>Depth</Form.Label>
            <Form.Control
              type="decimal"
              //placeholder="name@example.com"
              autoFocus
            />
              
            </Form.Group>
         </Form>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default OrderModal