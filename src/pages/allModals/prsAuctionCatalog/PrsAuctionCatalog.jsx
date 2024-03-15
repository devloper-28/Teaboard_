import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import PrsAuctionCatalogFormModal from "./modal/PrsAuctionCatalogModal";

// import PrsAuctionCatalogFormModal from "./modal/PrsAuctionCatalogModal";

function PrsAuctionCatalog({ open, setOpen, modalRight }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="PRS Auction Catalog"
          show={open === "prsAuctionCatalog" ? true : false}
          handleClose={() => setOpen("")}
        >
          <PrsAuctionCatalogFormModal
            dataList={dataList}
            setDataList={setDataList}
            modalRight={modalRight}
          />
        </Modal>
      )}
    </div>
  );
}

export default PrsAuctionCatalog;
