import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import { PrintProvider } from "../PrintDataTable";
import ReportToolComponent from "../ReportToolComponent";

function ReportTest2({ open, setOpen }) {
  const [titles, setTitle] = useState("Test 2");
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
            show={open === "test2" ? true : false}
            handleClose={() => setOpen("")}
          >
            <ReportToolComponent modalTitle={modalTitle} reportingId={2}/>
          </Modal>
        )}
      </div>
    </PrintProvider>
  );
}

export default ReportTest2;
