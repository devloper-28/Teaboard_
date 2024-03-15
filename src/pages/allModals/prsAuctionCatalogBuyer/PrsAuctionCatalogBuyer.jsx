import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import PrsAuctionCatalogBuyerFormModal from "./modal/PrsAuctionCatalogBuyerModal";

function PrsAuctionCatalogBuyer({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="PRS Auction Catalog Buyer"
          show={open === "prsAuctionCatalogBuyer" ? true : false}
          handleClose={() => setOpen("")}
        >
          <PrsAuctionCatalogBuyerFormModal
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default PrsAuctionCatalogBuyer;
