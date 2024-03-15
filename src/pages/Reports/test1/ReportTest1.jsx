import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import { PrintProvider } from "../PrintDataTable";
import ReportToolComponent from "../ReportToolComponent";

function ReportTest1({ open, setOpen }) {
  const [titles, setTitle] = useState("Test 1");
  function modalTitle(title) {
    setTitle(title);
  }
  return (
    <PrintProvider>
      <div className="invoice-modal">
        {open && (
          <Modal
            size="xl"
            title={titles}
            show={open === "test1" ? true : false}
            handleClose={() => setOpen("")}
          >
            <ReportToolComponent modalTitle={modalTitle} reportingId={1}/>
          </Modal>
        )}
      </div>
    </PrintProvider>
  );
}

export default ReportTest1;
