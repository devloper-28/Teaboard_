import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({
  show,
  onHide,
  onYes,
  setRemark,
  remarkShow,
  title,
}) => {
  const [remark] = useState(remarkShow ? remarkShow : true);
  const handleDelete = () => {
    onYes(); // Perform actual delete action
  };

  return (
    <Modal show={show} onHide={onHide} animation={true} className="DeleteModal">
      <form>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
          <i className="fa fa-times CloseModal"  onClick={onHide}></i>
        </Modal.Header>
        <Modal.Body>
          <h3>{title}</h3>
          <input
            style={{ display: remarkShow === true ? "block" : "none" }}
            type="textarea"
            required
            onChange={(e) => setRemark(e.target.value)}
          />
          <div className="BtnGroup">
          <Button className="SubmitBtn" type="submit" onClick={handleDelete}>
            Yes
          </Button>
          <Button className="SubmitBtn" onClick={onHide}>
            No
          </Button>
        </div>
        </Modal.Body>
        
      </form>
    </Modal>
  );
};

export default ConfirmationModal;
