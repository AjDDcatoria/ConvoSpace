import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function VirticalModal({ children, submitfunc, ...props }) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="modal-create">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text-green-400"
        >
          {props.heading}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-create flex flex-col gap-2">
        <h4>{props.title}</h4>
        {children}
      </Modal.Body>
      <Modal.Footer className="modal-create">
        <Button onClick={submitfunc}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VirticalModal;
