import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({
  show,
  onHide,
  onDelete,
  setRemark,
  remarkShow,
  isokbutton,
  title,
}) => {
  const [remark] = useState(remarkShow ? remarkShow : true);
  const handleDelete = (e) => {
    onDelete(e); // Perform actual delete action
  };

  return (
    <Modal show={show} onHide={onHide} animation={true} className="DeleteModal">
      <form>
        <Modal.Header>
          <Modal.Title>Cancel Confirmation</Modal.Title>
          <i className="fa fa-times CloseModal" onClick={onHide}></i>
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
            <Button
              type={"submit"}
              className="SubmitBtn"
              onClick={handleDelete}
            >
              {isokbutton === "Yes" ? "Ok" : "Yes"}
            </Button>
            <Button onClick={onHide} className="SubmitBtn">
              No{" "}
            </Button>
          </div>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default ConfirmationModal;
