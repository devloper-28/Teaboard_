import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import ReportToolComponent from "../ReportToolComponent";

function ReportTest4({ open, setOpen }) {
  const [titles, setTitle] = useState("Post Auction Catalog Report");
  function modalTitle(title) {
    setTitle(title);
  }
  return (
      <div className="invoice-modal">
        {open && (
          <Modal
            size="xl"
            title={titles}
            show={open === "test4" ? true : false}
            handleClose={() => setOpen("")}
          >
            <ReportToolComponent modalTitle={modalTitle} reportingId={4}/>
          </Modal>
        )}
      </div>
  );
}

export default ReportTest4;
