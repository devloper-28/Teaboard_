import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import TeaQualityReportModal from "./modal/TeaQualityReportModal";

function TeaQualityReport({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Tea Quality Report"
          show={open === "teaQualityReport" ? true : false}
          handleClose={() => setOpen("")}
        >
          <TeaQualityReportModal
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default TeaQualityReport;
