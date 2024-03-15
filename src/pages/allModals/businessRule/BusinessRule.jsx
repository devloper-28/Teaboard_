import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import BusinessRuleModal from "./modal/BusinessRuleModal";

function BusinessRule({ open, setOpen }) {
  const [dataList, setDataList] = useState(
    JSON.parse(sessionStorage.getItem("Data")) || []
  );

  return (
    <div className="invoice-modal">
      {open && (
        <Modal
          size="xl"
          title="Business Rule"
          show={open === "businessRule" ? true : false}
          handleClose={() => setOpen("")}
        >
          <BusinessRuleModal dataList={dataList} setDataList={setDataList} />
        </Modal>
      )}
    </div>
  );
}

export default BusinessRule;
