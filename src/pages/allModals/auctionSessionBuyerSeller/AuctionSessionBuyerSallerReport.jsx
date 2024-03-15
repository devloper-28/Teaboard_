import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import AuctionSessionBuyerSallerReportModal from "./modal/AuctionSessionBuyerSallerReportModal";

function AuctionSessionBuyerSallerReport({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Auction Session"
          show={open === "auctionSessionBuyerSallerReport" ? true : false}
          handleClose={() => setOpen("")}
        >
          <AuctionSessionBuyerSallerReportModal
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default AuctionSessionBuyerSallerReport;
