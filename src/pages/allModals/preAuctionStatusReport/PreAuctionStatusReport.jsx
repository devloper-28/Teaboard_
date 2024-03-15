import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import PreAuctionStatusReportModal from "./modal/PreAuctionStatusReportModal";

function PreAuctionStatusReport({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Pre Auction Status Report"
          show={open === "preAuctionStatusReport" ? true : false}
          handleClose={() => setOpen("")}
        >
          <PreAuctionStatusReportModal
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default PreAuctionStatusReport;
