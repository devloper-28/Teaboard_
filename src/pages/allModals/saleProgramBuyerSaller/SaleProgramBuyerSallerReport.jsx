import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import SaleProgramBuyerSallerReportModal from "./modal/SaleProgramBuyerSallerReportModal";

function SaleProgramBuyerSallerReport({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Sale Program"
          show={open === "saleProgramBuyerSallerReport" ? true : false}
          handleClose={() => setOpen("")}
        >
          <SaleProgramBuyerSallerReportModal
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default SaleProgramBuyerSallerReport;
