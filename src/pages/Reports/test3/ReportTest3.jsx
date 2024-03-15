import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import { PrintProvider } from "../PrintDataTable";
import ReportToolComponent from "../ReportToolComponent";

function ReportTest3({ open, setOpen }) {
  const [titles, setTitle] = useState("DealBook From SP");
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
            show={open === "test3" ? true : false}
            handleClose={() => setOpen("")}
          >
            <ReportToolComponent modalTitle={modalTitle} reportingId={3}/>
          </Modal>
        )}
      </div>
    </PrintProvider>
  );
}

export default ReportTest3;
