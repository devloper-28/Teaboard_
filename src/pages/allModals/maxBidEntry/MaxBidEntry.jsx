import React, { useState } from "react";
import Modal from "../../../components/common/Modal";

import MaxBidEntryModal from "./modal/MaxBidEntryModal";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";

function MaxBidEntry({ open, setOpen, modalRight }) {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
  } = useAuctionDetail();
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );
  const [auctionType, setAuctionType] = useState(auction);


  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title={
            auctionType === "ENGLISH" ? "Offline Bid Entry" : "Max Bid Entry"
          }
          show={open === "maxBidEntry" ? true : false}
          handleClose={() => setOpen("")}
        >
          <MaxBidEntryModal
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
            setAuctionTypes={setAuctionType}
          />
        </Modal>
      )}
    </div>
  );
}

export default MaxBidEntry;
