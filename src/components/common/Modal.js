import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { Modal as BootstrapModal } from "react-bootstrap";
import { useSelector } from "react-redux";

function Modal({ children, show, handleClose, title, size }) {
  const activeClass = useSelector((state) => state.toggle.activeClass);

  return (
    <>
      <BootstrapModal
        // className="modal-fullscreen-sm-down"
        show={show}
        onHide={handleClose}
        size={size}
        // fullscreen="sm-down"
        backdrop="static"
        centered
      >
        <BootstrapModal.Header>
          <BootstrapModal.Title>{title}</BootstrapModal.Title>
          <i className="fa fa-times CloseModal" onClick={handleClose}></i>
        </BootstrapModal.Header>
        <BootstrapModal.Body>{children}</BootstrapModal.Body>
      </BootstrapModal>
      {/* <div className={activeClass ? "active MainComponent" : "MainComponent "}>
        <div className="container-fluid">
          <div className="AuctionScreen">{show ? children : ""}</div>
        </div>{" "}
      </div>{" "} */}
    </>
  );
}
export default Modal;
